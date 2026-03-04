import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/api';

const EVENT_END_DATE = import.meta.env.VITE_EVENT_END_DATE || '2025-02-28T17:00:00';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const longPressTimer = useRef(null);
  const userExpiredCheckInterval = useRef(null);

  // Check if user is admin
  const isAdmin = () => localStorage.getItem('userRole') === 'admin';

  // Direct check if event has ended
  const isEventEnded = () => {
    const currentDate = new Date();
    const eventEndDate = new Date(EVENT_END_DATE);
    return currentDate >= eventEndDate;
  };

  useEffect(() => {
    const targetDate = new Date(EVENT_END_DATE);

    // Check if event has already ended on component mount
    if (isEventEnded()) {
      setIsExpired(true);
      handleExpiration();
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsExpired(true);
        handleExpiration();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // For participants, continuously check if the event has ended
    // This ensures we catch event end even if clock is manipulated
    if (!isAdmin()) {
      userExpiredCheckInterval.current = setInterval(() => {
        if (isEventEnded()) {
          setIsExpired(true);
          handleExpiration();
        }
      }, 10000); // Check every 10 seconds for safety
    }

    return () => {
      clearInterval(timer);
      if (userExpiredCheckInterval.current) {
        clearInterval(userExpiredCheckInterval.current);
      }
    };
  }, []);

  const handleExpiration = async () => {
    // Timer expired state - just show LIVE indicator, don't logout
    // Auto-logout disabled for treasure hunt 2026
  };

  const handleResetTimer = () => {
    // This doesn't actually change the event end time,
    // it just refreshes the timer display
    window.location.reload();
  };

  const handleLongPress = () => {
    if (isAdmin()) {
      setShowReset(prev => !prev);
    }
  };

  // Improved touch handlers for better mobile experience
  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      handleLongPress();
    }, 1500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Normal click handler for non-touch devices
  const handleClick = () => {
    if (isAdmin()) {
      const clicks = parseInt(localStorage.getItem('adminClicks') || '0');
      localStorage.setItem('adminClicks', (clicks + 1).toString());

      if (clicks >= 4) {
        setShowReset(prev => !prev);
        localStorage.setItem('adminClicks', '0');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        .ct-unit {
          display: flex; flex-direction: column; align-items: center; gap: 1px;
        }
        .ct-digit {
          font-family: var(--font-mono); font-weight: 700; font-size: clamp(0.85rem, 3vw, 1.1rem);
          color: #00f0ff; text-shadow: 0 0 8px rgba(0,240,255,0.6);
          background: rgba(0,240,255,0.06); border: 1px solid rgba(0,240,255,0.2);
          border-radius: 5px; padding: 2px 7px; min-width: 32px; text-align: center;
          letter-spacing: 2px; line-height: 1;
        }
        .ct-label {
          font-family: var(--font-mono); font-size: 0.45rem; color: rgba(0,240,255,0.35);
          letter-spacing: 0.15em; text-transform: uppercase; margin-top: 2px;
        }
        .ct-sep {
          color: rgba(0,240,255,0.4); font-size: 1rem; font-family: var(--font-mono);
          font-weight: 700; align-self: flex-start; margin-top: 4px; animation: blink-sep 1s ease infinite;
        }
        @keyframes blink-sep { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        .ct-expired {
          font-family: var(--font-mono); font-size: 0.75rem; color: #ff3366;
          text-shadow: 0 0 8px rgba(255,51,102,0.5); letter-spacing: 0.2em;
          text-transform: uppercase; animation: blink-sep 1s ease infinite;
        }
        .ct-reset-btn {
          background: rgba(255,51,102,0.15); border: 1px solid rgba(255,51,102,0.4);
          color: #ff6680; font-family: var(--font-mono); font-size: 0.6rem;
          border-radius: 4px; padding: 3px 8px; cursor: pointer; letter-spacing: 1px;
          margin-bottom: 6px;
        }
        .ct-admin-note { font-size: 0.5rem; color: rgba(153,69,255,0.5); font-family: var(--font-mono); letter-spacing: 1px; }
      `}</style>

      {showReset && (
        <div style={{ marginBottom: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="ct-reset-btn" onClick={handleResetTimer}>Refresh Timer</button>
          <span className="ct-admin-note">ADMIN_ONLY</span>
        </div>
      )}

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onClick={handleClick}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        {isExpired ? (
          <span className="ct-expired" style={{ color: '#00f0ff', textShadow: '0 0 8px rgba(0,240,255,0.5)' }}>🏴‍☠️ LIVE</span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {timeLeft.days > 0 && (
              <>
                <div className="ct-unit">
                  <span className="ct-digit">{timeLeft.days.toString().padStart(2, '0')}</span>
                  <span className="ct-label">days</span>
                </div>
                <span className="ct-sep">:</span>
              </>
            )}
            <div className="ct-unit">
              <span className="ct-digit">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="ct-label">hrs</span>
            </div>
            <span className="ct-sep">:</span>
            <div className="ct-unit">
              <span className="ct-digit">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="ct-label">min</span>
            </div>
            <span className="ct-sep">:</span>
            <div className="ct-unit">
              <span className="ct-digit">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="ct-label">sec</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CountdownTimer;