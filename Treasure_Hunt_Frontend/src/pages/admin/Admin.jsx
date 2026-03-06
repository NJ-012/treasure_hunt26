import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionPanel from './components/QuestionPanel';
import TeamPanel from './components/TeamPanel';
import ResultPanel from './components/ResultPanel';
import ViewQuestions from './components/ViewQuestions';
import AddUserPanel from './components/AddUserPanel';

/* ── SVG decorations ──────────────────────────────────────── */
const MapX = ({ size = 48, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
    <line x1="4" y1="4" x2="44" y2="44" stroke="var(--color-brown-dim)" strokeWidth="5" strokeLinecap="round" />
    <line x1="44" y1="4" x2="4" y2="44" stroke="var(--color-brown-dim)" strokeWidth="5" strokeLinecap="round" />
    <circle cx="24" cy="24" r="20" stroke="var(--color-brown)" strokeWidth="3" fill="none" strokeDasharray="6 5" />
  </svg>
);

const AnchorSVG = ({ size = 48, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 48 50" fill="none" style={style}>
    <circle cx="24" cy="9" r="6" stroke="var(--color-green)" strokeWidth="3" fill="none" />
    <line x1="24" y1="15" x2="24" y2="44" stroke="var(--color-green)" strokeWidth="3" strokeLinecap="round" />
    <line x1="12" y1="25" x2="36" y2="25" stroke="var(--color-green)" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 25 Q8 38 14 44" stroke="var(--color-green)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M36 25 Q40 38 34 44" stroke="var(--color-green)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <line x1="14" y1="44" x2="34" y2="44" stroke="var(--color-green)" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const TreasureKey = ({ size = 40, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
    <circle cx="14" cy="14" r="10" stroke="var(--color-brown)" strokeWidth="3" fill="none" />
    <circle cx="14" cy="14" r="5" stroke="var(--color-brown)" strokeWidth="2" fill="var(--color-bg-secondary)" />
    <line x1="22" y1="22" x2="36" y2="36" stroke="var(--color-brown)" strokeWidth="3" strokeLinecap="round" />
    <line x1="30" y1="32" x2="27" y2="35" stroke="var(--color-brown)" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="34" y1="36" x2="31" y2="39" stroke="var(--color-brown)" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MapScrollSVG = ({ style = {} }) => (
  <svg width="60" height="50" viewBox="0 0 60 50" fill="none" style={{ opacity: 0.18, ...style }}>
    <rect x="5" y="5" width="50" height="40" rx="4" fill="var(--color-brown)" stroke="var(--color-brown-dim)" strokeWidth="2" />
    <line x1="5" y1="5" x2="5" y2="45" stroke="var(--color-brown-light)" strokeWidth="4" strokeLinecap="round" />
    <line x1="55" y1="5" x2="55" y2="45" stroke="var(--color-brown-light)" strokeWidth="4" strokeLinecap="round" />
    <line x1="15" y1="15" x2="45" y2="15" stroke="var(--color-bg-secondary)" strokeWidth="1.5" />
    <line x1="15" y1="22" x2="40" y2="22" stroke="var(--color-bg-secondary)" strokeWidth="1.5" />
    <line x1="15" y1="29" x2="45" y2="29" stroke="var(--color-bg-secondary)" strokeWidth="1.5" />
    <line x1="15" y1="36" x2="35" y2="36" stroke="var(--color-bg-secondary)" strokeWidth="1.5" />
  </svg>
);

/* Tab icons */
const TAB_META = [
  { id: 'Questions', label: 'Add Question', icon: '➕', desc: 'Create new clues' },
  { id: 'View Questions', label: 'View Questions', icon: '📜', desc: 'Edit & remove clues' },
  { id: 'Teams', label: 'Teams', icon: '🏴‍☠️', desc: 'Review submissions' },
  { id: 'Results', label: 'Results', icon: '🏆', desc: 'Leaderboard & export' },
  { id: 'Add User', label: 'Add User', icon: '🧑‍🤝‍🧑', desc: 'Manage players' },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Questions');

  const activeTabMeta = TAB_META.find(t => t.id === activeTab);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--color-bg-primary)' }}>

      {/* Full-page decorative dotted map path */}
      <svg
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.35 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="dotgrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="15" cy="15" r="1.5" fill="var(--color-brown-dim)" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {/* Floating corner decorations */}
      <MapX size={56} style={{ position: 'fixed', top: 120, right: 24, opacity: 0.12, zIndex: 0, pointerEvents: 'none' }} />
      <AnchorSVG size={64} style={{ position: 'fixed', bottom: 80, left: 20, opacity: 0.1, zIndex: 0, pointerEvents: 'none' }} />
      <TreasureKey size={52} style={{ position: 'fixed', bottom: 80, right: 24, opacity: 0.12, zIndex: 0, pointerEvents: 'none' }} />

      {/* Main content */}
      <div className="admin-shell" style={{ position: 'relative', zIndex: 1 }}>

        {/* Page title banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            padding: '1rem 1.5rem',
            background: 'var(--color-bg-card)',
            borderRadius: '16px',
            border: '3px solid var(--color-green)',
            boxShadow: '6px 6px 0 var(--color-green-dim)',
          }}
        >
          {/* Left: active tab icon + description */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 200 }}>
            <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{activeTabMeta?.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--color-green)' }}>
                {activeTabMeta?.label}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-brown)', fontFamily: 'var(--font-body)', letterSpacing: 1 }}>
                {activeTabMeta?.desc?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right: decorative elements */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <MapScrollSVG />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', color: 'var(--color-brown)', opacity: 0.7 }}>
                ⚙️ SECURE LEVEL
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-green)', fontFamily: 'var(--font-mono)', letterSpacing: 1, background: 'var(--color-bg-secondary)', padding: '2px 8px', borderRadius: 6, display: 'inline-block', marginTop: 2 }}>
                REACHED
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main admin card */}
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {/* Tab bar */}
          <div className="admin-tabs">
            {TAB_META.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`admin-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                <span style={{ marginRight: 6 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="admin-panel-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
              >
                {activeTab === 'Questions' && <QuestionPanel />}
                {activeTab === 'View Questions' && <ViewQuestions />}
                {activeTab === 'Teams' && <TeamPanel />}
                {activeTab === 'Results' && <ResultPanel />}
                {activeTab === 'Add User' && <AddUserPanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
