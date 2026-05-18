import React from 'react';

export const FootballBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-elegant-black">
      {/* Luces de estadio principales */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-stadium-lights rounded-full blur-3xl opacity-80 animate-pulse-slow" />
      
      {/* Luces de acento secundarias */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-pitch-green/10 rounded-full blur-3xl opacity-40" />

      {/* Textura de césped sutil */}
      <div className="absolute inset-0 bg-pitch-pattern opacity-30" />

      {/* Líneas de cancha de fútbol (SVG decorativo) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Borde exterior */}
          <rect x="50" y="50" width="1100" height="700" stroke="white" strokeWidth="4" />
          {/* Línea central */}
          <line x1="600" y1="50" x2="600" y2="750" stroke="white" strokeWidth="4" />
          {/* Círculo central */}
          <circle cx="600" cy="400" r="120" stroke="white" strokeWidth="4" />
          <circle cx="600" cy="400" r="8" fill="white" />
          {/* Área grande izquierda */}
          <rect x="50" y="200" width="180" height="400" stroke="white" strokeWidth="4" />
          {/* Área chica izquierda */}
          <rect x="50" y="300" width="70" height="200" stroke="white" strokeWidth="4" />
          <circle cx="170" cy="400" r="6" fill="white" />
          {/* Semiluna izquierda */}
          <path d="M 230 310 A 100 100 0 0 1 230 490" stroke="white" strokeWidth="4" />
          
          {/* Área grande derecha */}
          <rect x="970" y="200" width="180" height="400" stroke="white" strokeWidth="4" />
          {/* Área chica derecha */}
          <rect x="1080" y="300" width="70" height="200" stroke="white" strokeWidth="4" />
          <circle cx="1030" cy="400" r="6" fill="white" />
          {/* Semiluna derecha */}
          <path d="M 970 310 A 100 100 0 0 0 970 490" stroke="white" strokeWidth="4" />
        </svg>
      </div>

      {/* Partículas / Confeti flotante sutil */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const size = Math.random() * 6 + 4;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = Math.random() * 6 + 4;
          const isGold = i % 3 === 0;

          return (
            <div
              key={i}
              className={`absolute rounded-full animate-float ${isGold ? 'bg-gold shadow-gold-glow' : 'bg-pitch-green-light shadow-green-glow'}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
