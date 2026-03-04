import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EVENT_START = new Date('2026-03-06T05:30:00.000Z'); // 11:00 AM IST

const pad = (n) => String(n).padStart(2, '0');

const TimeUnit = ({ value, label }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 64,
    }}>
        <motion.div
            key={value}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.6rem',
                lineHeight: 1,
                color: 'var(--color-green)',
                background: 'var(--color-bg-card)',
                border: '3px solid var(--color-green)',
                borderRadius: 14,
                boxShadow: '4px 4px 0 var(--color-green-dim)',
                padding: '0.6rem 0.85rem',
                minWidth: 64,
                textAlign: 'center',
            }}
        >
            {pad(value)}
        </motion.div>
        <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 800,
            fontSize: '0.7rem',
            color: 'var(--color-brown)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: 6,
        }}>
            {label}
        </span>
    </div>
);

const Separator = () => (
    <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '2.2rem',
        color: 'var(--color-brown)',
        padding: '0 2px',
        marginBottom: 16,
        animation: 'pulse 1.5s infinite',
    }}>
        :
    </span>
);

const CountdownScreen = () => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    function getTimeLeft() {
        const diff = EVENT_START - new Date();
        if (diff <= 0) return null;
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const tl = getTimeLeft();
            if (!tl) {
                clearInterval(timer);
                window.location.reload(); // Reload to start the hunt
            }
            setTimeLeft(tl);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!timeLeft) return null;

    return (
        <div className="flex-col-center" style={{ flex: 1, position: 'relative', padding: '2rem 1rem' }}>
            {/* Background decorative SVG */}
            <svg
                className="path-overlay" viewBox="0 0 500 800" preserveAspectRatio="none"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
            >
                <path d="M-50 150 Q 250 100, 300 300 T 150 500 T 550 700" className="path-line" />
            </svg>

            {/* Treasure chest icon */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}
            >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="th-float">
                    {/* Chest body */}
                    <rect x="10" y="35" width="60" height="30" rx="4" fill="var(--color-brown)" stroke="var(--color-brown-dim)" strokeWidth="3" />
                    {/* Chest lid */}
                    <path d="M10 35 Q40 10 70 35" fill="var(--color-brown-light)" stroke="var(--color-brown-dim)" strokeWidth="3" />
                    {/* Lock */}
                    <circle cx="40" cy="50" r="6" fill="var(--color-bg-card)" stroke="var(--color-brown-dim)" strokeWidth="2" />
                    <rect x="38" y="50" width="4" height="8" rx="1" fill="var(--color-brown-dim)" />
                    {/* Sparkles */}
                    <circle cx="25" cy="20" r="3" fill="var(--color-green)" opacity="0.7">
                        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="58" cy="18" r="2.5" fill="var(--color-red)" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.15;0.6" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="42" cy="12" r="2" fill="var(--color-blue)" opacity="0.5">
                        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                </svg>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    color: 'var(--color-green)',
                    textAlign: 'center',
                    marginBottom: '0.3rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                THE HUNT BEGINS IN
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--color-brown)',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                March 6, 2026 — 11:00 AM IST
            </motion.p>

            {/* Countdown display */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    flexWrap: 'wrap',
                    marginBottom: '2rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <TimeUnit value={timeLeft.days} label="Days" />
                <Separator />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <Separator />
                <TimeUnit value={timeLeft.minutes} label="Mins" />
                <Separator />
                <TimeUnit value={timeLeft.seconds} label="Secs" />
            </motion.div>

            {/* Info card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="adventure-card"
                style={{ maxWidth: 380, textAlign: 'center' }}
            >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-green)', marginBottom: '0.5rem' }}>
                    PREPARE YOUR EXPEDITION
                </h3>
                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-brown)', margin: 0, lineHeight: 1.6 }}>
                    Gather your crew, sharpen your wits, and get ready for the ultimate campus treasure hunt!
                    Questions will be randomized — every team gets a <strong>unique trail</strong>.
                </p>
                <div style={{
                    marginTop: '1rem',
                    padding: '0.6rem 1rem',
                    background: 'var(--color-bg-secondary)',
                    borderRadius: 10,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--color-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                }}>
                    <span>⏱️</span>
                    Each clue is timed — solve fast, score big!
                </div>
            </motion.div>
        </div>
    );
};

export default CountdownScreen;
