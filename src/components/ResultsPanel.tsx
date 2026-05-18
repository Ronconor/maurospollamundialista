import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Clock, Play, CheckCircle2, Dribbble, Filter, Search } from 'lucide-react';
import { MatchResult } from '../types';

interface ResultsPanelProps {
  matches: MatchResult[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ matches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Obtener fases únicas para el filtro
  const stages = useMemo(() => {
    const set = new Set<string>();
    matches.forEach(m => { if (m.stage) set.add(m.stage); });
    return ['todos', ...Array.from(set)];
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const homeMatch = m.homeTeam.toLowerCase().includes(term);
        const awayMatch = m.awayTeam.toLowerCase().includes(term);
        const groupMatch = m.group?.toLowerCase().includes(term);
        if (!homeMatch && !awayMatch && !groupMatch) return false;
      }
      if (filterStage !== 'todos' && m.stage !== filterStage) return false;
      if (filterStatus !== 'todos' && m.status !== filterStatus) return false;
      return true;
    });
  }, [matches, searchTerm, filterStage, filterStatus]);

  const getStatusBadge = (status: string) => {
    if (status === 'en_juego') {
      return {
        bg: 'bg-alert-orange/20 border-alert-orange text-alert-orange-light animate-pulse',
        label: '🔴 En Vivo',
      };
    }
    if (status === 'finalizado') {
      return {
        bg: 'bg-pitch-green/20 border-pitch-green/40 text-pitch-green-light',
        label: '✓ Finalizado',
      };
    }
    return {
      bg: 'bg-slate-800 border-slate-700 text-slate-400',
      label: '🕒 Pendiente',
    };
  };

  return (
    <div className="space-y-6 mb-8 z-10 relative">
      <div className="glass-panel p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight flex items-center gap-2">
              <Dribbble className="w-6 h-6 text-pitch-green animate-spin" style={{ animationDuration: '10s' }} />
              <span>MARCADOR MUNDIALISTA 2026</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Resultados oficiales del torneo. Sigue los marcadores de la fase de grupos y eliminatorias.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
            {/* Búsqueda */}
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar equipo o grupo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green transition-colors shadow-inner"
              />
            </div>

            {/* Filtro Fase */}
            <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-700/80 rounded-xl p-1 text-xs shadow-inner">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              {stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setFilterStage(stage)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    filterStage === stage ? 'bg-pitch-green text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>

            {/* Filtro Estado */}
            <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-700/80 rounded-xl p-1 text-xs shadow-inner">
              {(['todos', 'finalizado', 'en_juego', 'pendiente'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    filterStatus === st ? 'bg-gold text-elegant-black font-bold shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rejilla de Partidos (Scoreboard Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredMatches.map((m, index) => {
              const badge = getStatusBadge(m.status);

              return (
                <motion.div
                  key={m.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="bg-gradient-to-b from-slate-900/90 to-elegant-black/95 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Decoración superior sutil */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-700 group-hover:via-pitch-green to-transparent transition-all" />

                  {/* Cabecera del Partido: Fase, Grupo, Fecha, Estado */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3 text-xs">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-pitch-green-light" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">
                        {m.stage} {m.group ? `• ${m.group}` : ''}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Cuerpo del Marcador: Equipo Local vs Equipo Visitante */}
                  <div className="flex items-center justify-between my-2 py-2 px-3 bg-elegant-black/60 rounded-xl border border-slate-800/60 shadow-inner">
                    
                    {/* Equipo Local */}
                    <div className="flex-1 text-right pr-3">
                      <p className={`text-base font-bold font-['Outfit'] truncate ${
                        m.winner === m.homeTeam ? 'text-gold text-glow-gold' : 'text-white'
                      }`}>
                        {m.homeTeam}
                      </p>
                      {m.winner === m.homeTeam && (
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">★ Ganador</span>
                      )}
                    </div>

                    {/* Marcador Central */}
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-lg min-w-[90px]">
                      <span className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
                        {m.homeScore !== undefined ? m.homeScore : '-'}
                      </span>
                      <span className="text-slate-500 font-bold">:</span>
                      <span className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
                        {m.awayScore !== undefined ? m.awayScore : '-'}
                      </span>
                    </div>

                    {/* Equipo Visitante */}
                    <div className="flex-1 text-left pl-3">
                      <p className={`text-base font-bold font-['Outfit'] truncate ${
                        m.winner === m.awayTeam ? 'text-gold text-glow-gold' : 'text-white'
                      }`}>
                        {m.awayTeam}
                      </p>
                      {m.winner === m.awayTeam && (
                        <span className="text-[9px] uppercase tracking-widest text-gold font-bold">★ Ganador</span>
                      )}
                    </div>

                  </div>

                  {/* Pie del Partido: Fecha y Ganador/Empate */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-light">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {m.date}
                    </span>
                    {m.winner === 'Empate' ? (
                      <span className="text-slate-300 font-semibold bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700">
                        🤝 Empate
                      </span>
                    ) : m.winner ? (
                      <span className="text-pitch-green-light font-semibold flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-gold" />
                        Victoria {m.winner}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Por disputarse</span>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredMatches.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm font-light border border-dashed border-slate-800 rounded-2xl mt-4">
            No se encontraron partidos que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};
