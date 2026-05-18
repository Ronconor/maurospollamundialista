import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Trophy, Target, Dribbble, CreditCard, LineChart, Sparkles } from 'lucide-react';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { Podium } from './Podium';
import { RankingTable } from './RankingTable';
import { ChartsSection } from './ChartsSection';
import { PaymentsPanel } from './PaymentsPanel';
import { ResultsPanel } from './ResultsPanel';
import { PredictionsPanel } from './PredictionsPanel';
import { InsightsPanel } from './InsightsPanel';
import { PollaData } from '../types';

interface DashboardProps {
  data: PollaData;
  onReset: () => void;
  logoUrl: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset, logoUrl }) => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'ranking' | 'pronosticos' | 'partidos' | 'finanzas' | 'analisis'>('resumen');
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | undefined>(undefined);

  const tabs = [
    { id: 'resumen', label: 'Resumen General', icon: LayoutDashboard },
    { id: 'ranking', label: 'Ranking & Podio', icon: Trophy },
    { id: 'pronosticos', label: 'Pronósticos', icon: Target },
    { id: 'partidos', label: 'Partidos 2026', icon: Dribbble },
    { id: 'finanzas', label: 'Finanzas & Pagos', icon: CreditCard },
    { id: 'analisis', label: 'Análisis & Gráficos', icon: LineChart },
  ];

  const handleSelectParticipant = (id: string) => {
    setSelectedParticipantId(id);
    setActiveTab('pronosticos'); // Saltar a la pestaña de pronósticos automáticamente al seleccionar un participante
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen px-4 md:px-8 py-6 max-w-[1600px] mx-auto z-10 relative flex flex-col">
      
      {/* Encabezado Principal */}
      <Header 
        onReset={onReset} 
        logoUrl={logoUrl} 
        lastUpdated={data.lastUpdated} 
        isDemo={data.isDemo}
        sourceFileName={data.sourceFileName}
        participants={data.participants}
      />

      {/* Tarjetas de Resumen (Siempre visibles o en resumen principal) */}
      <SummaryCards summary={data.summary} />

      {/* Navegación por Pestañas */}
      <div className="flex items-center justify-start overflow-x-auto glass-panel p-2 mb-8 space-x-2 z-10 relative shadow-lg border border-slate-700/80">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex-shrink-0 relative group ${
                isActive ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-pitch-green-dark to-pitch-green rounded-xl z-0 shadow-green-glow"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <IconComponent className={`w-4 h-4 relative z-10 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="relative z-10 font-['Outfit']">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido Dinámico de Pestañas */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          
          {activeTab === 'resumen' && (
            <motion.div key="resumen" variants={tabContentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
              <Podium participants={data.participants} logoUrl={logoUrl} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <RankingTable participants={data.participants} onSelectParticipant={handleSelectParticipant} />
                </div>
                <div className="lg:col-span-1 space-y-8">
                  <InsightsPanel insights={data.insights.slice(0, 2)} />
                  <div className="glass-panel p-6 border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span>Atajo Rápido</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Explora el rendimiento detallado de cada jugador en la pestaña de <strong>Pronósticos</strong> o revisa el estado de recaudo en <strong>Finanzas</strong>.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setActiveTab('pronosticos')} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition-colors">
                        Ver Pronósticos de Jugadores
                      </button>
                      <button onClick={() => setActiveTab('finanzas')} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition-colors">
                        Ver Panel de Pagos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ranking' && (
            <motion.div key="ranking" variants={tabContentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
              <Podium participants={data.participants} logoUrl={logoUrl} />
              <RankingTable participants={data.participants} onSelectParticipant={handleSelectParticipant} />
            </motion.div>
          )}

          {activeTab === 'pronosticos' && (
            <motion.div key="pronosticos" variants={tabContentVariants} initial="hidden" animate="show" exit="exit">
              <PredictionsPanel 
                predictions={data.predictions} 
                participants={data.participants} 
                selectedParticipantId={selectedParticipantId}
                onSelectParticipant={setSelectedParticipantId}
              />
            </motion.div>
          )}

          {activeTab === 'partidos' && (
            <motion.div key="partidos" variants={tabContentVariants} initial="hidden" animate="show" exit="exit">
              <ResultsPanel matches={data.matches} />
            </motion.div>
          )}

          {activeTab === 'finanzas' && (
            <motion.div key="finanzas" variants={tabContentVariants} initial="hidden" animate="show" exit="exit">
              <PaymentsPanel payments={data.payments} summary={data.summary} participants={data.participants} />
            </motion.div>
          )}

          {activeTab === 'analisis' && (
            <motion.div key="analisis" variants={tabContentVariants} initial="hidden" animate="show" exit="exit" className="space-y-8">
              <InsightsPanel insights={data.insights} />
              <ChartsSection participants={data.participants} summary={data.summary} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer del Dashboard */}
      <footer className="mt-12 py-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center space-x-3">
          <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain filter grayscale opacity-50" />
          <span>MAURO’S POLLA MUNDIALISTA 2026 • Dashboard Oficial</span>
        </div>
        <div className="flex items-center space-x-6 text-[11px]">
          <span>⚡ Desarrollado con React & Tailwind</span>
          <span>⚽ Pasión Mundialista</span>
          <span>🔒 Datos en Memoria Local</span>
        </div>
      </footer>

    </div>
  );
};
