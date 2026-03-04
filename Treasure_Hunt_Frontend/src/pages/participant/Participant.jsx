import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentQuestion, submitAnswer } from '../../services/api';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerForm from './components/AnswerForm';
import ErrorAlert, { SuccessAlert } from './components/Alert/ErrorAlert';
import BonusQuestionHandler from './components/BonusQuestionHandler';
import CompletionScreen from './components/CompletionScreen';

/* ── Treasure Hunt SVG decorations ───────────────────────── */

const DottedPath = () => (
  <svg
    className="path-overlay" viewBox="0 0 500 800" preserveAspectRatio="none"
    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
  >
    <path d="M-50 100 Q 200 50, 350 250 T 100 450 T 500 650" className="path-line" />
    <path d="M550 50 Q 300 200, 150 350 T 400 550 T -50 750" className="path-line" style={{ opacity: 0.25 }} />
    {/* Location pins along path */}
    <circle cx="200" cy="50" r="4" fill="var(--color-red)" opacity="0.35" />
    <circle cx="350" cy="250" r="5" fill="var(--color-red)" opacity="0.4" />
    <circle cx="100" cy="450" r="4" fill="var(--color-red)" opacity="0.3" />
    <circle cx="400" cy="550" r="5" fill="var(--color-red)" opacity="0.35" />
    {/* Small X marks */}
    <g transform="translate(420,120)" opacity="0.15">
      <line x1="-8" y1="-8" x2="8" y2="8" stroke="var(--color-brown)" strokeWidth="3" strokeLinecap="round" />
      <line x1="8" y1="-8" x2="-8" y2="8" stroke="var(--color-brown)" strokeWidth="3" strokeLinecap="round" />
    </g>
    <g transform="translate(60,350)" opacity="0.12">
      <line x1="-6" y1="-6" x2="6" y2="6" stroke="var(--color-brown)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="-6" x2="-6" y2="6" stroke="var(--color-brown)" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

const CompassDecor = () => (
  <svg
    width="50" height="50" viewBox="0 0 50 50" fill="none"
    style={{ position: 'absolute', top: '8%', right: '5%', opacity: 0.08, pointerEvents: 'none', zIndex: 0 }}
  >
    <circle cx="25" cy="25" r="22" stroke="var(--color-brown)" strokeWidth="2" />
    <circle cx="25" cy="25" r="18" stroke="var(--color-brown)" strokeWidth="1" strokeDasharray="3 3" />
    <polygon points="25,5 23,24 27,24" fill="var(--color-red)" />
    <polygon points="25,45 23,26 27,26" fill="var(--color-brown)" />
    <line x1="5" y1="25" x2="45" y2="25" stroke="var(--color-brown)" strokeWidth="1" />
    <circle cx="25" cy="25" r="3" fill="var(--color-brown)" />
  </svg>
);

const FootprintsSVG = () => (
  <svg
    width="36" height="100" viewBox="0 0 36 100" fill="none"
    style={{ position: 'absolute', bottom: '10%', left: '4%', opacity: 0.07, pointerEvents: 'none', zIndex: 0 }}
  >
    {[0, 1, 2, 3, 4].map(i => (
      <ellipse key={i} cx={i % 2 === 0 ? 10 : 26} cy={10 + i * 20} rx="7" ry="5" fill="var(--color-brown)" />
    ))}
  </svg>
);

const Participant = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [textAnswer, setTextAnswer] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const qnumKey = 'qnum_' + (localStorage.getItem('token') || '').slice(-16);
  const [questionNumber, setQuestionNumberRaw] = useState(() => {
    const saved = localStorage.getItem(qnumKey);
    return saved ? Math.max(1, parseInt(saved, 10)) : 1;
  });

  const setQuestionNumber = (updaterOrValue) => {
    setQuestionNumberRaw(prev => {
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;
      const clamped = Math.max(prev, next);
      localStorage.setItem(qnumKey, String(clamped));
      return clamped;
    });
  };

  const [isBonusMode, setIsBonusMode] = useState(false);
  const [completedBonus, setCompletedBonus] = useState(0);

  useEffect(() => { fetchCurrentQuestion(false); }, []);

  const fetchCurrentQuestion = async (isBonus = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCurrentQuestion(isBonus);
      if (response.success) {
        if (response.question) {
          setCurrentQuestion({
            id: response.question.id,
            question: response.question.question || response.question.text,
            points: response.question.points,
            requires_image: Boolean(response.question.requires_image),
            image_url: response.question.image_url,
            is_bonus: response.question.is_bonus || false,
          });
          if (response.question_number) setQuestionNumber(prev => Math.max(prev, response.question_number));
          setCompletedBonus(response.completed_bonus || 0);
        } else if (response.completed) {
          setCurrentQuestion({ completed: true });
        } else {
          setError('No question available');
        }
      } else {
        setError(response.message || 'No question available');
      }
    } catch {
      setError('Failed to fetch question');
    } finally {
      setLoading(false);
    }
  };

  // Compress image using canvas — returns a File under targetSize
  const compressImage = (file, maxWidth = 1200, quality = 0.7, targetSizeMB = 2) => {
    return new Promise((resolve) => {
      // If already small enough, use as-is
      if (file.size <= targetSizeMB * 1024 * 1024) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Scale down if wider than maxWidth
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG blob
          canvas.toBlob(
            (blob) => {
              const compressed = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressed);
            },
            'image/jpeg',
            quality
          );
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { setError('Only image files are allowed'); e.target.value = ''; return; }

      // Compress if needed (auto-resize + JPEG quality reduction)
      const processed = await compressImage(file);
      if (processed.size > 2 * 1024 * 1024) {
        setError('Image is too large even after compression. Try a smaller photo.');
        e.target.value = '';
        return;
      }

      setImage(processed);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(processed);
      setError(null);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion?.id) return;
    if (currentQuestion.requires_image && !image) { setError('This question requires an image'); return; }
    if (!textAnswer.trim() && !image) { setError('Please provide either a text answer or an image'); return; }
    setSubmitting(true);
    setError(null);
    setSuccess('');
    try {
      const formData = new FormData();
      if (textAnswer.trim()) formData.append('text_answer', textAnswer.trim());
      if (image) formData.append('image', image);
      const response = await submitAnswer(currentQuestion.id, formData);
      if (response.success) {
        if (currentQuestion.is_bonus) setCompletedBonus(prev => prev + 1);
        setQuestionNumber(prev => prev + 1);
        setSuccess('✨ Answer logged in the captain\'s journal!');
        setTextAnswer('');
        setImage(null);
        setImagePreview(null);
        setTimeout(() => { setSuccess(''); fetchCurrentQuestion(false); }, 1500);
      } else {
        setError(response.message || 'Failed to submit answer');
      }
    } catch {
      setError('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Loading state ──── */
  if (loading) {
    return (
      <div className="flex-col-center" style={{ flex: 1, position: 'relative', padding: '2rem' }}>
        <DottedPath />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Spinning compass */}
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ marginBottom: '1.2rem', animation: 'spin 2s linear infinite' }}>
            <circle cx="36" cy="36" r="34" stroke="var(--color-green)" strokeWidth="3" fill="var(--color-bg-card)" />
            <circle cx="36" cy="36" r="28" stroke="var(--color-bg-secondary)" strokeWidth="1.5" strokeDasharray="4 4" />
            <polygon points="36,6 33,34 39,34" fill="var(--color-red)" />
            <polygon points="36,66 33,38 39,38" fill="var(--color-brown-dim)" />
            <line x1="6" y1="36" x2="28" y2="36" stroke="var(--color-green-light)" strokeWidth="1.5" />
            <line x1="44" y1="36" x2="66" y2="36" stroke="var(--color-green-light)" strokeWidth="1.5" />
            <circle cx="36" cy="36" r="4" fill="var(--color-brown)" />
          </svg>
          <p style={{
            color: 'var(--color-green)',
            fontFamily: 'var(--font-heading)',
            fontSize: '1.3rem',
            letterSpacing: '1px',
          }}>
            Charting the Map…
          </p>
          <div style={{
            width: 120, height: 4, borderRadius: 4, background: 'var(--color-bg-secondary)',
            overflow: 'hidden', marginTop: '0.5rem',
          }}>
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              style={{ width: '50%', height: '100%', background: 'var(--color-green)', borderRadius: 4 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Completion state ──── */
  if (currentQuestion?.completed) return <CompletionScreen />;

  /* ─── No question found ──── */
  if (!currentQuestion) {
    return (
      <div className="flex-col-center" style={{ flex: 1, position: 'relative', padding: '2rem' }}>
        <DottedPath />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="adventure-card"
          style={{ textAlign: 'center', maxWidth: 350 }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.8rem' }}>🗺️</span>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-brown)', marginBottom: '0.5rem' }}>
            THE TRAIL HAS GONE COLD
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.95rem' }}>
            No clues available right now. Check back later, explorer!
          </p>
        </motion.div>
      </div>
    );
  }

  /* ─── Main question view ──── */
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      padding: '0.5rem 0.75rem 1.5rem',
    }}>
      {/* Background decorations */}
      <DottedPath />
      <CompassDecor />
      <FootprintsSVG />

      {/* ── Clue number header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: '1rem',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--color-bg-card)',
          borderRadius: 14,
          padding: '0.7rem 1rem',
          border: '2px solid var(--color-bg-secondary)',
          boxShadow: '3px 3px 0 var(--color-bg-secondary)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-green), #2d7038)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              boxShadow: '2px 2px 0 var(--color-green-dim)',
            }}>
              #{questionNumber}
            </span>
            <div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-green)',
                fontSize: '1.05rem',
                lineHeight: 1.1,
              }}>
                CLUE #{questionNumber}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '0.7rem',
                color: 'var(--color-brown-dim)',
                letterSpacing: '0.5px',
              }}>
                TREASURE HUNT 2026
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            fontSize: '0.75rem',
            color: 'var(--color-green)',
            background: 'var(--color-bg-secondary)',
            padding: '5px 12px',
            borderRadius: 20,
          }}>
            <span style={{ fontSize: '0.9rem' }}>🧭</span> Exploring
          </div>
        </div>
      </motion.div>

      {/* Bonus question handler */}
      <BonusQuestionHandler
        questionNumber={questionNumber}
        onSwitchToBonus={() => { setIsBonusMode(true); fetchCurrentQuestion(true); }}
        onSwitchToNormal={() => { setIsBonusMode(false); fetchCurrentQuestion(false); }}
        isBonusMode={isBonusMode}
        completedBonus={completedBonus}
      />

      {/* Question and answer form with slide animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ width: '100%', position: 'relative', zIndex: 1 }}
        >
          <QuestionDisplay
            question={currentQuestion.question}
            points={currentQuestion.points}
            requiresImage={currentQuestion.requires_image}
            imageUrl={currentQuestion.image_url}
            apiUrl={import.meta.env.VITE_API_URL}
          />

          <AnswerForm
            textAnswer={textAnswer}
            onTextChange={e => setTextAnswer(e.target.value)}
            onImageChange={handleImageChange}
            imagePreview={imagePreview}
            requiresImage={currentQuestion.requires_image}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </AnimatePresence>

      {/* Alerts */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <ErrorAlert message={error} />
        <SuccessAlert message={success} />
      </div>
    </div>
  );
};

export default Participant;