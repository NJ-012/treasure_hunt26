import React from 'react';

/* ── Mini treasure chest SVG ── */
const ChestSVG = () => (
  <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="24" height="13" rx="3" fill="#be753d" stroke="#6d3e1a" strokeWidth="1.5" />
    <rect x="2" y="4" width="24" height="8" rx="3" fill="#8d5225" stroke="#6d3e1a" strokeWidth="1.5" />
    <rect x="10" y="8" width="8" height="4" rx="2" fill="#6ebad8" stroke="#1e4b25" strokeWidth="1.2" />
    <circle cx="14" cy="10" r="2" fill="#e6c84a" />
    {/* bands */}
    <line x1="2" y1="13" x2="26" y2="13" stroke="#6d3e1a" strokeWidth="1.2" />
  </svg>
);

/* ── Skull & crossbones ── */
const SkullSVG = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="8" r="6" fill="#fff" stroke="#6d3e1a" strokeWidth="1.5" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="#6d3e1a" />
    <circle cx="12.5" cy="7.5" r="1.5" fill="#6d3e1a" />
    <rect x="8" y="13" width="1.5" height="4" rx="0.7" fill="#6d3e1a" />
    <rect x="10.5" y="13" width="1.5" height="4" rx="0.7" fill="#6d3e1a" />
    <line x1="2" y1="15" x2="18" y2="15" stroke="#6d3e1a" strokeWidth="1.5" />
    <line x1="5" y1="12" x2="15" y2="18" stroke="#6d3e1a" strokeWidth="1.5" />
    <line x1="15" y1="12" x2="5" y2="18" stroke="#6d3e1a" strokeWidth="1.5" />
  </svg>
);

const Footer = ({ isAdmin = false }) => {
  return (
    <footer style={{
      background: 'var(--color-green)',
      borderTop: '6px solid var(--color-green-dim)',
      padding: '1.25rem 1.5rem',
      position: 'relative',
      zIndex: 201,
      textAlign: 'center',
      color: '#fff',
      marginTop: 'auto',
      width: '100%',
      boxSizing: 'border-box',
      borderTopLeftRadius: isAdmin ? 0 : '24px',
      borderTopRightRadius: isAdmin ? 0 : '24px',
    }}>
      <div style={{
        maxWidth: isAdmin ? '1400px' : '500px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: isAdmin ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: isAdmin ? 'space-between' : 'center',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {/* Left section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChestSVG />
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>⚓ SEE YOU THERE!</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
              Charted by Team Technical · AMBIORA 2026
            </p>
          </div>
        </div>

        {/* Right: decorative badges for admin */}
        {isAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SkullSVG />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', opacity: 0.85, letterSpacing: 2 }}>
              ADMIN PANEL
            </span>
            <SkullSVG />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
