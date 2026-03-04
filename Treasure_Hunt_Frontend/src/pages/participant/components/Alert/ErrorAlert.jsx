import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ErrorAlert = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        style={{ background: '#ffebee', color: 'var(--color-red)', padding: '1rem', borderRadius: '12px', border: '3px solid var(--color-red)', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', boxShadow: '4px 4px 0 rgba(187, 65, 41, 0.4)' }}
      >
        ⚠ {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export const SuccessAlert = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-green)', padding: '1rem', borderRadius: '12px', border: '3px solid var(--color-green)', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', boxShadow: '4px 4px 0 rgba(37, 97, 48, 0.4)' }}
      >
        ⭐ {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export default ErrorAlert;