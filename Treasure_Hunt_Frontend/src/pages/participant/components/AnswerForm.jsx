import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const AnswerForm = ({ textAnswer, onTextChange, onImageChange, imagePreview, requiresImage, submitting, onSubmit }) => {
  const fileInputRef = useRef(null);

  return (
    <motion.form
      onSubmit={onSubmit}
      className="adventure-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{ marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative accent strip */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: 4,
        background: 'linear-gradient(90deg, var(--color-green), var(--color-brown-light), var(--color-red))',
        borderRadius: '16px 16px 0 0',
      }} />

      {/* Text answer section */}
      <div style={{ marginBottom: '1.2rem', marginTop: '0.3rem' }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          color: 'var(--color-green)',
          marginBottom: '0.6rem',
          letterSpacing: '0.5px',
        }}>
          <span style={{ fontSize: '1.1rem' }}>✍️</span> RECORD YOUR FINDINGS
        </label>
        <textarea
          value={textAnswer}
          onChange={onTextChange}
          rows={3}
          placeholder="Type your answer here..."
          style={{
            width: '100%',
            padding: '0.9rem 1rem',
            borderRadius: '12px',
            border: '2.5px solid var(--color-bg-secondary)',
            fontSize: '1rem',
            resize: 'vertical',
            outline: 'none',
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-green)';
            e.target.style.boxShadow = '0 0 0 3px rgba(37,97,48,0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-bg-secondary)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Image upload section */}
      <div style={{
        marginBottom: '1.5rem',
        borderTop: '2px dashed var(--color-bg-secondary)',
        paddingTop: '1rem',
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-heading)',
          fontSize: '1rem',
          color: 'var(--color-green)',
          marginBottom: '0.6rem',
          letterSpacing: '0.5px',
        }}>
          <span style={{ fontSize: '1.1rem' }}>📸</span> UPLOAD PHOTO
          {requiresImage && (
            <span style={{
              color: '#fff',
              fontSize: '0.7rem',
              background: 'var(--color-red)',
              padding: '2px 8px',
              borderRadius: 10,
              fontFamily: 'var(--font-body)',
              fontWeight: 800,
            }}>
              REQUIRED
            </span>
          )}
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Upload area */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current?.click()}
            style={{
              flex: 1,
              border: `3px dashed ${imagePreview ? 'var(--color-green)' : 'var(--color-brown-light)'}`,
              borderRadius: '14px',
              padding: '1.2rem 1rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: imagePreview ? 'var(--color-bg-secondary)' : 'var(--color-bg-primary)',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>
              {imagePreview ? '✅' : '📷'}
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              color: imagePreview ? 'var(--color-green)' : 'var(--color-brown)',
            }}>
              {imagePreview ? 'Photo Attached!' : 'Tap to Upload'}
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: 'var(--color-brown-dim)',
              fontWeight: 700,
              marginTop: 2,
            }}>
              Max 2MB
            </div>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageChange}
            style={{ display: 'none' }}
          />

          {/* Image preview */}
          {imagePreview && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ position: 'relative', flexShrink: 0 }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  border: '3px solid var(--color-green)',
                  objectFit: 'cover',
                  boxShadow: '3px 3px 0 var(--color-green-dim)',
                }}
              />
              <button
                type="button"
                onClick={() => onImageChange({ target: { files: [] } })}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 26,
                  height: 26,
                  padding: 0,
                  borderRadius: '50%',
                  background: 'var(--color-red)',
                  color: '#fff',
                  border: '2px solid #fff',
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Submit button */}
      <motion.button
        type="submit"
        disabled={submitting}
        whileTap={{ scale: 0.97 }}
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.15rem',
          background: submitting ? 'var(--color-brown-dim)' : 'linear-gradient(135deg, var(--color-green), #2d7038)',
          borderColor: 'var(--color-green-dim)',
          boxShadow: submitting ? '2px 2px 0 var(--color-green-dim)' : '4px 4px 0 var(--color-green-dim)',
          letterSpacing: '1.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s',
        }}
      >
        {submitting ? (
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="10" cy="10" r="8" stroke="#fff" strokeWidth="2.5" fill="none" strokeDasharray="20 30" />
            </svg>
            SUBMITTING...
          </>
        ) : (
          <>
            <span>🚀</span> SUBMIT ANSWER
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default AnswerForm;
