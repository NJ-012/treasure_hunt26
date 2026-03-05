import React from 'react';
import { motion } from 'framer-motion';

const BonusQuestionHandler = ({ questionNumber, onSwitchToBonus, onSwitchToNormal, isBonusMode, completedBonus }) => {
  const availableBonuses = Math.floor((questionNumber - 1) / 10);

  if (completedBonus >= availableBonuses && !isBonusMode) return null;

  return (
    <div style={{ marginBottom: '1.5rem', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 0.5rem' }}>
      {!isBonusMode ? (
        <motion.button
          onClick={onSwitchToBonus}
          whileTap={{ scale: 0.95 }}
          style={{ width: '100%', background: 'var(--color-red)' }}
        >
          🏴‍☠️ Hidden Path Uncovered (BONUS) 🏴‍☠️
        </motion.button>
      ) : (
        <motion.button
          onClick={onSwitchToNormal}
          whileTap={{ scale: 0.95 }}
          style={{ width: '100%', background: 'var(--color-blue)', borderColor: '#4895af', boxShadow: '4px 4px 0 #4895af' }}
        >
          ⚓ RETURN TO MAIN TRAIL ⚓
        </motion.button>
      )}
    </div>
  );
};

export default BonusQuestionHandler;