import { useState, useEffect, useRef } from 'react';

const QuestionTimer = ({ timeLimit = 300, questionId, onTimeUp }) => {
    // localStorage key unique per question per user
    const storageKey = `qtimer_${questionId}_${(localStorage.getItem('token') || '').slice(-12)}`;

    const [secondsLeft, setSecondsLeft] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            const { startTime, limit } = JSON.parse(saved);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            return Math.max(0, limit - elapsed);
        }
        // First time seeing this question — save start time
        localStorage.setItem(storageKey, JSON.stringify({ startTime: Date.now(), limit: timeLimit }));
        return timeLimit;
    });

    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setSecondsLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    if (onTimeUp) onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [questionId]);

    // Cleanup timer from localStorage when question changes
    useEffect(() => {
        return () => {
            // Don't remove—keep it so refresh doesn't reset the timer
        };
    }, [questionId]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const percentage = (secondsLeft / timeLimit) * 100;

    // Color coding
    const isUrgent = secondsLeft <= 60;
    const isCritical = secondsLeft <= 30;
    const color = isCritical ? 'var(--color-red)' : isUrgent ? '#e67e22' : 'var(--color-green)';

    return (
        <div style={{
            width: '100%',
            position: 'relative',
            zIndex: 1,
            marginBottom: '1rem',
            padding: '0 0.5rem',
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <span style={{
                        fontSize: '1.1rem',
                        animation: isCritical ? 'pulse 0.5s infinite' : isUrgent ? 'pulse 1s infinite' : 'none',
                    }}>
                        ⏱️
                    </span>
                    <span style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.1rem',
                        color: color,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: '1px',
                        transition: 'color 0.3s',
                    }}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                </div>
                {isCritical && (
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        color: 'var(--color-red)',
                        background: '#ffebee',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1.5px solid var(--color-red)',
                        animation: 'pulse 0.5s infinite',
                    }}>
                        HURRY UP!
                    </span>
                )}
                {isUrgent && !isCritical && (
                    <span style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        color: '#e67e22',
                        background: '#fff8e1',
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1.5px solid #e67e22',
                    }}>
                        RUNNING LOW
                    </span>
                )}
            </div>

            {/* Timer bar */}
            <div style={{
                height: 8,
                background: '#ffe4c4',
                borderRadius: 6,
                overflow: 'hidden',
                border: `1.5px solid ${color}`,
                transition: 'border-color 0.3s',
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: color,
                    borderRadius: 4,
                    transition: 'width 1s linear, background 0.3s',
                }} />
            </div>
        </div>
    );
};

export default QuestionTimer;
