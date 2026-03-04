import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        overflowY: 'auto',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      role="dialog" aria-modal="true"
    >
      {/* Dark overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(3, 4, 10, 0.85)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '540px',
          background: 'rgba(8, 12, 23, 0.98)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(0,240,255,0.08), 0 24px 48px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top accent line */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00f0ff, #9945ff, transparent)',
        }} />
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
