import { useEffect, useRef } from 'react';

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Regular stars — bigger, more numerous
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.4,
      speed: Math.random() * 0.4 + 0.06,
      color: ['#00f0ff', '#9945ff', '#ffd700', '#ffffff'][Math.floor(Math.random() * 4)],
      alpha: Math.random(),
      alphaDir: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      glowSize: Math.random() * 12 + 4,
    }));

    // Shooting stars
    const shooters = Array.from({ length: 4 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.5,
      vx: (Math.random() * 5 + 4) * (Math.random() > 0.5 ? 1 : -1),
      vy: Math.random() * 2 + 1,
      len: Math.random() * 120 + 60,
      alpha: 0,
      alphaDir: 0.02,
      timer: Math.random() * 300,
      color: Math.random() > 0.5 ? '#00f0ff' : '#ffffff',
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      stars.forEach(s => {
        s.alpha += s.alphaDir;
        if (s.alpha <= 0.05 || s.alpha >= 1) s.alphaDir *= -1;
        s.y -= s.speed;
        if (s.y < -2) { s.y = height + 2; s.x = Math.random() * width; }

        ctx.save();
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
        g.addColorStop(0, s.color);
        g.addColorStop(0.4, s.color + '88');
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        // bright core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = s.alpha * 0.9;
        ctx.fill();
        ctx.restore();
      });

      // Draw shooting stars
      shooters.forEach(s => {
        s.timer--;
        if (s.timer <= 0) {
          s.x = Math.random() * width;
          s.y = Math.random() * height * 0.3;
          s.vx = (Math.random() * 6 + 5) * (Math.random() > 0.5 ? 1 : -1);
          s.vy = Math.random() * 3 + 1;
          s.alpha = 0;
          s.alphaDir = 0.025;
          s.timer = Math.random() * 400 + 150;
          s.len = Math.random() * 150 + 60;
        }
        s.alpha = Math.max(0, Math.min(1, s.alpha + s.alphaDir));
        if (s.alpha >= 0.9) s.alphaDir = -0.015;
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > width || s.y > height) s.timer = 0;

        if (s.alpha > 0.01) {
          ctx.save();
          const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * (s.len / 6), s.y - s.vy * (s.len / 6));
          grad.addColorStop(0, s.color);
          grad.addColorStop(1, 'transparent');
          ctx.globalAlpha = s.alpha * 0.85;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * (s.len / 6), s.y - s.vy * (s.len / 6));
          ctx.stroke();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          background: 'linear-gradient(135deg, #03040a 0%, #080c17 50%, #03040a 100%)',
        }}
      />
      {/* Hex grid overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.055 }}>
          <defs>
            <pattern id="phex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon points="30,2 58,17 58,35 30,50 2,35 2,17" fill="none" stroke="#00f0ff" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#phex)" />
        </svg>
      </div>
    </>
  );
};

export default StarField;
