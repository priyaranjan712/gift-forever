
import React, { useEffect, useState } from 'react';

const BackgroundEffects: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; left: string; duration: string; size: string; type: string; delay: string; color: string; blur: string }[]>([]);

  useEffect(() => {
    const symbols = ['❤️', '✨', '💖', '★', '🌸', '✧', '💎', '❈'];
    const colors = ['#fb7185', '#fda4af', '#f43f5e', '#fbbf24', '#ffd700', '#fdf2f8'];
    
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${12 + Math.random() * 20}s`,
      delay: `${Math.random() * -30}s`, 
      size: `${Math.random() * 18 + 8}px`,
      type: symbols[Math.floor(Math.random() * symbols.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      blur: Math.random() > 0.8 ? 'blur(1px)' : 'none'
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,241,242,1)_0%,rgba(255,255,255,1)_100%)]"></div>
      
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            fontSize: p.size,
            color: p.color,
            filter: p.blur,
            textShadow: p.type === '★' || p.type === '✨' ? `0 0 10px ${p.color}` : 'none',
            zIndex: 0
          }}
        >
          {p.type}
        </div>
      ))}
      
      {/* Dynamic light sources */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-rose-200/10 blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-rose-300/10 blur-[150px] animate-pulse" style={{ animationDelay: '3s' }}></div>
    </div>
  );
};

export default BackgroundEffects;
