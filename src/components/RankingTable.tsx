import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowUpDown, Trophy, Medal, Award, CheckCircle2, Clock } from 'lucide-react';
import { Participant } from '../types';

interface RankingTableProps {
  participants: Participant[];
  onSelectParticipant?: (id: string) => void;
}

export const RankingTable: React.FC<RankingTableProps> = ({ participants, onSelectParticipant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [limit, setLimit] = useState<number>(0); // 0 = todos
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'totalPoints' | 'groupsPoints' | 'knockoutsPoints'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredParticipants = useMemo(() => {
    let result = [...participants];

    // Búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }

    // Filtro de estado de pago
    if (filterStatus !== 'todos') {
      result = result.filter(p => p.paymentStatus === filterStatus);
    }

    // Ordenamiento
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        valA = (valA as string).toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Límite Top N
    if (limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }, [participants, searchTerm, filterStatus, limit, sortBy, sortOrder]);

  const handleSort = (field: 'rank' | 'name' | 'totalPoints' | 'groupsPoints' | 'knockoutsPoints') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'name' ? 'asc' : 'asc'); // rank asc por defecto
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { bg: 'bg-gold text-elegant-black font-black shadow-gold-glow', icon: Trophy, label: 'Oro' };
    if (rank === 2) return { bg: 'bg-slate-300 text-slate-900 font-bold', icon: Medal, label: 'Plata' };
    if (rank === 3) return { bg: 'bg-amber-600 text-white font-bold', icon: Award, label: 'Bronce' };
    return { bg: 'bg-slate-800 text-slate-300 font-medium', icon: null, label: rank };
  };

  return (
    <div className="w-full glass-panel p-6 md:p-8 mb-8 z-10 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
            <span>RANKING GENERAL</span>
            <span className="text-xs font-semibold px-3 py-1 bg-pitch-green/20 border border-pitch-green/30 text-pitch-green-light rounded-full uppercase tracking-wider">
              {filteredParticipants.length} Participantes
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Tabla oficial de posiciones. Usa los filtros para buscar o segmentar por estado de pago.
          </p>
        </div>

        {/* Filtros y Controles */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
          {/* Búsqueda */}
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar participante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green transition-colors shadow-inner"
            />
          </div>

          {/* Filtro Estado Pago */}
          <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-700/80 rounded-xl p-1 text-xs shadow-inner">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
            {(['todos', 'pagado', 'pendiente'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filterStatus === status ? 'bg-pitch-green text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Filtro Top N */}
          <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-700/80 rounded-xl p-1 text-xs shadow-inner">
            <button
              onClick={() => setLimit(5)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${limit === 5 ? 'bg-gold text-elegant-black font-bold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Top 5
            </button>
            <button
              onClick={() => setLimit(10)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${limit === 10 ? 'bg-gold text-elegant-black font-bold shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Top 10
            </button>
            <button
              onClick={() => setLimit(0)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${limit === 0 ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Todos
            </button>
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/80 shadow-2xl bg-elegant-black/40 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              <th className="py-4 px-4 text-center w-16 cursor-pointer hover:text-pitch-green transition-colors" onClick={() => handleSort('rank')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Pos</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-6 cursor-pointer hover:text-pitch-green transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">
                  <span>Participante</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-4 text-center cursor-pointer hover:text-pitch-green transition-colors" onClick={() => handleSort('totalPoints')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Pts Totales</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-4 text-center hidden sm:table-cell cursor-pointer hover:text-pitch-green transition-colors" onClick={() => handleSort('groupsPoints')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Grupos</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-4 text-center hidden sm:table-cell cursor-pointer hover:text-pitch-green transition-colors" onClick={() => handleSort('knockoutsPoints')}>
                <div className="flex items-center justify-center gap-1">
                  <span>Knockouts</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-4 px-4 text-center">Estado Pago</th>
              <th className="py-4 px-6 text-center hidden md:table-cell">Dif con Líder</th>
            </tr>
          </thead>
          <AnimatePresence>
            <tbody>
              {filteredParticipants.map((p, index) => {
                const rankBadge = getRankBadge(p.rank);
                const IconComp = rankBadge.icon;
                const isTop3 = p.rank <= 3;

                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    onClick={() => onSelectParticipant && onSelectParticipant(p.id)}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer group ${
                      p.rank === 1 ? 'bg-gold/5 hover:bg-gold/10 font-semibold' : ''
                    }`}
                  >
                    {/* Posición / Medalla */}
                    <td className="py-4 px-4 text-center">
                      <div className={`w-8 h-8 mx-auto rounded-xl flex items-center justify-center text-xs shadow-md transition-transform group-hover:scale-110 ${rankBadge.bg}`}>
                        {IconComp ? <IconComp className="w-4 h-4" /> : p.rank}
                      </div>
                    </td>

                    {/* Nombre Participante */}
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border shadow-inner ${
                          isTop3 ? 'bg-gradient-to-br from-gold/20 to-amber-600/30 border-gold/40 text-gold' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`text-sm md:text-base font-bold font-['Outfit'] group-hover:text-pitch-green-light transition-colors ${
                            p.rank === 1 ? 'text-gold text-glow-gold' : 'text-white'
                          }`}>
                            {p.name}
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">
                            ID: #{p.rank} • {p.currency}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Puntos Totales */}
                    <td className="py-4 px-4 text-center">
                      <span className={`text-base md:text-lg font-black font-['Outfit'] px-3 py-1 rounded-xl shadow-inner ${
                        p.rank === 1 ? 'bg-gold/20 text-gold border border-gold/30' : 'bg-slate-900/80 text-white border border-slate-800'
                      }`}>
                        {p.totalPoints}
                      </span>
                    </td>

                    {/* Puntos Grupos */}
                    <td className="py-4 px-4 text-center hidden sm:table-cell text-xs font-semibold text-slate-300">
                      {p.groupsPoints}
                    </td>

                    {/* Puntos Knockouts */}
                    <td className="py-4 px-4 text-center hidden sm:table-cell text-xs font-semibold text-slate-300">
                      {p.knockoutsPoints}
                    </td>

                    {/* Estado de Pago */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          p.paymentStatus === 'pagado' ? 'bg-pitch-green/20 text-pitch-green-light border-pitch-green/30' :
                          p.paymentStatus === 'pendiente' ? 'bg-alert-orange/20 text-alert-orange-light border-alert-orange/30' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {p.paymentStatus === 'pagado' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          <span>{p.paymentStatus}</span>
                        </span>
                      </div>
                    </td>

                    {/* Diferencia con el Líder */}
                    <td className="py-4 px-6 text-center hidden md:table-cell text-xs font-semibold">
                      {p.diffToLeader === 0 ? (
                        <span className="text-gold font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 bg-gold/10 rounded-full border border-gold/20">
                          ★ Líder ★
                        </span>
                      ) : (
                        <span className="text-alert-orange-light bg-alert-orange/10 px-2.5 py-1 rounded-xl border border-alert-orange/20">
                          -{p.diffToLeader} pts
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </AnimatePresence>
        </table>

        {filteredParticipants.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm font-light">
            No se encontraron participantes que coincidan con los filtros seleccionados.
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 px-2 gap-2">
        <p>💡 Haz clic en cualquier participante para ver el detalle de sus pronósticos</p>
        <p>🏆 Mostrando {filteredParticipants.length} de {participants.length} participantes</p>
      </div>
    </div>
  );
};
