import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ErrorAlert = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
      >
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

export const SuccessAlert = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 6 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-amber-900/30 border border-amber-600 text-amber-900 px-6 py-4 rounded relative font-heading font-bold text-lg tracking-wide"
      >
        <span className="block sm:inline">{`~ SUCCESS: ${message} ~`}</span>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-600"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-amber-600"></div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SuccessAlert;