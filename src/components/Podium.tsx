import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Crown, Star } from 'lucide-react';
import { Participant } from '../types';

interface PodiumProps {
  participants: Participant[];
  logoUrl: string;
}

export const Podium: React.FC<PodiumProps> = ({ participants }) => {
  const top3 = participants.slice(0, 3);
  if (top3.length === 0) return null;

  // Reordenar para el render visual: [Segundo (Plata), Primero (Oro), Tercero (Bronce)]
  // Aseguramos que existan antes de asignar
  const second = top3[1];
  const first = top3[0];
  const third = top3[2];

  const podiumItems = [
    {
      item: second,
      pos: 2,
      color: 'from-slate-300/20 to-slate-500/40 border-slate-300/40 text-slate-200',
      badgeColor: 'bg-slate-300 text-slate-900',
      height: 'h-40 md:h-48',
      delay: 0.4,
      medal: 'Plata',
      trophyColor: 'text-slate-300',
    },
    {
      item: first,
      pos: 1,
      color: 'from-gold/30 via-amber-600/40 to-amber-900/50 border-gold/50 text-gold shadow-gold-glow',
      badgeColor: 'bg-gold text-elegant-black font-black',
      height: 'h-52 md:h-64',
      delay: 0.2, // El primero aparece un poco antes o con más impacto
      medal: 'Oro',
      trophyColor: 'text-gold',
      isWinner: true,
    },
    {
      item: third,
      pos: 3,
      color: 'from-amber-700/20 to-amber-900/40 border-amber-700/40 text-amber-500',
      badgeColor: 'bg-amber-600 text-white',
      height: 'h-32 md:h-36',
      delay: 0.6,
      medal: 'Bronce',
      trophyColor: 'text-amber-600',
    },
  ];

  return (
    <div className="w-full glass-panel p-6 md:p-10 mb-8 relative overflow-hidden z-10">
      {/* Luces y brillos de fondo del podio */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-at-t from-gold/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold uppercase tracking-widest mb-2">
          <Crown className="w-4 h-4 animate-bounce" />
          <span>Podio de Campeones</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white font-['Outfit'] tracking-tight">
          LÍDERES DE LA <span className="text-gold text-glow-gold">POLLA MUNDIALISTA</span>
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-1 font-light max-w-xl mx-auto">
          Los tres participantes en la cima de la tabla compitiendo por la gloria mundialista.
        </p>
      </div>

      {/* Contenedor del Podio */}
      <div className="flex items-end justify-center gap-3 sm:gap-6 max-w-4xl mx-auto pt-16 pb-4 relative z-10">
        {podiumItems.map((p, idx) => {
          if (!p.item) return null;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              {/* Tarjeta de Información del Participante */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: p.delay, duration: 0.5 }}
                className={`w-full flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl mb-4 bg-elegant-black/60 backdrop-blur-sm border border-slate-800/80 relative group ${
                  p.isWinner ? 'shadow-[0_0_25px_rgba(251,191,36,0.25)] border-gold/40' : ''
                }`}
              >
                {/* Corona o Estrella decorativa */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  {p.isWinner ? (
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }} 
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="p-2 bg-gold rounded-full shadow-gold-glow text-elegant-black"
                    >
                      <Crown className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <div className={`p-1.5 rounded-full ${p.badgeColor} shadow-md`}>
                      <Star className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="mt-4 mb-1 w-full">
                  <p className="text-xs sm:text-base font-bold text-white line-clamp-1 font-['Outfit'] group-hover:text-gold transition-colors">
                    {p.item.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <Award className="w-3 h-3 text-pitch-green-light" />
                    <span>Medalla de {p.medal}</span>
                  </p>
                </div>

                <div className="mt-2 py-1 px-3 bg-slate-900/80 rounded-xl border border-slate-700/50 w-full">
                  <p className="text-base sm:text-xl font-black text-white font-['Outfit'] tracking-tight">
                    {p.item.totalPoints} <span className="text-[10px] sm:text-xs font-normal text-slate-400">pts</span>
                  </p>
                </div>

                {/* Badge de Pago */}
                <div className="mt-2.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    p.item.paymentStatus === 'pagado' ? 'bg-pitch-green/20 text-pitch-green-light border border-pitch-green/30' :
                    p.item.paymentStatus === 'pendiente' ? 'bg-alert-orange/20 text-alert-orange-light border border-alert-orange/30' :
                    'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                  }`}>
                    {p.item.paymentStatus}
                  </span>
                </div>
              </motion.div>

              {/* Pedestal 3D Animado */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ delay: p.delay + 0.2, duration: 0.6, type: "spring", stiffness: 80 }}
                className={`w-full ${p.height} bg-gradient-to-t ${p.color} rounded-t-2xl backdrop-blur-md border-t-2 border-x border-slate-700/50 flex flex-col items-center justify-start pt-4 sm:pt-6 relative overflow-hidden group shadow-2xl`}
              >
                {/* Reflejo de luz en el pedestal */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />

                <div className={`p-2 sm:p-3 rounded-full bg-elegant-black/40 border border-white/10 backdrop-blur-md mb-2 ${p.trophyColor}`}>
                  <Trophy className={`w-6 h-6 sm:w-8 sm:h-8 ${p.isWinner ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }} />
                </div>

                <span className={`text-2xl sm:text-4xl font-black font-['Outfit'] ${p.badgeColor} px-4 py-1 rounded-xl shadow-lg drop-shadow`}>
                  {p.pos}
                </span>

                {p.isWinner && (
                  <div className="absolute bottom-4 text-[10px] font-bold tracking-widest uppercase text-gold animate-pulse hidden sm:block">
                    ★ Campeón ★
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Confeti sutil decorativo en la base */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-pitch-green/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
