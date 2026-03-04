import React from 'react';

const ProgressBar = ({ questionNumber, totalQuestions }) => {
  const safeTotal = Math.max(1, totalQuestions);
  const displayedQuestion = Math.min(questionNumber, safeTotal);
  const progressToMilestone = (displayedQuestion / safeTotal) * 100;

  return (
    <div style={{ marginBottom: '1.5rem', width: '100%', position: 'relative', zIndex: 1, padding: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '8px' }}>
        <div style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-green-light)', fontSize: '1rem' }}>
          SCROLL <span style={{ fontSize: '1.3rem', color: 'var(--color-green)' }}>{displayedQuestion}</span> / {safeTotal}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-brown)' }}>
          {Math.floor(progressToMilestone)}% Explored
        </div>
      </div>

      <div style={{ height: '14px', background: '#ffe4c4', border: '2px dotted var(--color-brown-light)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--color-green)', width: `${progressToMilestone}%`, transition: 'width 0.5s ease' }} />
      </div>
    </div>
  );
};

export default ProgressBar;