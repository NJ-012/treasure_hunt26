import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, registerUser } from "../../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("participant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await loginUser({ username, password });
      if (response.success) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userRole", response.user.role);
        navigate(response.user.role === "admin" ? "/admin" : "/participant");
      } else {
        setError(response.message);
      }
    } catch {
      setError("Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>

      {/* Visual map decorative dotted path */}
      <svg className="path-overlay" viewBox="0 0 500 800" preserveAspectRatio="none">
        <path d="M-50 150 Q 250 100, 300 300 T 150 500 T 550 700" className="path-line" />
      </svg>

      {/* Corner Map Illustrations — inline SVG so no missing asset issues */}
      {/* Palm tree top-left */}
      <svg width="70" height="80" viewBox="0 0 70 80" fill="none"
        style={{ position: 'absolute', top: '8%', left: '8px', zIndex: 1, pointerEvents: 'none', opacity: 0.55 }}>
        <line x1="35" y1="80" x2="35" y2="35" stroke="var(--color-brown)" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="35" cy="30" rx="22" ry="12" fill="var(--color-green)" opacity="0.85" />
        <ellipse cx="20" cy="25" rx="14" ry="7" fill="var(--color-green-light)" opacity="0.8" transform="rotate(-20,20,25)" />
        <ellipse cx="50" cy="25" rx="14" ry="7" fill="var(--color-green-light)" opacity="0.8" transform="rotate(20,50,25)" />
        <ellipse cx="35" cy="18" rx="12" ry="6" fill="var(--color-green)" />
        <circle cx="35" cy="36" r="4" fill="var(--color-brown-light)" />
      </svg>

      {/* Ship bottom-right */}
      <svg width="80" height="70" viewBox="0 0 80 70" fill="none"
        style={{ position: 'absolute', bottom: '12%', right: '8px', zIndex: 1, pointerEvents: 'none', opacity: 0.5 }} className="th-float">
        <path d="M10 45 Q40 55 70 45 L65 58 Q40 65 15 58 Z" fill="var(--color-brown)" stroke="var(--color-brown-dim)" strokeWidth="2" />
        <rect x="36" y="10" width="3" height="35" rx="1" fill="var(--color-brown-dim)" />
        <polygon points="39,10 39,30 62,22" fill="var(--color-red)" opacity="0.8" />
        <polygon points="36,12 36,28 18,20" fill="var(--color-bg-card)" opacity="0.9" />
        <path d="M5 45 Q40 35 75 45" stroke="var(--color-blue)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>

      <motion.div
        className="adventure-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <div className="flex-col-center" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', lineHeight: 1.1, marginBottom: '0.4rem' }}>
            WELCOME EXPLORER
          </h2>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-green-light)', margin: 0 }}>
            Are you up for the challenge?
          </p>
        </div>

        {/* Role tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
          {['participant', 'admin'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              style={{
                flex: 1,
                background: role === r ? 'var(--color-green)' : 'var(--color-bg-primary)',
                color: role === r ? '#fff' : 'var(--color-green)',
                borderColor: role === r ? 'var(--color-green-dim)' : 'var(--color-green-light)',
                boxShadow: role === r ? '4px 4px 0 var(--color-green-dim)' : 'none',
                transform: role === r ? 'translate(-2px, -2px)' : 'none',
                padding: '0.6rem 1rem',
                fontSize: '1rem'
              }}
            >
              {r === 'admin' ? 'Admin' : 'Participant'}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ color: 'var(--color-red)', fontWeight: 'bold', marginBottom: '1rem', background: '#ffebee', padding: '0.5rem', borderRadius: '8px', border: '2px solid var(--color-red)', textAlign: 'center' }}
            >
              ⚠ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Explorer Name"
            value={username} onChange={e => setUsername(e.target.value)} required
            style={{ padding: '1rem', borderRadius: '12px', border: '3px solid var(--color-green)', fontSize: '1.1rem', fontWeight: 'bold', outline: 'none', background: 'var(--color-bg-primary)', color: 'var(--color-green)' }}
          />
          <input
            type="password"
            placeholder="Secret Passcode"
            value={password} onChange={e => setPassword(e.target.value)} required
            style={{ padding: '1rem', borderRadius: '12px', border: '3px solid var(--color-green)', fontSize: '1.1rem', fontWeight: 'bold', outline: 'none', background: 'var(--color-bg-primary)', color: 'var(--color-green)' }}
          />
          <button type="submit" disabled={loading} style={{ marginTop: '0.8rem', fontSize: '1.2rem', padding: '1rem' }}>
            {loading ? "VERIFYING..." : "START ADVENTURE"}
          </button>
        </form>

      </motion.div>
    </div>
  );
};

export default Login;
