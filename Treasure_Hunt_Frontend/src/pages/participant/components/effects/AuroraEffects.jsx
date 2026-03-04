const AuroraEffect = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    <style>{`
      @keyframes aurora-drift-1 {
        0%   { transform: translate(-30%, -30%) rotate(0deg); }
        50%  { transform: translate(10%, 20%) rotate(180deg); }
        100% { transform: translate(-30%, -30%) rotate(360deg); }
      }
      @keyframes aurora-drift-2 {
        0%   { transform: translate(30%, 30%) rotate(0deg); }
        50%  { transform: translate(-10%, -20%) rotate(-180deg); }
        100% { transform: translate(30%, 30%) rotate(-360deg); }
      }
      @keyframes aurora-drift-3 {
        0%   { transform: translate(0%, -50%) scale(1); }
        50%  { transform: translate(20%, 0%) scale(1.3); }
        100% { transform: translate(0%, -50%) scale(1); }
      }
      @keyframes aurora-drift-4 {
        0%   { transform: translate(0, 0) scale(1); opacity: 0.35; }
        50%  { transform: translate(-15%, 10%) scale(1.2); opacity: 0.55; }
        100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
      }
    `}</style>

    {/* Cyan orb — much bigger & brighter */}
    <div style={{
      position: 'absolute',
      top: '-5%', left: '-5%',
      width: '80vw', height: '80vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(0,240,255,0.32) 0%, rgba(0,240,255,0.10) 40%, transparent 70%)',
      animation: 'aurora-drift-1 22s infinite linear',
      filter: 'blur(22px)',
    }} />

    {/* Purple orb */}
    <div style={{
      position: 'absolute',
      bottom: '-5%', right: '-5%',
      width: '85vw', height: '85vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(153,69,255,0.28) 0%, rgba(153,69,255,0.08) 45%, transparent 70%)',
      animation: 'aurora-drift-2 28s infinite linear',
      filter: 'blur(24px)',
    }} />

    {/* Gold accent orb */}
    <div style={{
      position: 'absolute',
      top: '40%', left: '40%',
      width: '55vw', height: '55vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,215,0,0.14) 0%, rgba(255,100,0,0.06) 50%, transparent 70%)',
      animation: 'aurora-drift-3 18s infinite ease-in-out',
      filter: 'blur(30px)',
    }} />

    {/* Red/pink accent — top right */}
    <div style={{
      position: 'absolute',
      top: '10%', right: '5%',
      width: '45vw', height: '45vw',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,51,102,0.18) 0%, transparent 65%)',
      animation: 'aurora-drift-4 15s infinite ease-in-out',
      filter: 'blur(28px)',
    }} />
  </div>
);

export default AuroraEffect;
