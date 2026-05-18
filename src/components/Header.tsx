import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Award, Calendar, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { Participant } from '../types';

interface HeaderProps {
  onReset: () => void;
  logoUrl: string;
  lastUpdated: string;
  isDemo: boolean;
  sourceFileName?: string;
  participants: Participant[];
}

export const Header: React.FC<HeaderProps> = ({ 
  onReset, 
  logoUrl, 
  lastUpdated, 
  isDemo, 
  sourceFileName,
  participants 
}) => {

  const handleExportCSV = () => {
    if (participants.length === 0) return;

    // Crear contenido CSV
    const headers = ['Posicion,Participante,Puntos Totales,Puntos Grupos,Puntos Knockouts,Estado Pago,Monto Pagado,Moneda,Diferencia Lider'];
    const rows = participants.map(p => 
      `${p.rank},"${p.name}",${p.totalPoints},${p.groupsPoints},${p.knockoutsPoints},${p.paymentStatus},${p.amountPaid},${p.currency},${p.diffToLeader}`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Ranking_Polla_Mundialista_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full glass-panel-premium mb-8 px-6 py-4 relative overflow-hidden z-10"
    >
      {/* Brillo decorativo superior */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-pitch-green-light to-transparent opacity-80" />
      <div className="absolute -top-24 right-10 w-72 h-48 bg-pitch-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Sección Izquierda: Logo y Títulos */}
        <div className="flex items-center space-x-5 w-full lg:w-auto justify-center lg:justify-start">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-md animate-pulse-slow" />
            <img src={logoUrl} alt="Mauro's Polla Mundialista" className="w-16 h-16 md:w-20 md:h-20 object-contain relative z-10 drop-shadow-[0_4px_10px_rgba(251,191,36,0.3)]" />
          </div>

          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-['Outfit']">
                MAURO’S <span className="text-gold text-glow-gold">POLLA MUNDIALISTA</span>
              </h1>
              {isDemo && (
                <span className="bg-alert-orange/20 border border-alert-orange text-alert-orange-light text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Modo Demo
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm text-slate-300 font-medium mt-0.5">
              Dashboard oficial de la Polla Mundialista 2026
            </p>
            {sourceFileName && !isDemo && (
              <p className="text-[11px] text-pitch-green-light mt-1 flex items-center justify-center lg:justify-start gap-1">
                <FileText className="w-3 h-3" />
                <span>Archivo activo: <strong>{sourceFileName}</strong></span>
              </p>
            )}
          </div>
        </div>

        {/* Sección Central: Marcador Deportivo Premium */}
        <div className="flex items-center space-x-4 bg-elegant-black/80 border border-slate-700/80 px-6 py-3 rounded-2xl shadow-inner">
          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="w-4 h-4 text-pitch-green" />
            <div className="text-left text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Mundial FIFA 2026</p>
              <p className="font-semibold text-white">Norteamérica (USA • MEX • CAN)</p>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-700 hidden sm:block" />

          <div className="hidden sm:flex items-center space-x-2 text-slate-300">
            <RefreshCw className="w-4 h-4 text-gold animate-spin" style={{ animationDuration: '8s' }} />
            <div className="text-left text-xs">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Última actualización</p>
              <p className="font-semibold text-slate-200">{lastUpdated}</p>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Botones de Acción */}
        <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-end">
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600/80 text-white font-medium text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 group"
          >
            <Upload className="w-4 h-4 text-pitch-green-light group-hover:-translate-y-0.5 transition-transform" />
            <span>Cargar Nuevo Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-pitch-green-dark to-pitch-green hover:from-pitch-green hover:to-pitch-green-light text-white font-semibold text-xs rounded-xl shadow-lg shadow-pitch-green/20 flex items-center justify-center space-x-2 transition-all duration-200 group"
          >
            <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
            <span>Exportar Resumen</span>
          </button>
        </div>

      </div>
    </motion.header>
  );
};
