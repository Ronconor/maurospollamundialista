import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FootballBackground } from './components/FootballBackground';
import { FileUploader } from './components/FileUploader';
import { Dashboard } from './components/Dashboard';
import { PollaData } from './types';
import { demoParticipants, demoMatches, demoPredictions, demoPayments } from './utils/demoData';
import { calculatePollaData } from './utils/dataCalculations';

export const App: React.FC = () => {
  const [pollaData, setPollaData] = useState<PollaData | null>(null);

  const logoUrl = '/logo.png';

  const handleLoadDemo = () => {
    const demoData = calculatePollaData(
      demoParticipants, 
      demoMatches, 
      demoPredictions, 
      demoPayments, 
      true, 
      'Datos Demo Oficiales 2026'
    );
    setPollaData(demoData);
  };

  const handleReset = () => {
    setPollaData(null);
  };

  return (
    <div className="relative min-h-screen font-['Inter'] selection:bg-pitch-green selection:text-white overflow-hidden">
      {/* Fondo Inmersivo de Estadio siempre presente */}
      <FootballBackground />

      <AnimatePresence mode="wait">
        {!pollaData ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            className="relative z-10"
          >
            <FileUploader 
              onDataLoaded={setPollaData} 
              onLoadDemo={handleLoadDemo} 
              logoUrl={logoUrl} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="relative z-10"
          >
            <Dashboard 
              data={pollaData} 
              onReset={handleReset} 
              logoUrl={logoUrl} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
