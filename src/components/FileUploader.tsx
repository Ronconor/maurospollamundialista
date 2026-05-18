import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trophy, Play, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { calculatePollaData } from '../utils/dataCalculations';
import { PollaData } from '../types';

interface FileUploaderProps {
  onDataLoaded: (data: PollaData) => void;
  onLoadDemo: () => void;
  logoUrl: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onDataLoaded, onLoadDemo, logoUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parseNotes, setParseNotes] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError('Por favor, selecciona un archivo Excel válido (.xlsx, .xls o .csv)');
      return;
    }

    setLoading(true);
    setError(null);
    setParseNotes([]);

    try {
      const result = await parseExcelFile(file);
      if (result.errors.length > 0) {
        setParseNotes(result.errors);
      }

      // Calcular PollaData
      const pollaData = calculatePollaData(
        result.participants,
        result.matches,
        result.predictions,
        result.payments,
        false,
        file.name
      );

      // Pequeño retardo para apreciar la animación de carga premium
      setTimeout(() => {
        onDataLoaded(pollaData);
        setLoading(false);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError('Ocurrió un error al procesar el archivo Excel. Asegúrate de que no esté corrupto y tenga un formato legible.');
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 z-10">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl glass-panel-premium p-8 md:p-12 text-center relative overflow-hidden"
      >
        {/* Brillo decorativo superior */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gold/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo de la polla */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8 inline-block relative"
        >
          <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl animate-pulse-slow" />
          <img 
            src={logoUrl} 
            alt="Mauro's Polla Mundialista Logo" 
            className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto relative z-10 drop-shadow-[0_10px_25px_rgba(251,191,36,0.4)]"
          />
        </motion.div>

        {/* Título y Subtítulo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-['Outfit'] mb-3">
            MAURO’S <span className="text-gold text-glow-gold">POLLA MUNDIALISTA</span> 2026
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto font-light mb-10">
            Dashboard oficial de la Polla Mundialista. Carga tu archivo Excel para generar visualizaciones automáticas, ranking en vivo y estadísticas premium.
          </p>
        </motion.div>

        {/* Zona de Carga (Drag & Drop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 relative ${
            dragOver ? 'border-gold bg-gold/10 scale-105' : 'border-slate-700 hover:border-pitch-green-light bg-slate-900/50 hover:bg-slate-900/80'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            id="excel-upload" 
            accept=".xlsx,.xls,.csv" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
            disabled={loading}
          />
          
          <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
            {loading ? (
              <div className="flex flex-col items-center space-y-4 my-6">
                <div className="w-16 h-16 border-4 border-pitch-green border-t-gold rounded-full animate-spin" />
                <p className="text-lg font-medium text-gold animate-pulse">Procesando archivo Excel e identificando hojas...</p>
                <p className="text-sm text-slate-400">Generando dashboard oficial mundialista...</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-pitch-green/20 flex items-center justify-center text-pitch-green-light shadow-green-glow group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-10 h-10" />
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-xl font-semibold text-white">
                    Arrastra tu archivo Excel aquí o <span className="text-pitch-green-light underline">explora</span>
                  </p>
                  <p className="text-sm text-slate-400">
                    Soporta formatos .xlsx, .xls o .csv (Hojas esperadas: Pronósticos, Resultados, Pagos)
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs bg-slate-800/80 text-slate-300 px-4 py-2 rounded-full border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-pitch-green" />
                  <span>Tu archivo Excel original no será modificado</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Mensaje de Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-6 p-4 bg-alert-orange-red/20 border border-alert-orange-red rounded-xl flex items-center space-x-3 text-left text-alert-orange-light"
          >
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {/* Notas del Parser (Hojas faltantes) */}
        {parseNotes.length > 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-left"
          >
            <div className="flex items-center space-x-2 text-amber-400 font-medium text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Aviso de estructura del archivo:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
              {parseNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Separador o Modo Demo */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-left sm:max-w-xs">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold" />
              ¿No tienes un Excel a la mano?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Explora la aplicación inmediatamente usando nuestros datos de demostración oficiales del Mundial 2026.
            </p>
          </div>

          <button
            onClick={onLoadDemo}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-deep-blue-light to-slate-800 hover:from-slate-700 hover:to-slate-700 text-white font-medium rounded-xl border border-slate-600 shadow-lg flex items-center justify-center space-x-2 group transition-all duration-200"
          >
            <Play className="w-4 h-4 text-pitch-green-light group-hover:scale-110 transition-transform" />
            <span>Ver Dashboard Demo</span>
          </button>
        </motion.div>

        {/* Footer del Onboarding */}
        <div className="mt-8 text-xs text-slate-500 flex items-center justify-center space-x-4">
          <span>🔒 Carga 100% segura en navegador</span>
          <span>•</span>
          <span>⚽ Plataforma Oficial 2026</span>
          <span>•</span>
          <span>⚡ Premium UI</span>
        </div>
      </motion.div>
    </div>
  );
};
