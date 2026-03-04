import React from 'react';
import { motion } from 'framer-motion';

const QuestionDisplay = ({ question, points, requiresImage, imageUrl, apiUrl }) => {
  return (
    <motion.div
      className="adventure-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        marginBottom: '1.2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative corner flourish */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 60, height: 60,
        background: 'linear-gradient(135deg, transparent 50%, var(--color-bg-secondary) 50%)',
        borderBottomLeftRadius: 16, opacity: 0.5, pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
        borderBottom: '2px dashed var(--color-bg-secondary)',
        paddingBottom: '0.8rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '1.3rem' }}>🗺️</span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-brown)',
            fontSize: '1rem',
            letterSpacing: '0.5px',
          }}>
            NEW CLUE DISCOVERED
          </span>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, delay: 0.2 }}
          style={{
            background: 'linear-gradient(135deg, var(--color-brown-light), var(--color-brown))',
            color: '#fff',
            padding: '5px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.5px',
            boxShadow: '2px 2px 0 var(--color-brown-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>🪙</span> {points}
        </motion.span>
      </div>

      {/* Question text */}
      <div style={{
        fontSize: '1.15rem',
        lineHeight: 1.6,
        color: 'var(--color-text-primary)',
        fontWeight: 600,
        whiteSpace: 'pre-wrap',
        padding: '0.5rem 0',
        position: 'relative',
      }}>
        {/* Opening quote mark */}
        <span style={{
          position: 'absolute',
          top: -4,
          left: -4,
          fontSize: '3rem',
          fontFamily: 'Georgia, serif',
          color: 'var(--color-green)',
          opacity: 0.15,
          lineHeight: 1,
          pointerEvents: 'none',
        }}>
          "
        </span>
        {question}
      </div>


      {/* Clue image/video */}
      {imageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            margin: '1rem 0 0',
            borderRadius: 12,
            overflow: 'hidden',
            border: '3px solid var(--color-green)',
            boxShadow: '4px 4px 0 var(--color-green-dim)',
          }}
        >
          {imageUrl.endsWith('.mp4') ? (
            <video
              src={`${apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`}
              controls
              style={{ width: '100%', display: 'block' }}
            />
          ) : (
            <img
              src={`${apiUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`}
              alt="Clue artifact"
              style={{ width: '100%', display: 'block' }}
            />
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuestionDisplay;
