import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle2, XCircle, AlertCircle, Clock, Target, Filter, Calendar } from 'lucide-react';
import { Prediction, Participant } from '../types';

interface PredictionsPanelProps {
  predictions: Prediction[];
  participants: Participant[];
  selectedParticipantId?: string;
  onSelectParticipant: (id: string) => void;
}

export const PredictionsPanel: React.FC<PredictionsPanelProps> = ({ 
  predictions, 
  participants, 
  selectedParticipantId, 
  onSelectParticipant 
}) => {
  const [activeTab, setActiveTab] = useState<'grupos' | 'knockouts'>('grupos');

  // Seleccionar por defecto al primer participante si no hay ninguno seleccionado
  useEffect(() => {
    if (!selectedParticipantId && participants.length > 0) {
      onSelectParticipant(participants[0].id);
    }
  }, [selectedParticipantId, participants, onSelectParticipant]);

  const currentParticipant = useMemo(() => {
    return participants.find(p => p.id === selectedParticipantId) || participants[0];
  }, [participants, selectedParticipantId]);

  const filteredPredictions = useMemo(() => {
    if (!currentParticipant) return [];
    return predictions.filter(p => {
      const matchParticipant = p.participantId === currentParticipant.id || p.participantName === currentParticipant.name;
      if (!matchParticipant) return false;

      if (activeTab === 'grupos') {
        return p.stage?.toLowerCase().includes('grupo') || p.group?.toLowerCase().includes('grupo');
      } else {
        return !p.stage?.toLowerCase().includes('grupo') && !p.group?.toLowerCase().includes('grupo');
      }
    });
  }, [predictions, currentParticipant, activeTab]);

  // Estadísticas del participante actual
  const stats = useMemo(() => {
    if (!currentParticipant) return { aciertos: 0, parciales: 0, errores: 0, pendientes: 0 };
    const userPreds = predictions.filter(p => p.participantId === currentParticipant.id || p.participantName === currentParticipant.name);
    
    let aciertos = 0;
    let parciales = 0;
    let errores = 0;
    let pendientes = 0;

    userPreds.forEach(p => {
      if (p.status === 'acierto') aciertos++;
      else if (p.status === 'parcial') parciales++;
      else if (p.status === 'error') errores++;
      else pendientes++;
    });

    return { aciertos, parciales, errores, pendientes };
  }, [predictions, currentParticipant]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'acierto':
        return {
          bg: 'bg-pitch-green/20 border-pitch-green/40 text-pitch-green-light',
          icon: CheckCircle2,
          label: 'Acierto Exacto',
          color: 'text-pitch-green-light'
        };
      case 'parcial':
        return {
          bg: 'bg-gold/20 border-gold/40 text-gold',
          icon: AlertCircle,
          label: 'Acierto Parcial',
          color: 'text-gold'
        };
      case 'error':
        return {
          bg: 'bg-alert-orange-red/20 border-alert-orange-red/40 text-alert-orange-light',
          icon: XCircle,
          label: 'Sin Puntos',
          color: 'text-alert-orange-light'
        };
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-400',
          icon: Clock,
          label: 'Pendiente',
          color: 'text-slate-400'
        };
    }
  };

  return (
    <div className="space-y-6 mb-8 z-10 relative">
      
      {/* Selector de Participante y Resumen */}
      <div className="glass-panel p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Izquierda: Selector */}
        <div className="w-full lg:w-1/3 space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-pitch-green" />
            <span>Seleccionar Participante:</span>
          </label>
          <select
            value={currentParticipant?.id || ''}
            onChange={(e) => onSelectParticipant(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-white font-bold font-['Outfit'] focus:outline-none focus:border-pitch-green shadow-inner cursor-pointer"
          >
            {participants.map(p => (
              <option key={p.id} value={p.id}>
                {p.rank}. {p.name} ({p.totalPoints} pts)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 font-light pl-1">
            Revisa el desglose de pronósticos y compara con los resultados reales.
          </p>
        </div>

        {/* Derecha: Tarjetas de Estadísticas del Participante */}
        <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Aciertos Exactos</span>
            <span className="text-2xl font-black text-pitch-green-light font-['Outfit']">{stats.aciertos}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Aciertos Parciales</span>
            <span className="text-2xl font-black text-gold font-['Outfit']">{stats.parciales}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Desaciertos</span>
            <span className="text-2xl font-black text-alert-orange-light font-['Outfit']">{stats.errores}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Por Disputar</span>
            <span className="text-2xl font-black text-slate-300 font-['Outfit']">{stats.pendientes}</span>
          </div>
        </div>

      </div>

      {/* Pestañas y Lista de Pronósticos */}
      <div className="glass-panel p-6 md:p-8">
        
        {/* Pestañas de Fase */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-6 flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-gold" />
            <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
              Desglose de Predicciones
            </h3>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/80 shadow-inner w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('grupos')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'grupos' ? 'bg-pitch-green text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fase de Grupos
            </button>
            <button
              onClick={() => setActiveTab('knockouts')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'knockouts' ? 'bg-pitch-green text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              Eliminatorias (Knockouts)
            </button>
          </div>
        </div>

        {/* Rejilla de Pronósticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredPredictions.map((pred, index) => {
              const cfg = getStatusConfig(pred.status);
              const IconComponent = cfg.icon;

              return (
                <motion.div
                  key={pred.id || index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Borde superior de color según estado */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${cfg.bg}`} />

                  {/* Cabecera del Pronóstico: Grupo/Fase y Badge */}
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold uppercase tracking-wider text-[10px]">
                        {pred.stage} {pred.group ? `• ${pred.group}` : ''}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${cfg.bg}`}>
                      <IconComponent className="w-3 h-3" />
                      <span>{cfg.label}</span>
                    </span>
                  </div>

                  {/* Comparativa: Pronóstico vs Real */}
                  <div className="space-y-3 my-2">
                    
                    {/* Fila 1: El Pronóstico del Usuario */}
                    <div className="bg-elegant-black/80 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Pronóstico:</span>
                      <div className="flex items-center space-x-3 font-['Outfit'] font-bold text-sm">
                        <span className="text-white truncate max-w-[80px] text-right">{pred.homeTeam}</span>
                        <div className="px-3 py-1 bg-slate-800 rounded-lg text-white border border-slate-700 flex items-center space-x-1.5">
                          <span>{pred.predictedHomeScore}</span>
                          <span className="text-slate-500">-</span>
                          <span>{pred.predictedAwayScore}</span>
                        </div>
                        <span className="text-white truncate max-w-[80px] text-left">{pred.awayTeam}</span>
                      </div>
                    </div>

                    {/* Fila 2: El Resultado Real */}
                    <div className="bg-elegant-black/40 rounded-xl p-3 border border-slate-800/60 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Resultado Real:</span>
                      <div className="flex items-center space-x-3 font-['Outfit'] font-bold text-sm text-slate-300">
                        <span className="truncate max-w-[80px] text-right">{pred.homeTeam}</span>
                        <div className="px-3 py-1 bg-slate-900 rounded-lg text-slate-300 border border-slate-800 flex items-center space-x-1.5">
                          <span>{pred.actualHomeScore !== undefined ? pred.actualHomeScore : '-'}</span>
                          <span className="text-slate-600">-</span>
                          <span>{pred.actualAwayScore !== undefined ? pred.actualAwayScore : '-'}</span>
                        </div>
                        <span className="truncate max-w-[80px] text-left">{pred.awayTeam}</span>
                      </div>
                    </div>

                  </div>

                  {/* Pie: Puntos Obtenidos */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-light">Puntos Obtenidos:</span>
                    <span className={`font-black font-['Outfit'] text-base ${cfg.color}`}>
                      +{pred.pointsEarned} <span className="text-xs font-normal text-slate-500">pts</span>
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredPredictions.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm font-light border border-dashed border-slate-800 rounded-2xl mt-4">
            No se encontraron pronósticos para este participante en la fase seleccionada.
          </div>
        )}
      </div>

    </div>
  );
};
