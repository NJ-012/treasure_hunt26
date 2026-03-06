import React from 'react';
import { motion } from 'framer-motion';

const CompletionScreen = () => {
  return (
    <div className="flex-col-center" style={{ flex: 1, padding: '2rem 1rem', textAlign: 'center', position: 'relative' }}>

      {/* Dotted path background */}
      <svg className="path-overlay" viewBox="0 0 500 800" preserveAspectRatio="none">
        <path d="M-50 150 Q 250 100, 300 300 T 150 500 T 550 700" className="path-line" />
      </svg>

      {/* Confetti-like sparkles */}
      {[
        { x: '15%', y: '20%', delay: 0, color: 'var(--color-red)' },
        { x: '80%', y: '15%', delay: 0.3, color: 'var(--color-green)' },
        { x: '10%', y: '70%', delay: 0.6, color: 'var(--color-blue)' },
        { x: '85%', y: '65%', delay: 0.2, color: 'var(--color-brown-light)' },
        { x: '50%', y: '85%', delay: 0.5, color: 'var(--color-red)' },
      ].map((sparkle, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 0.8, 1], opacity: [0, 1, 0.8, 0.6] }}
          transition={{ delay: sparkle.delay + 0.5, duration: 0.6, type: 'spring' }}
          style={{
            position: 'absolute',
            left: sparkle.x,
            top: sparkle.y,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon
              points="10,1 12.5,7.5 19,7.8 14,12 16,18.5 10,15 4,18.5 6,12 1,7.8 7.5,7.5"
              fill={sparkle.color}
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}

      <motion.div
        className="adventure-card"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{ maxWidth: '400px', width: '100%', padding: '2.5rem 2rem', zIndex: 10 }}
      >
        {/* Trophy with glow */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '2rem',
            lineHeight: 1.1,
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, var(--color-brown), var(--color-brown-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          TREASURE HAS BEEN FOUND!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            width: 60, height: 3,
            background: 'linear-gradient(90deg, var(--color-green), var(--color-brown-light))',
            borderRadius: 3,
            margin: '0.8rem auto',
          }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          Thank you for participating! The treasure has been found, and results will be announced on Ambiora socials.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '2px solid var(--color-bg-primary)',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-green)', letterSpacing: '1px', marginBottom: 4 }}>
            THE HUNT IS OVER
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-brown)' }}>
            Stay tuned to @ambiora on socials!
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => window.location.href = '/participant'}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, var(--color-green), #2d7038)',
            borderColor: 'var(--color-green-dim)',
            boxShadow: '4px 4px 0 var(--color-green-dim)',
            fontSize: '1.1rem',
          }}
        >
          🧭 RETURN TO PORT
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CompletionScreen;
