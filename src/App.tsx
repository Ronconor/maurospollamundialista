import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FootballBackground } from './components/FootballBackground';
import { Dashboard } from './components/Dashboard';
import { PollaData } from './types';
import { calculatePollaData } from './utils/dataCalculations';
import { parseExcelBuffer, parseExcelFile } from './utils/excelParser';
import { RefreshCw, AlertCircle, FileSpreadsheet } from 'lucide-react';

const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv9cH6Wgj83GC3pPF4UgmJGPC6IjKCTIEoQTiz4QOqdcMXCryv3MCLMCXY7fS6C40bC5ZBi3nuL46a/pub?output=xlsx';

export const App: React.FC = () => {
  const [pollaData, setPollaData] = useState<PollaData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  const logoUrl = '/logo.png';

  const fetchLiveSheet = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Agregar cache-busting usando timestamp
      const url = `${GOOGLE_SHEET_URL}&t=${Date.now()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const result = parseExcelBuffer(buffer);

      const pollaData = calculatePollaData(
        result.participants,
        result.matches,
        result.predictions,
        result.payments,
        false,
        'Google Sheet (En vivo)',
        result.equiposRonda
      );

      setPollaData(pollaData);
    } catch (err: any) {
      console.error('Error fetching live Google Sheet:', err);
      setError('No se pudieron cargar los datos en vivo del Google Sheet. Verifica tu conexión a Internet o vuelve a intentarlo.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Iniciar la carga al montar el componente
  useEffect(() => {
    fetchLiveSheet();
    
    // Temporizador para el intro animado (2.5 segundos)
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);

    return () => clearTimeout(introTimer);
  }, [fetchLiveSheet]);

  const handleReset = () => {
    // Recargar del Google Sheet al resetear
    fetchLiveSheet();
  };

  return (
    <div className="relative min-h-screen font-['Inter'] selection:bg-pitch-green selection:text-white overflow-hidden bg-elegant-black">
      {/* Fondo Inmersivo de Estadio siempre presente */}
      <FootballBackground />

      <AnimatePresence mode="wait">
        {showIntro ? (
          /* PANTALLA INTRO ANIMADA PREMIUM */
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radial-dark overflow-hidden"
          >
            {/* Brillo deportivo de fondo y círculo pulsante */}
            <div className="absolute w-[500px] h-[500px] bg-gold/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
            <div className="absolute w-[300px] h-[300px] bg-pitch-green/5 rounded-full blur-2xl pointer-events-none animate-ping" style={{ animationDuration: '4s' }} />

            {/* Logo con zoom suave y glow */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 1.05, 1], opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative mb-6"
            >
              {/* Glow circular detrás del logo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/30 to-pitch-green/30 rounded-full blur-2xl animate-pulse" />
              <img
                src={logoUrl}
                alt="Mauro's Polla Mundialista Logo"
                className="w-48 h-48 md:w-56 md:h-56 object-contain relative z-10 drop-shadow-[0_0_35px_rgba(251,191,36,0.5)]"
              />
            </motion.div>

            {/* Texto animado */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center z-10"
            >
              <h1 className="text-3xl md:text-5xl font-black text-white font-['Outfit'] tracking-tight mb-2 uppercase">
                MAURO’S <span className="text-gold text-glow-gold">POLLA MUNDIALISTA</span>
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold animate-pulse mt-3 flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-pitch-green animate-spin" />
                <span>Cargando ranking mundialista...</span>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          /* CONTENIDO PRINCIPAL */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full"
          >
            {isLoading && !pollaData ? (
              /* ESTADO CARGANDO DATOS (si el intro terminó pero el fetch no) */
              <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 border-4 border-pitch-green border-t-gold rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-1 font-['Outfit']">Cargando datos oficiales...</h2>
                <p className="text-slate-400 text-xs">Descargando información actualizada desde Google Sheets</p>
              </div>
            ) : error && !pollaData ? (
              /* PANTALLA DE ERROR CON OPCION DE MANUAL UPLOAD O RETRY */
              <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-2xl glass-panel-premium p-8 text-center border border-red-500/20">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-2xl font-black text-white font-['Outfit'] uppercase mb-2">Error de Conexión</h2>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    {error}
                  </p>
                  
                  {/* Acciones de recuperación */}
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={() => fetchLiveSheet(false)}
                      className="px-6 py-3 bg-gradient-to-r from-pitch-green-dark to-pitch-green hover:from-pitch-green hover:to-pitch-green-light text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-950" />
                      <span>Reintentar Conexión</span>
                    </button>
                    
                    {/* Botón de carga local como fallback */}
                    <div className="relative">
                      <input 
                        type="file" 
                        id="excel-fallback" 
                        accept=".xlsx,.xls,.csv" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsLoading(true);
                            setError(null);
                            try {
                              const result = await parseExcelFile(file);
                              const pollaData = calculatePollaData(
                                result.participants,
                                result.matches,
                                result.predictions,
                                result.payments,
                                false,
                                file.name,
                                result.equiposRonda
                              );
                              setPollaData(pollaData);
                            } catch (err) {
                              setError('Error al parsear el archivo local. Asegúrate de cargar un formato válido.');
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        }}
                      />
                      <button className="w-full px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-750 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs">
                        <FileSpreadsheet className="w-4 h-4 text-pitch-green-light" />
                        <span>Cargar Excel Local</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : pollaData ? (
              /* DASHBOARD MOSTRANDO LOS DATOS CARGADOS */
              <Dashboard 
                data={pollaData} 
                onReset={handleReset} 
                logoUrl={logoUrl}
                onRefresh={() => fetchLiveSheet(true)}
                isRefreshing={isRefreshing}
              />
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
