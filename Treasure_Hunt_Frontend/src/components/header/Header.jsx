import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/api';
import CountdownTimer from './CountdownTimer';

/* ── inline treasure-hunt SVG compass rose ── */
const CompassSVG = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="th-glow">
    <circle cx="32" cy="32" r="30" stroke="var(--color-green)" strokeWidth="3" fill="var(--color-bg-primary)" />
    <circle cx="32" cy="32" r="4" fill="var(--color-brown)" />
    {/* N arrow */}
    <polygon points="32,6 29,30 35,30" fill="var(--color-red)" />
    {/* S arrow */}
    <polygon points="32,58 29,34 35,34" fill="var(--color-brown-dim)" />
    {/* E W ticks */}
    <line x1="58" y1="32" x2="38" y2="32" stroke="var(--color-green)" strokeWidth="2" />
    <line x1="6" y1="32" x2="26" y2="32" stroke="var(--color-green)" strokeWidth="2" />
    <text x="30" y="18" fontSize="8" fill="var(--color-red)" fontWeight="bold">N</text>
    <text x="30" y="55" fontSize="8" fill="var(--color-brown-dim)" fontWeight="bold">S</text>
    <text x="50" y="35" fontSize="8" fill="var(--color-green)" fontWeight="bold">E</text>
    <text x="10" y="35" fontSize="8" fill="var(--color-green)" fontWeight="bold">W</text>
  </svg>
);

/* ── skull / star bullet ── */
const MapDot = ({ color = 'var(--color-red)' }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polygon points="7,1 8.8,5.2 13.5,5.5 10,8.6 11.2,13.2 7,10.6 2.8,13.2 4,8.6 0.5,5.5 5.2,5.2" fill={color} />
  </svg>
);

const Header = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header style={{
      background: 'var(--color-bg-card)',
      borderBottom: '4px solid var(--color-green)',
      boxShadow: '0 4px 0px var(--color-green-dim)',
      zIndex: 201,
      position: 'sticky',
      top: 0,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{
        maxWidth: isAdmin ? '1400px' : '500px',
        margin: '0 auto',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>

        {/* Logo block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            border: '2px solid var(--color-brown-dim)',
            background: 'var(--color-bg-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', flexShrink: 0,
          }}>
            <img src="/assets/pirate.svg" alt="Avatar" style={{ width: '100%', height: '100%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <h1 style={{ fontSize: isAdmin ? '1.6rem' : '1.4rem', margin: 0 }}>TREASURE HUNT</h1>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brown-dim)', letterSpacing: 1 }}>
              AMBIORA 2026
            </span>
          </div>
        </div>

        {/* Centre: compass (admin only on wide screens) */}
        {isAdmin && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'center' }}>
            <CompassSVG size={36} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--color-green)', letterSpacing: 2 }}>
                ADMIN PANEL
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--color-brown)', fontWeight: 800, letterSpacing: 1 }}>
                ADMIN COMMAND CENTER
              </span>
            </div>
            <CompassSVG size={36} />
          </div>
        )}

        {/* Right: timer + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapDot color="var(--color-red)" />
            <CountdownTimer compact={isAdmin} />
          </div>

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                padding: '0.45rem 0.6rem',
                borderRadius: '10px',
                fontSize: 0,
                boxShadow: '3px 3px 0 var(--color-brown-dim)',
                borderWidth: '2px',
                flexShrink: 0,
              }}
              title="Log Out"
            >
              <LogOut size={18} color="#fff" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
