import { useState } from 'react';
import { createQuestion } from '../../../services/api';

const s = {
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 800,
    color: 'var(--color-green)',
    fontFamily: 'var(--font-body)',
    marginBottom: '0.5rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '2.5px solid var(--color-green)',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '2.5px solid var(--color-green)',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: 100,
    transition: 'border-color 0.2s',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0.6rem 0.9rem',
    borderRadius: '10px',
    border: '2px solid var(--color-bg-secondary)',
    background: 'var(--color-bg-secondary)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkLabel: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--color-green)',
    fontFamily: 'var(--font-body)',
  },
  successBar: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '2px solid #2e7d32',
    background: '#e8f5e9',
    color: '#2e7d32',
    fontWeight: 700,
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  errorBar: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '2px solid var(--color-red)',
    background: '#ffebee',
    color: 'var(--color-red)',
    fontWeight: 700,
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
};

const QuestionPanel = () => {
  const [formData, setFormData] = useState({
    question: '',
    points: '',
    requires_image: false,
    is_bonus: false,
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.question || !formData.points) {
      setError('Question text and points are required');
      return;
    }
    setLoading(true);
    const submitData = new FormData();
    submitData.append('question', formData.question);
    submitData.append('points', formData.points);
    submitData.append('requires_image', formData.requires_image);
    submitData.append('is_bonus', formData.is_bonus);
    if (image) submitData.append('image', image);
    try {
      const response = await createQuestion(submitData);
      if (response.success) {
        setSuccess('✅ Question created successfully!');
        setFormData({ question: '', points: '', requires_image: false, is_bonus: false });
        setImage(null);
        setPreview(null);
      } else {
        setError(response.message || 'Failed to create question');
      }
    } catch {
      setError('An error occurred while creating the question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="2" width="24" height="24" rx="6" fill="var(--color-bg-secondary)" stroke="var(--color-green)" strokeWidth="2.5" />
          <line x1="14" y1="7" x2="14" y2="21" stroke="var(--color-green)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="7" y1="14" x2="21" y2="14" stroke="var(--color-green)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--color-green)', margin: 0 }}>
          Create New Clue
        </h2>
      </div>

      {error && <div style={s.errorBar}>⚠ {error}</div>}
      {success && <div style={s.successBar}>{success}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} encType="multipart/form-data">

        {/* Question text */}
        <div>
          <label style={s.label}>📜 Clue / Question Text *</label>
          <textarea
            value={formData.question}
            onChange={e => setFormData(p => ({ ...p, question: e.target.value }))}
            required
            style={s.textarea}
            rows={4}
            placeholder="Enter the treasure clue here..."
          />
        </div>

        {/* Points */}
        <div>
          <label style={s.label}>🪙 Points *</label>
          <input
            type="number"
            value={formData.points}
            onChange={e => setFormData(p => ({ ...p, points: e.target.value }))}
            required
            min="1"
            style={s.input}
            placeholder="e.g. 10"
          />
        </div>

        {/* Checkboxes */}
        <div className="form-row">
          <label style={s.checkRow}>
            <input
              type="checkbox"
              id="requires_image"
              checked={formData.requires_image}
              onChange={e => setFormData(p => ({ ...p, requires_image: e.target.checked }))}
              style={{ width: 18, height: 18, accentColor: 'var(--color-green)', cursor: 'pointer' }}
            />
            <span style={s.checkLabel}>📷 Requires Photo Answer</span>
          </label>

          <label style={{ ...s.checkRow, background: formData.is_bonus ? '#fff8e1' : 'var(--color-bg-secondary)', borderColor: formData.is_bonus ? '#f9a825' : 'var(--color-bg-secondary)' }}>
            <input
              type="checkbox"
              id="is_bonus"
              checked={formData.is_bonus}
              onChange={e => setFormData(p => ({ ...p, is_bonus: e.target.checked }))}
              style={{ width: 18, height: 18, accentColor: '#f9a825', cursor: 'pointer' }}
            />
            <span style={{ ...s.checkLabel, color: formData.is_bonus ? '#c17900' : 'var(--color-green)' }}>⭐ Bonus Question</span>
          </label>
        </div>

        {/* Image upload */}
        <div>
          <label style={s.label}>🗺 Clue Image (Optional)</label>
          <div style={{
            border: '2.5px dashed var(--color-green)',
            borderRadius: 12,
            padding: '1rem',
            background: 'var(--color-bg-secondary)',
            textAlign: 'center',
          }}>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              style={{ width: '100%', fontFamily: 'var(--font-body)', color: 'var(--color-green)', fontWeight: 700, cursor: 'pointer' }}
            />
            {preview && (
              <div style={{ marginTop: '1rem' }}>
                <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 10, border: '3px solid var(--color-green)' }} />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            alignSelf: 'flex-start',
            minWidth: 180,
            padding: '0.85rem 2rem',
            fontSize: '1.05rem',
          }}
        >
          {loading ? '⏳ CREATING...' : '➕ CREATE CLUE'}
        </button>
      </form>
    </div>
  );
};

export default QuestionPanel;