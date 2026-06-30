import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, DollarSign, Target, Award, Calendar, ExternalLink } from 'lucide-react';

export const ReglasPanel: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-wider flex items-center gap-2 font-['Outfit'] uppercase">
          <BookOpen className="w-6 h-6 text-gold animate-pulse" />
          <span>Reglas & Información Oficial</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed mt-1">
          Conoce el sistema de puntuación, costos de inscripción, premios y fechas límite de la Polla Mundialista 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Columna 1: Inscripción y Premios */}
        <div className="space-y-6">
          
          {/* Card 1: Costo e Inscripción */}
          <motion.div variants={itemVariants} className="glass-panel p-6 border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-extrabold text-gold uppercase tracking-wider mb-4 flex items-center gap-2 font-['Outfit']">
              <DollarSign className="w-4 h-4" />
              <span>Inscripción y Cuentas de Pago</span>
            </h3>
            
            <div className="space-y-4 text-slate-300 text-xs">
              <div className="flex flex-col sm:flex-row justify-between gap-2 border-b border-slate-800 pb-3">
                <span className="font-semibold text-slate-400">Colombia (COP)</span>
                <span className="font-extrabold text-white text-sm">$100,000 pesos</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between gap-2 border-b border-slate-800 pb-3">
                <span className="font-semibold text-slate-400">México (MXN)</span>
                <span className="font-extrabold text-white text-sm">$500 pesos</span>
              </div>

              {/* Bancos */}
              <div className="space-y-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-850">
                <div>
                  <p className="font-bold text-pitch-green-light">Cuenta en Colombia:</p>
                  <p className="font-semibold mt-0.5 text-slate-200">Bancolombia • Ahorros: 716-294302-40</p>
                </div>
                <div>
                  <p className="font-bold text-pitch-green-light">Cuenta en México:</p>
                  <p className="font-semibold mt-0.5 text-slate-200">BBVA CLABE: 012 180 015443401800</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <p>• Consignar/transferir antes del <strong>Lunes 8 de Junio</strong>.</p>
                <p>• Enviar comprobante por WhatsApp a: <strong>(+52) 55 60 99 75 33</strong></p>
              </div>

              <a 
                href="https://chat.whatsapp.com/H97UHpANfUUEkUnzBUDO3d"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 py-3 bg-pitch-green hover:bg-pitch-green-light text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
              >
                <span>Unirse al Grupo de WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Card 2: Premios */}
          <motion.div variants={itemVariants} className="glass-panel p-6 border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black">
            <h3 className="text-sm font-extrabold text-gold uppercase tracking-wider mb-4 flex items-center gap-2 font-['Outfit']">
              <Award className="w-4 h-4" />
              <span>Bolsa de Premios</span>
            </h3>
            
            <div className="space-y-4 text-slate-300 text-xs">
              <p className="leading-relaxed">
                Se repartirá el <strong>95% de lo recaudado</strong>. El 5% restante será destinado al comité organizador por la gestión de la plataforma.
              </p>
              
              <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-3.5 rounded-xl border border-slate-850">
                <div className="text-center border-r border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">1er Lugar</p>
                  <p className="text-lg font-black text-gold mt-1">60%</p>
                </div>
                <div className="text-center border-r border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">2do Lugar</p>
                  <p className="text-lg font-black text-slate-200 mt-1">25%</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">3er Lugar</p>
                  <p className="text-lg font-black text-amber-600 mt-1">15%</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Columna 2: Sistema de Puntuación y Deadlines */}
        <div className="space-y-6">
          
          {/* Card 3: Sistema de Puntuación */}
          <motion.div variants={itemVariants} className="glass-panel p-6 border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black">
            <h3 className="text-sm font-extrabold text-gold uppercase tracking-wider mb-4 flex items-center gap-2 font-['Outfit']">
              <Target className="w-4 h-4" />
              <span>Sistema de Puntuación</span>
            </h3>

            <div className="space-y-4 text-slate-300 text-xs">
              
              {/* Puntos por partido */}
              <div className="space-y-2">
                <p className="font-extrabold text-white text-[11px] uppercase tracking-wide">1. Puntos por Partido:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-semibold">Fase</th>
                        <th className="pb-2 font-semibold text-center">Perfecto</th>
                        <th className="pb-2 font-semibold text-center">Parcial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      <tr>
                        <td className="py-2">Fase de Grupos</td>
                        <td className="py-2 text-center font-bold text-pitch-green-light">5 pts</td>
                        <td className="py-2 text-center text-slate-300">2 pts</td>
                      </tr>
                      <tr>
                        <td className="py-2">Knockouts (32avos - Cuartos)</td>
                        <td className="py-2 text-center font-bold text-pitch-green-light">10 pts</td>
                        <td className="py-2 text-center text-slate-300">4 pts</td>
                      </tr>
                      <tr>
                        <td className="py-2">Semis, 3y4 y Final</td>
                        <td className="py-2 text-center font-bold text-pitch-green-light">15 pts</td>
                        <td className="py-2 text-center text-slate-300">6 pts</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Puntos por equipos por ronda */}
              <div className="space-y-2 pt-2 border-t border-slate-850/80">
                <p className="font-extrabold text-white text-[11px] uppercase tracking-wide">2. Puntos por Equipo Clasificado:</p>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Sumarás puntos por cada equipo que clasifique a las siguientes rondas (se configuran todas antes del Lun 8 de Junio):
                </p>
                <div className="grid grid-cols-5 gap-1.5 text-center mt-1">
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <p className="text-[9px] text-slate-400 font-bold">16avos</p>
                    <p className="font-extrabold text-pitch-green-light mt-0.5">3 pts</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <p className="text-[9px] text-slate-400 font-bold">Octavos</p>
                    <p className="font-extrabold text-pitch-green-light mt-0.5">5 pts</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <p className="text-[9px] text-slate-400 font-bold">Cuartos</p>
                    <p className="font-extrabold text-pitch-green-light mt-0.5">10 pts</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <p className="text-[9px] text-slate-400 font-bold">Semis</p>
                    <p className="font-extrabold text-pitch-green-light mt-0.5">15 pts</p>
                  </div>
                  <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-850">
                    <p className="text-[9px] text-slate-400 font-bold">Final</p>
                    <p className="font-extrabold text-pitch-green-light mt-0.5">20 pts</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Card 4: Fechas Límite */}
          <motion.div variants={itemVariants} className="glass-panel p-6 border border-slate-800 bg-gradient-to-br from-slate-900/90 to-elegant-black">
            <h3 className="text-sm font-extrabold text-gold uppercase tracking-wider mb-4 flex items-center gap-2 font-['Outfit']">
              <Calendar className="w-4 h-4" />
              <span>Fechas Límite de Registro</span>
            </h3>

            <div className="space-y-3 text-slate-300 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                <span className="font-semibold text-slate-400">Grupos & Equipos por Ronda</span>
                <span className="font-bold text-red-400">Lun 8 de Junio</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                <span className="font-semibold text-slate-400">Dieciseisavos (32avos)</span>
                <span className="font-bold text-slate-200">Sáb 27 de Junio</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                <span className="font-semibold text-slate-400">Octavos de Final</span>
                <span className="font-bold text-slate-200">Vie 3 de Julio</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                <span className="font-semibold text-slate-400">Cuartos de Final</span>
                <span className="font-bold text-slate-200">Mié 8 de Julio</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-850">
                <span className="font-semibold text-slate-400">Semifinales</span>
                <span className="font-bold text-slate-200">Dom 12 de Julio</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-semibold text-slate-400">3 y 4 Lugar & Final</span>
                <span className="font-bold text-slate-200">Vie 17 de Julio</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

    </motion.div>
  );
};
