import { useState, useEffect, useRef } from 'react';
import { getAllQuestions, updateQuestion, deleteQuestion } from '../../../services/api';
import Modal from '../../../components/Modal';

/* ── shared styles ──────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: 10,
  border: '2.5px solid var(--color-green)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-body)',
  background: 'var(--color-bg-primary)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  boxSizing: 'border-box',
};
const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: 80 };

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deletingQuestion, setDeletingQuestion] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({ loading: false, message: '', error: false });
  const [formData, setFormData] = useState({
    question: '', points: 0, requires_image: false, is_bonus: false, image: null, remove_image: false,
  });
  const [updateStatus, setUpdateStatus] = useState({ loading: false, message: '', error: false });
  const fileInputRef = useRef(null);
  const apiBaseUrl = import.meta.env.VITE_API_URL.split('/api')[0];

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const response = await getAllQuestions();
      if (response.success) setQuestions(response.questions);
      else setError(response.message);
    } catch { setError('Failed to fetch questions'); }
    finally { setLoading(false); }
  };

  const handleQuestionClick = (question) => {
    setEditingQuestion(question);
    setFormData({ question: question.question, points: question.points, requires_image: question.requires_image, is_bonus: question.is_bonus, image: null, remove_image: false });
    setUpdateStatus({ loading: false, message: '', error: false });
  };

  const handleCloseModal = () => setEditingQuestion(null);

  const handleDeleteClick = (e, question) => {
    e.preventDefault(); e.stopPropagation();
    setDeletingQuestion(question);
  };

  const handleCancelDelete = () => {
    setDeletingQuestion(null);
    setDeleteStatus({ loading: false, message: '', error: false });
  };

  const handleConfirmDelete = async () => {
    if (!deletingQuestion) return;
    setDeleteStatus({ loading: true, message: 'Deleting…', error: false });
    try {
      const response = await deleteQuestion(deletingQuestion.id);
      if (response.success) {
        setQuestions(questions.filter(q => q.id !== deletingQuestion.id));
        setDeleteStatus({ loading: false, message: 'Question deleted!', error: false });
        setTimeout(() => setDeletingQuestion(null), 1200);
      } else {
        setDeleteStatus({ loading: false, message: response.message || 'Failed to delete', error: true });
      }
    } catch {
      setDeleteStatus({ loading: false, message: 'Error deleting question', error: true });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => setFormData({ ...formData, image: e.target.files[0], remove_image: false });

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null, remove_image: true });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setUpdateStatus({ loading: true, message: 'Updating…', error: false });
    const submitData = new FormData();
    submitData.append('question', formData.question);
    submitData.append('points', formData.points);
    submitData.append('requires_image', formData.requires_image);
    submitData.append('is_bonus', formData.is_bonus);
    submitData.append('remove_image', formData.remove_image);
    if (formData.image) submitData.append('image', formData.image);
    try {
      const response = await updateQuestion(editingQuestion.id, submitData);
      if (response.success) {
        setQuestions(questions.map(q => q.id === editingQuestion.id ? response.question : q));
        setUpdateStatus({ loading: false, message: 'Question updated!', error: false });
        setTimeout(() => handleCloseModal(), 1200);
      } else {
        setUpdateStatus({ loading: false, message: response.message || 'Failed to update', error: true });
      }
    } catch {
      setUpdateStatus({ loading: false, message: 'Error updating question', error: true });
    }
  };

  const filteredQuestions = questions.filter(q => q.question.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--color-green)', fontSize: '1.2rem', animation: 'pulse 1.5s infinite' }}>
      📜 Loading Clues…
    </div>
  );
  if (error) return (
    <div style={{ padding: '0.75rem 1rem', borderRadius: 10, border: '2px solid var(--color-red)', background: '#ffebee', color: 'var(--color-red)', fontWeight: 700 }}>
      ⚠ {error}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.6rem' }}>📜</span>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-green)', margin: 0 }}>
          All Clues ({filteredQuestions.length})
        </h2>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="🔍 Search clues…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Grid */}
      {filteredQuestions.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: 14, border: '2px dashed var(--color-green)', color: 'var(--color-green)', fontWeight: 700 }}>
          No clues match your search.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {filteredQuestions.map(question => (
            <div
              key={question.id}
              onClick={() => handleQuestionClick(question)}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '2.5px solid var(--color-bg-secondary)',
                padding: '1rem 1.1rem',
                boxShadow: '4px 4px 0 var(--color-bg-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--color-green-dim)'; e.currentTarget.style.borderColor = 'var(--color-green)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 var(--color-bg-secondary)'; e.currentTarget.style.borderColor = 'var(--color-bg-secondary)'; }}
            >
              {/* Badges row */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800,
                  background: question.is_bonus ? '#fff8e1' : 'var(--color-bg-secondary)',
                  color: question.is_bonus ? '#c17900' : 'var(--color-green)',
                  border: `1.5px solid ${question.is_bonus ? '#f9a825' : 'var(--color-green-light)'}`,
                }}>
                  {question.is_bonus ? '⭐ Bonus' : '📗 Standard'}
                </span>
                {question.requires_image && (
                  <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800, background: '#e3f2fd', color: '#0277bd', border: '1.5px solid #81d4fa' }}>
                    📷 Needs Photo
                  </span>
                )}
                <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 800, background: '#fff3e0', color: 'var(--color-brown)', border: '1.5px solid #ffcc80', marginLeft: 'auto' }}>
                  🪙 {question.points} pts
                </span>
              </div>

              {/* Question text */}
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#444', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {question.question}
              </p>

              {/* Question image */}
              {question.image_url && (
                <img
                  src={`${apiBaseUrl}${question.image_url}`}
                  alt={`Q${question.id}`}
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--color-bg-secondary)' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}

              {/* Delete button */}
              <button
                onClick={e => { e.stopPropagation(); handleDeleteClick(e, question); }}
                style={{
                  alignSelf: 'flex-end',
                  padding: '0.35rem 0.8rem',
                  fontSize: '0.78rem',
                  background: '#ffebee',
                  color: 'var(--color-red)',
                  border: '2px solid var(--color-red)',
                  borderRadius: 8,
                  boxShadow: 'none',
                  transform: 'none',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 800,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-red)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ffebee'; e.currentTarget.style.color = 'var(--color-red)'; }}
              >
                🗑 Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Modal ───────────────────────────────────────── */}
      <Modal isOpen={!!editingQuestion} onClose={handleCloseModal}>
        {editingQuestion && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-green)', margin: 0 }}>✏️ Edit Clue</h3>
              <button onClick={handleCloseModal} style={{ fontSize: '1.2rem', background: 'transparent', border: 'none', boxShadow: 'none', color: 'var(--color-green)', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-green)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  📜 Question Text
                </label>
                <textarea name="question" value={formData.question} onChange={handleInputChange} style={textareaStyle} rows={3} required />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-green)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  🪙 Points
                </label>
                <input type="number" name="points" value={formData.points} onChange={handleInputChange} style={inputStyle} min="0" required />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700, color: 'var(--color-green)', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="requires_image" checked={formData.requires_image} onChange={handleInputChange} style={{ width: 16, height: 16, accentColor: 'var(--color-green)', cursor: 'pointer' }} />
                  📷 Requires Image Answer
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700, color: formData.is_bonus ? '#c17900' : 'var(--color-green)', fontSize: '0.9rem' }}>
                  <input type="checkbox" name="is_bonus" checked={formData.is_bonus} onChange={handleInputChange} style={{ width: 16, height: 16, accentColor: '#f9a825', cursor: 'pointer' }} />
                  ⭐ Bonus Question
                </label>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-green)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  🗺 Question Image
                </label>
                {editingQuestion.image_url && !formData.remove_image && (
                  <div style={{ marginBottom: 10 }}>
                    <img src={`${apiBaseUrl}${editingQuestion.image_url}`} alt="Current" style={{ maxHeight: 120, borderRadius: 10, border: '2px solid var(--color-green)' }} />
                    <button type="button" onClick={handleRemoveImage} style={{ display: 'block', marginTop: 6, fontSize: '0.8rem', color: 'var(--color-red)', background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
                      🗑 Remove image
                    </button>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontFamily: 'var(--font-body)', color: 'var(--color-green)', fontWeight: 700, cursor: 'pointer' }} ref={fileInputRef} />
              </div>

              {updateStatus.message && (
                <div style={{ padding: '0.65rem 1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', background: updateStatus.error ? '#ffebee' : '#e8f5e9', color: updateStatus.error ? 'var(--color-red)' : '#2e7d32', border: `2px solid ${updateStatus.error ? 'var(--color-red)' : '#2e7d32'}` }}>
                  {updateStatus.message}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'var(--color-bg-secondary)', color: 'var(--color-green)', border: '2px solid var(--color-green-light)', boxShadow: '2px 2px 0 var(--color-green-light)', borderRadius: 10 }}>
                  Cancel
                </button>
                <button type="submit" disabled={updateStatus.loading} style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}>
                  {updateStatus.loading ? '⏳ Saving…' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* ── Delete Confirm Modal ──────────────────────────────── */}
      <Modal isOpen={!!deletingQuestion} onClose={handleCancelDelete}>
        {deletingQuestion && (
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-red)', margin: '0 0 1rem 0' }}>
              ⚠ Delete Clue?
            </h3>
            <p style={{ margin: '0 0 0.75rem 0', fontWeight: 600, color: '#444' }}>
              This action cannot be undone.
            </p>
            <p style={{ margin: '0 0 1.25rem 0', fontStyle: 'italic', background: 'var(--color-bg-secondary)', padding: '0.75rem', borderRadius: 10, color: 'var(--color-green-dim)', fontSize: '0.9rem' }}>
              "{deletingQuestion.question}"
            </p>

            {deleteStatus.message && (
              <div style={{ padding: '0.65rem 1rem', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', background: deleteStatus.error ? '#ffebee' : '#e8f5e9', color: deleteStatus.error ? 'var(--color-red)' : '#2e7d32', border: `2px solid ${deleteStatus.error ? 'var(--color-red)' : '#2e7d32'}` }}>
                {deleteStatus.message}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={handleCancelDelete} disabled={deleteStatus.loading} style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'var(--color-bg-secondary)', color: 'var(--color-green)', border: '2px solid var(--color-green-light)', boxShadow: '2px 2px 0 var(--color-green-light)', borderRadius: 10 }}>
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDelete} disabled={deleteStatus.loading} style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', background: 'var(--color-red)', border: '2px solid #991a08', boxShadow: '3px 3px 0 #991a08', borderRadius: 10, color: '#fff' }}>
                {deleteStatus.loading ? '⏳ Deleting…' : '🗑 Delete Clue'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewQuestions;
