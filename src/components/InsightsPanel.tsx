import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, TrendingUp, AlertTriangle, CheckCircle2, MessageSquare, Zap, Flame } from 'lucide-react';
import { Insight } from '../types';

interface InsightsPanelProps {
  insights: Insight[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  const getInsightConfig = (type: string, category: string) => {
    if (category === 'liderazgo') {
      return {
        bg: 'from-amber-500/20 to-amber-900/40 border-gold/40 text-gold shadow-gold-glow',
        icon: Trophy,
        badgeBg: 'bg-gold/20 text-gold',
        title: 'Clave de Campeonato'
      };
    }
    if (category === 'pagos') {
      return type === 'positive' ? {
        bg: 'from-emerald-500/20 to-emerald-900/40 border-pitch-green/40 text-pitch-green-light shadow-green-glow',
        icon: CheckCircle2,
        badgeBg: 'bg-pitch-green/20 text-pitch-green-light',
        title: 'Gestión Financiera'
      } : {
        bg: 'from-orange-500/20 to-red-900/40 border-alert-orange/40 text-alert-orange-light shadow-[0_0_15px_rgba(249,115,22,0.2)]',
        icon: AlertTriangle,
        badgeBg: 'bg-alert-orange/20 text-alert-orange-light',
        title: 'Alerta de Pagos'
      };
    }
    if (category === 'competencia') {
      return {
        bg: 'from-blue-500/20 to-indigo-900/40 border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        icon: Flame,
        badgeBg: 'bg-blue-500/20 text-blue-400',
        title: 'Termómetro de la Polla'
      };
    }
    return {
      bg: 'from-purple-500/20 to-purple-900/40 border-purple-500/40 text-purple-400',
      icon: Zap,
      badgeBg: 'bg-purple-500/20 text-purple-400',
      title: 'Dato Mundialista'
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
  };

  return (
    <div className="space-y-6 mb-8 z-10 relative">
      <div className="glass-panel p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
          <div className="p-2.5 bg-gold/20 text-gold rounded-2xl shadow-gold-glow animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
              ANÁLISIS DE LA <span className="text-gold text-glow-gold">POLLA</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              Insights automáticos, divertidos y futboleros generados en tiempo real por nuestra inteligencia deportiva.
            </p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {insights.map((ins, index) => {
            const cfg = getInsightConfig(ins.type, ins.category);
            const IconComponent = cfg.icon;

            return (
              <motion.div 
                key={ins.id || index}
                variants={itemVariants} 
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-br ${cfg.bg} backdrop-blur-md rounded-2xl p-6 border flex flex-col justify-between relative overflow-hidden group transition-all`}
              >
                {/* Brillo de fondo */}
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-white font-['Outfit'] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cfg.title}</span>
                    </span>
                    <div className={`p-2 rounded-xl ${cfg.badgeBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-base md:text-lg font-medium text-slate-100 leading-relaxed font-['Outfit'] drop-shadow-sm">
                    “{ins.text}”
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span>⚽ Inteligencia Deportiva 2026</span>
                  <span className="italic">Generado automáticamente</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
