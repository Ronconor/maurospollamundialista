import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, CheckCircle2, Clock, Target, TrendingUp, Trophy, AlertTriangle, Zap, Percent } from 'lucide-react';
import { SummaryStats } from '../types';

interface SummaryCardsProps {
  summary: SummaryStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const formatCurr = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const cards = [
    {
      title: 'Participantes',
      value: summary.totalParticipants,
      icon: Users,
      color: 'from-blue-600/20 to-blue-900/40 border-blue-500/30 text-blue-400',
      iconBg: 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    },
    {
      title: 'Total Recaudado',
      value: formatCurr(summary.totalCollected),
      icon: DollarSign,
      color: 'from-pitch-green/20 to-pitch-green-darker/40 border-pitch-green/30 text-pitch-green-light',
      iconBg: 'bg-pitch-green/20 text-pitch-green-light shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    },
    {
      title: 'Pagos Completos',
      value: summary.paidCount,
      icon: CheckCircle2,
      color: 'from-emerald-600/20 to-emerald-900/40 border-emerald-500/30 text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    },
    {
      title: 'Pendientes Pago',
      value: summary.pendingCount,
      icon: Clock,
      color: summary.pendingCount > 0 ? 'from-alert-orange/20 to-red-900/40 border-alert-orange/30 text-alert-orange-light' : 'from-slate-700/20 to-slate-800/40 border-slate-600/30 text-slate-300',
      iconBg: summary.pendingCount > 0 ? 'bg-alert-orange/20 text-alert-orange shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-slate-700/50 text-slate-400',
    },
    {
      title: 'Puntos Totales',
      value: summary.totalPoints,
      icon: Target,
      color: 'from-purple-600/20 to-purple-900/40 border-purple-500/30 text-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
    },
    {
      title: 'Promedio Puntos',
      value: summary.avgPoints,
      icon: TrendingUp,
      color: 'from-indigo-600/20 to-indigo-900/40 border-indigo-500/30 text-indigo-400',
      iconBg: 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
    },
    {
      title: 'Líder Actual',
      value: summary.leaderName,
      icon: Trophy,
      color: 'from-gold/20 to-amber-900/40 border-gold/30 text-gold',
      iconBg: 'bg-gold/20 text-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]',
    },
    {
      title: 'Último Lugar',
      value: summary.lastPlaceName,
      icon: AlertTriangle,
      color: 'from-slate-700/20 to-slate-900/40 border-slate-700/50 text-slate-400',
      iconBg: 'bg-slate-800 text-slate-400',
    },
    {
      title: 'Ventaja del Líder',
      value: `${summary.diffFirstSecond} pts`,
      icon: Zap,
      color: 'from-amber-600/20 to-amber-900/40 border-amber-500/30 text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    },
    {
      title: '% Pagos',
      value: `${summary.paidPercentage}%`,
      icon: Percent,
      color: summary.paidPercentage === 100 ? 'from-pitch-green/20 to-pitch-green-darker/40 border-pitch-green/30 text-pitch-green-light' : 'from-blue-600/20 to-blue-900/40 border-blue-500/30 text-blue-400',
      iconBg: summary.paidPercentage === 100 ? 'bg-pitch-green/20 text-pitch-green-light shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-blue-500/20 text-blue-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 z-10 relative"
    >
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.03, translateY: -4 }}
            className={`bg-gradient-to-br ${card.color} backdrop-blur-md border rounded-2xl p-5 shadow-glass transition-all duration-200 flex flex-col justify-between group overflow-hidden relative`}
          >
            {/* Brillo de fondo al hacer hover */}
            <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider line-clamp-1">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="text-2xl md:text-3xl font-black tracking-tight text-white font-['Outfit'] line-clamp-1 drop-shadow-sm">
                {card.value}
              </div>
            </div>

            {/* Pequeña barra inferior decorativa */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        );
      })}
    </motion.div>
  );
};
