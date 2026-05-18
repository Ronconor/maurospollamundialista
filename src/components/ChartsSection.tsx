import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, Activity } from 'lucide-react';
import { Participant, SummaryStats } from '../types';

interface ChartsSectionProps {
  participants: Participant[];
  summary: SummaryStats;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ participants, summary }) => {

  // 1. Datos para gráfico de barras: Puntos por participante (Top 15 para legibilidad)
  const barData = useMemo(() => {
    return participants.slice(0, 15).map(p => ({
      name: p.name.split(' ')[0], // Primer nombre o corto
      fullName: p.name,
      Puntos: p.totalPoints,
      Grupos: p.groupsPoints,
      Knockouts: p.knockoutsPoints,
    }));
  }, [participants]);

  // 2. Datos para gráfico de torta: Pagos
  const pieData = useMemo(() => {
    return [
      { name: 'Pagados', value: summary.paidCount, color: '#10b981' }, // pitch-green
      { name: 'Pendientes', value: summary.pendingCount, color: '#f97316' }, // alert-orange
    ].filter(d => d.value > 0);
  }, [summary]);

  // 3. Datos para distribución de puntos / Curva de rendimiento
  const lineData = useMemo(() => {
    return participants.map((p, idx) => ({
      rank: `#${idx + 1}`,
      name: p.name.split(' ')[0],
      Puntos: p.totalPoints,
      Diferencia: p.diffToLeader,
    }));
  }, [participants]);

  // Custom Tooltip estilizado para Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elegant-black-card backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-glass text-xs">
          <p className="font-bold text-white mb-2 pb-1 border-b border-slate-700 font-['Outfit'] text-sm">
            {payload[0].payload.fullName || label}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-4 py-0.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-black text-white font-['Outfit']">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 mb-8 z-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 1: Puntos por Participante (Barras) */}
        <div className="lg:col-span-2 glass-panel p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-pitch-green" />
              <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
                Puntos por Participante (Top 15)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Comparativa del puntaje total acumulado por los líderes de la polla.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} angle={-30} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Puntos" fill="#10b981" radius={[8, 8, 0, 0]} barSize={28}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : index === 1 ? '#cbd5e1' : index === 2 ? '#d97706' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Estado de Pagos (Torta) */}
        <div className="glass-panel p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <PieIcon className="w-5 h-5 text-gold" />
              <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
                Estado de Pagos
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Distribución de participantes al día vs pendientes.
            </p>
          </div>

          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                  fontSize={11}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b0f19" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Centro del Pie */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white font-['Outfit']">{summary.paidPercentage}%</span>
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Pagado</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-800 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full shadow" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300 font-medium">{d.name}: <strong>{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 3: Comparativa Grupos vs Knockouts */}
        <div className="glass-panel p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
                Desglose: Grupos vs Knockouts
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Puntaje obtenido en la fase de grupos frente a las rondas eliminatorias.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData.slice(0, 10)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Grupos" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} name="Fase Grupos" />
                <Bar dataKey="Knockouts" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={20} name="Eliminatorias" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 4: Curva de Diferencia / Distribución */}
        <div className="glass-panel p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <LineIcon className="w-5 h-5 text-purple-500" />
              <h3 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
                Curva de Rendimiento General
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-light">
              Evolución del puntaje según la posición en la tabla.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="rank" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Puntos" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#0b0f19', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#fbbf24' }} name="Puntaje Total" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
