import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, CheckCircle2, Clock, AlertCircle, Coins, Search, FileText } from 'lucide-react';
import { Payment, SummaryStats, Participant } from '../types';

interface PaymentsPanelProps {
  payments: Payment[];
  summary: SummaryStats;
  participants: Participant[];
}

export const PaymentsPanel: React.FC<PaymentsPanelProps> = ({ payments, summary, participants }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  const formatCurr = (val: number, curr: string = 'COP') => {
    return new Intl.NumberFormat(curr === 'COP' ? 'es-CO' : 'en-US', { 
      style: 'currency', 
      currency: curr, 
      maximumFractionDigits: curr === 'COP' ? 0 : 2 
    }).format(val);
  };

  // Mapear pagos con información de participantes si payments está vacío o incompleto
  const combinedData = useMemo(() => {
    // Mapa de pagos existentes
    const payMap: { [name: string]: Payment } = {};
    payments.forEach(p => { payMap[p.participantName] = p; });

    // Combinar con participantes
    return participants.map((part): Payment => {
      const existingPay = payMap[part.name];
      return existingPay || {
        id: `auto-${part.id}`,
        participantName: part.name,
        amount: part.amountPaid,
        currency: part.currency || 'COP',
        status: part.paymentStatus,
        notes: 'Estado detectado en ranking general'
      };
    }).filter((item: Payment) => {
      if (searchTerm && !item.participantName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterStatus !== 'todos' && item.status !== filterStatus) return false;
      return true;
    });
  }, [payments, participants, searchTerm, filterStatus]);

  return (
    <div className="space-y-8 mb-8 z-10 relative">
      
      {/* 1. Resumen Financiero por Monedas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.currencySummaries.map((currSum, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gold/20 text-gold rounded-xl shadow-gold-glow">
                  <Coins className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white font-['Outfit']">Bolsa {currSum.currency}</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium border border-slate-700">
                {currSum.paidCount + currSum.pendingCount} Inscritos
              </span>
            </div>

            <div className="space-y-3 my-2">
              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-pitch-green" /> Recaudo Confirmado:
                </span>
                <span className="text-lg font-black text-white font-['Outfit']">
                  {formatCurr(currSum.totalCollected, currSum.currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-alert-orange" /> Pendiente Cobro:
                </span>
                <span className="text-lg font-black text-alert-orange-light font-['Outfit']">
                  {formatCurr(currSum.totalPending, currSum.currency)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Al día: <strong>{currSum.paidCount}</strong></span>
              <span>Pendientes: <strong>{currSum.pendingCount}</strong></span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. Tabla de Estado de Pagos */}
      <div className="glass-panel p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white font-['Outfit'] tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-pitch-green" />
              <span>REGISTRO DE INSCRIPCIONES Y PAGOS</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-light">
              Control financiero de la polla mundialista. Revisa quién ya pagó y quién está pendiente.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por participante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pitch-green transition-colors shadow-inner"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-900/80 border border-slate-700/80 rounded-xl p-1 text-xs shadow-inner">
              {(['todos', 'pagado', 'pendiente', 'sin_informacion'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                    filterStatus === status ? 'bg-pitch-green text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800/80 shadow-xl bg-elegant-black/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                <th className="py-4 px-6">Participante</th>
                <th className="py-4 px-4 text-center">Monto</th>
                <th className="py-4 px-4 text-center">Moneda</th>
                <th className="py-4 px-4 text-center">Estado</th>
                <th className="py-4 px-6 hidden sm:table-cell">Observaciones / Notas</th>
              </tr>
            </thead>
            <tbody>
              {combinedData.map((item: Payment, index: number) => (
                <motion.tr
                  key={item.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-white font-['Outfit'] text-sm md:text-base">
                    {item.participantName}
                  </td>
                  <td className="py-4 px-4 text-center font-black text-white font-['Outfit'] text-sm">
                    {item.amount > 0 ? formatCurr(item.amount, item.currency) : '—'}
                  </td>
                  <td className="py-4 px-4 text-center text-xs font-semibold text-slate-300">
                    {item.currency}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.status === 'pagado' ? 'bg-pitch-green/20 text-pitch-green-light border-pitch-green/30' :
                        item.status === 'pendiente' ? 'bg-alert-orange/20 text-alert-orange-light border-alert-orange/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {item.status === 'pagado' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status === 'pendiente' && <Clock className="w-3 h-3" />}
                        {item.status === 'sin_informacion' && <AlertCircle className="w-3 h-3" />}
                        <span>{item.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell text-xs text-slate-400 font-light max-w-xs truncate">
                    {item.notes || (item.status === 'pagado' ? 'Inscripción confirmada' : 'Pendiente de verificación')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {combinedData.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm font-light">
              No se encontraron registros de pago con los filtros seleccionados.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
