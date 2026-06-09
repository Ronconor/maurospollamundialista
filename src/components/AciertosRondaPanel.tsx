import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Award, Trophy, CheckCircle2, XCircle, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import { EquiposRondaData, ParticipantRondaStats, RondaPrediction } from '../types';

interface AciertosRondaPanelProps {
  equiposRondaData?: EquiposRondaData;
}

export const AciertosRondaPanel: React.FC<AciertosRondaPanelProps> = ({ equiposRondaData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);

  // Si no hay datos, mostrar panel de información pendiente
  if (!equiposRondaData || !equiposRondaData.participantsStats || equiposRondaData.participantsStats.length === 0) {
    return (
      <div className="glass-panel p-8 text-center border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black max-w-2xl mx-auto rounded-3xl">
        <Award className="w-16 h-16 text-slate-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">Predicciones de Equipos por Ronda</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Esta sección se habilitará una vez que los participantes comiencen a registrar sus equipos clasificados por ronda en el Google Sheet oficial.
        </p>
      </div>
    );
  }

  const { participantsStats, correctTeams, isConfirmed } = equiposRondaData;

  // Calcular total de clasificados confirmados en el torneo actualmente
  const totalConfirmedSpots = useMemo(() => {
    return (
      correctTeams.dieciseisavos.length +
      correctTeams.octavos.length +
      correctTeams.cuartos.length +
      correctTeams.semis.length +
      correctTeams.final.length
    );
  }, [correctTeams]);

  // Ordenar participantes por aciertos totales descendente, y luego por puntos totales descendente
  const sortedStats = useMemo(() => {
    return [...participantsStats].sort((a, b) => {
      if (b.aciertos.total !== a.aciertos.total) {
        return b.aciertos.total - a.aciertos.total;
      }
      return b.points.total - a.points.total;
    });
  }, [participantsStats]);

  // Asignar rangos manejando empates
  const statsWithRanks = useMemo(() => {
    let currentRank = 1;
    return sortedStats.map((item, index) => {
      if (index > 0 && item.aciertos.total < sortedStats[index - 1].aciertos.total) {
        currentRank = index + 1;
      }
      return { ...item, rank: currentRank };
    });
  }, [sortedStats]);

  // Filtrar participantes por búsqueda
  const filteredParticipants = useMemo(() => {
    return statsWithRanks.filter(p =>
      p.participantName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [statsWithRanks, searchTerm]);

  // Si no hay participante seleccionado por defecto, seleccionar al primero
  const selectedParticipant = useMemo(() => {
    const id = selectedParticipantId || (filteredParticipants[0]?.participantId);
    return participantsStats.find(p => p.participantId === id) || null;
  }, [participantsStats, selectedParticipantId, filteredParticipants]);

  // Clases CSS para medallas o badges según el rango
  const getRankBadgeStyles = (rank: number) => {
    if (rank === 1) {
      return {
        bg: 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-yellow-glow text-slate-950',
        text: 'text-gold font-bold',
        border: 'border-yellow-400/50',
        cardBg: 'bg-gradient-to-br from-yellow-500/10 to-slate-900/90 border-yellow-500/30'
      };
    }
    if (rank === 2) {
      return {
        bg: 'bg-gradient-to-r from-slate-300 to-slate-100 shadow-slate-glow text-slate-950',
        text: 'text-slate-300 font-bold',
        border: 'border-slate-300/40',
        cardBg: 'bg-gradient-to-br from-slate-300/5 to-slate-900/90 border-slate-700/50'
      };
    }
    if (rank === 3) {
      return {
        bg: 'bg-gradient-to-r from-amber-700 to-amber-600 shadow-amber-glow text-white',
        text: 'text-amber-500 font-bold',
        border: 'border-amber-700/40',
        cardBg: 'bg-gradient-to-br from-amber-700/5 to-slate-900/90 border-slate-700/40'
      };
    }
    return {
      bg: 'bg-slate-800 text-slate-300',
      text: 'text-slate-400',
      border: 'border-slate-800',
      cardBg: 'bg-slate-900/40 border-slate-800/80'
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera de Sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-wider flex items-center gap-2 font-['Outfit'] uppercase">
            <Award className="w-6 h-6 text-gold animate-pulse" />
            <span>Aciertos por Ronda (Knockouts)</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mt-1">
            Ranking especializado de equipos clasificados. Acertar equipos suma puntos directos: 
            Dieciseisavos (5 pts), Octavos (10 pts), Cuartos (15 pts), Semis (20 pts), Final (30 pts).
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar participante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-pitch-green transition-colors font-['Inter'] shadow-inner"
          />
        </div>
      </div>

      {/* Grid Principal responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Tabla de Aciertos */}
        <div className="lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="glass-panel p-4 border border-slate-800 bg-slate-900/50">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tabla de Clasificaciones</h3>
            
            <div className="space-y-3">
              {filteredParticipants.map((p) => {
                const styles = getRankBadgeStyles(p.rank);
                const isSelected = selectedParticipant?.participantId === p.participantId;
                
                // Calcular porcentaje de acierto sobre lo confirmado
                const hitPercentage = totalConfirmedSpots > 0 
                  ? Math.round((p.aciertos.total / totalConfirmedSpots) * 100)
                  : 0;

                return (
                  <motion.div
                    key={p.participantId}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelectedParticipantId(p.participantId)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col gap-2 ${
                      isSelected 
                        ? 'border-pitch-green bg-gradient-to-r from-pitch-green-dark/20 to-slate-900/90 shadow-lg' 
                        : `${styles.cardBg} hover:bg-slate-800/40`
                    }`}
                  >
                    {/* Fila Principal */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        {/* Rango */}
                        <div className={`w-7 h-7 rounded-lg font-['Outfit'] font-black text-xs flex items-center justify-center flex-shrink-0 ${styles.bg}`}>
                          {p.rank}
                        </div>
                        
                        {/* Nombre */}
                        <div>
                          <p className={`text-sm font-bold tracking-tight font-['Outfit'] ${isSelected ? 'text-pitch-green-light' : 'text-white'}`}>
                            {p.participantName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {p.aciertos.total} de {totalConfirmedSpots} confirmados acertados
                          </p>
                        </div>
                      </div>

                      {/* Badge Aciertos */}
                      <div className="text-right flex-shrink-0">
                        <div className="inline-block bg-slate-900/80 border border-slate-700/80 px-2 py-1 rounded-lg">
                          <span className="text-xs font-extrabold text-gold">{p.aciertos.total} Aciertos</span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">+{p.points.total} pts</p>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mt-1">
                      <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                        <span>Efectividad</span>
                        <span className="font-bold text-slate-300">{hitPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${hitPercentage}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${
                            p.rank === 1 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-pitch-green to-pitch-green-light'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Flechita para mobile */}
                    <ChevronRight className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 lg:hidden transition-opacity" />
                  </motion.div>
                );
              })}

              {filteredParticipants.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Ningún participante coincide con la búsqueda.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Detalle de Predicciones del Participante */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {selectedParticipant ? (
              <motion.div
                key={selectedParticipant.participantId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel p-6 md:p-8 border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black relative overflow-hidden"
              >
                {/* Detalles del participante */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 mb-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pitch-green-dark to-pitch-green flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <Trophy className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Predicciones Oficiales</p>
                      <h3 className="text-xl md:text-2xl font-black text-white font-['Outfit']">{selectedParticipant.participantName}</h3>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="bg-slate-950/80 border border-slate-850 px-4 py-2 rounded-xl text-center min-w-[80px]">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Aciertos</p>
                      <p className="text-lg font-black text-gold mt-0.5">{selectedParticipant.aciertos.total}</p>
                    </div>
                    <div className="bg-slate-950/80 border border-slate-850 px-4 py-2 rounded-xl text-center min-w-[80px]">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Puntos</p>
                      <p className="text-lg font-black text-pitch-green-light mt-0.5">+{selectedParticipant.points.total} pts</p>
                    </div>
                  </div>
                </div>

                {/* Desglose por Rondas */}
                <div className="space-y-6">
                  
                  {/* Dieciseisavos (Round of 32) */}
                  <RoundPredictionSection 
                    title="Dieciseisavos (Round of 32)" 
                    pointsText="5 pts c/u"
                    predictions={selectedParticipant.predictions.dieciseisavos} 
                    correctList={correctTeams.dieciseisavos}
                    isConfirmed={isConfirmed.dieciseisavos}
                    aciertosCount={selectedParticipant.aciertos.dieciseisavos}
                  />

                  {/* Octavos (Round of 16) */}
                  <RoundPredictionSection 
                    title="Octavos de Final" 
                    pointsText="10 pts c/u"
                    predictions={selectedParticipant.predictions.octavos} 
                    correctList={correctTeams.octavos}
                    isConfirmed={isConfirmed.octavos}
                    aciertosCount={selectedParticipant.aciertos.octavos}
                  />

                  {/* Cuartos de Final */}
                  <RoundPredictionSection 
                    title="Cuartos de Final" 
                    pointsText="15 pts c/u"
                    predictions={selectedParticipant.predictions.cuartos} 
                    correctList={correctTeams.cuartos}
                    isConfirmed={isConfirmed.cuartos}
                    aciertosCount={selectedParticipant.aciertos.cuartos}
                  />

                  {/* Semifinales */}
                  <RoundPredictionSection 
                    title="Semifinales" 
                    pointsText="20 pts c/u"
                    predictions={selectedParticipant.predictions.semis} 
                    correctList={correctTeams.semis}
                    isConfirmed={isConfirmed.semis}
                    aciertosCount={selectedParticipant.aciertos.semis}
                  />

                  {/* Final (Finalistas) */}
                  <RoundPredictionSection 
                    title="Gran Final" 
                    pointsText="30 pts c/u"
                    predictions={selectedParticipant.predictions.final} 
                    correctList={correctTeams.final}
                    isConfirmed={isConfirmed.final}
                    aciertosCount={selectedParticipant.aciertos.final}
                  />

                </div>

              </motion.div>
            ) : (
              <div className="glass-panel p-8 text-center border border-slate-800 text-slate-400">
                Selecciona un participante a la izquierda para ver el desglose de sus predicciones por ronda.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

interface RoundPredictionSectionProps {
  title: string;
  pointsText: string;
  predictions: RondaPrediction[];
  correctList: string[];
  isConfirmed: boolean;
  aciertosCount: number;
}

const RoundPredictionSection: React.FC<RoundPredictionSectionProps> = ({
  title,
  pointsText,
  predictions,
  correctList,
  isConfirmed,
  aciertosCount
}) => {
  if (predictions.length === 0) return null;

  return (
    <div className="space-y-3 bg-slate-950/45 p-4 rounded-2xl border border-slate-850/50">
      
      {/* Encabezado de la Ronda */}
      <div className="flex justify-between items-center border-b border-slate-850/40 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-extrabold text-white uppercase tracking-wider font-['Outfit']">{title}</span>
          <span className="bg-slate-850 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded-md">{pointsText}</span>
        </div>
        <div className="text-[10px] font-bold text-slate-300">
          Aciertos: <span className="text-gold font-extrabold">{aciertosCount} de {predictions.length}</span>
          {isConfirmed ? (
            <span className="text-pitch-green-light ml-2">✓ Definida</span>
          ) : (
            <span className="text-slate-400 ml-2">⏳ Parcial</span>
          )}
        </div>
      </div>

      {/* Grid de Equipos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {predictions.map((p, idx) => {
          let cardStyle = 'border-slate-800/80 bg-slate-900/30 text-slate-300';
          let statusIcon = <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />;
          
          if (p.isCorrect) {
            cardStyle = 'border-pitch-green/40 bg-pitch-green-dark/10 text-white font-semibold shadow-[0_0_8px_rgba(34,197,94,0.05)]';
            statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-pitch-green flex-shrink-0" />;
          } else if (!p.isPending) {
            // Ronda confirmada y no es correcto -> es incorrecto
            cardStyle = 'border-red-500/25 bg-red-500/5 text-slate-500 line-through opacity-70';
            statusIcon = <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />;
          }

          return (
            <div 
              key={idx}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-[11px] truncate leading-none transition-colors ${cardStyle}`}
            >
              {statusIcon}
              <span className="truncate">{p.teamName}</span>
            </div>
          );
        })}
      </div>

      {/* Mostrar equipos correctos confirmados hasta ahora (como referencia del admin) */}
      {correctList.length > 0 && (
        <div className="mt-2 text-[10px] text-slate-400 flex flex-wrap items-center gap-1 leading-relaxed">
          <span className="font-bold text-slate-300 flex-shrink-0">Equipos Confirmados:</span>
          {correctList.map((team, idx) => (
            <span key={idx} className="bg-pitch-green-dark/20 text-pitch-green-light px-1.5 py-0.5 rounded border border-pitch-green/10">
              {team}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
