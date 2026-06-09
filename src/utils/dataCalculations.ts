import { Participant, Prediction, MatchResult, Payment, SummaryStats, Insight, PollaData, CurrencySummary, EquiposRondaData } from '../types';

export function calculatePollaData(
  rawParticipants: Omit<Participant, 'rank' | 'diffToLeader'>[],
  matches: MatchResult[],
  predictions: Prediction[],
  payments: Payment[],
  isDemo: boolean = false,
  sourceFileName?: string,
  equiposRonda?: EquiposRondaData
): PollaData {
  // Normalizar nombres y sumar puntos de Equipos por Ronda si existen
  let updatedParticipants = [...rawParticipants];
  if (equiposRonda && equiposRonda.participantsStats) {
    const statsMap = new Map(
      equiposRonda.participantsStats.map(s => [s.participantId, s])
    );
    updatedParticipants = updatedParticipants.map(p => {
      const normName = p.name.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      const stats = statsMap.get(normName);
      if (stats) {
        return {
          ...p,
          knockoutsPoints: p.knockoutsPoints + stats.points.total,
          totalPoints: p.totalPoints + stats.points.total
        };
      }
      return p;
    });
  }

  // 1. Ordenar participantes por puntaje total descendente
  const sorted = [...updatedParticipants].sort((a, b) => b.totalPoints - a.totalPoints);
  
  const maxPoints = sorted.length > 0 ? sorted[0].totalPoints : 0;
  
  // Asignar rank y diffToLeader
  const participants: Participant[] = sorted.map((p, index) => ({
    ...p,
    rank: index + 1,
    diffToLeader: maxPoints - p.totalPoints
  }));

  // 2. Cálculos de resumen
  const totalParticipants = participants.length;
  const paidParticipants = participants.filter(p => p.paymentStatus === 'pagado');
  const pendingParticipants = participants.filter(p => p.paymentStatus === 'pendiente');
  
  const paidCount = paidParticipants.length;
  const pendingCount = pendingParticipants.length;
  const paidPercentage = totalParticipants > 0 ? Math.round((paidCount / totalParticipants) * 100) : 0;

  const totalPoints = participants.reduce((sum, p) => sum + p.totalPoints, 0);
  const avgPoints = totalParticipants > 0 ? Math.round(totalPoints / totalParticipants) : 0;

  const leaderName = participants.length > 0 ? participants[0].name : 'Sin líder';
  const lastPlaceName = participants.length > 0 ? participants[participants.length - 1].name : 'Sin datos';
  const diffFirstSecond = participants.length > 1 ? participants[0].totalPoints - participants[1].totalPoints : 0;

  // 3. Resumen por monedas
  const currencyMap: { [currency: string]: CurrencySummary } = {};
  
  participants.forEach(p => {
    const curr = p.currency || 'COP';
    if (!currencyMap[curr]) {
      currencyMap[curr] = { currency: curr, totalCollected: 0, totalPending: 0, paidCount: 0, pendingCount: 0 };
    }
    if (p.paymentStatus === 'pagado') {
      currencyMap[curr].totalCollected += p.amountPaid;
      currencyMap[curr].paidCount += 1;
    } else if (p.paymentStatus === 'pendiente') {
      // Asumimos un valor pendiente igual al pagado por otros en la misma moneda si amountPaid es 0
      const defaultAmount = curr === 'COP' ? 50000 : 15;
      currencyMap[curr].totalPending += (p.amountPaid > 0 ? p.amountPaid : defaultAmount);
      currencyMap[curr].pendingCount += 1;
    }
  });

  const currencySummaries = Object.values(currencyMap);
  const totalCollectedCop = currencyMap['COP']?.totalCollected || 0;

  const summary: SummaryStats = {
    totalParticipants,
    totalCollected: totalCollectedCop, // principal en COP o la primera
    paidCount,
    pendingCount,
    totalPoints,
    avgPoints,
    leaderName,
    lastPlaceName,
    diffFirstSecond,
    paidPercentage,
    currencySummaries
  };

  // 4. Generación automática de Insights (Análisis de la Polla)
  const insights: Insight[] = [];

  // Insight de Liderazgo
  if (participants.length > 0) {
    if (diffFirstSecond > 5) {
      insights.push({
        id: 'ins-1',
        text: `¡${leaderName} está jugando como campeón del mundo! Tiene una cómoda ventaja de ${diffFirstSecond} puntos sobre el segundo lugar.`,
        type: 'positive',
        category: 'liderazgo'
      });
    } else if (diffFirstSecond > 0) {
      insights.push({
        id: 'ins-1',
        text: `¡La pelea por el podio está que arde! Apenas ${diffFirstSecond} puntos separan a ${leaderName} de su más cercano perseguidor. Nadie se puede confiar.`,
        type: 'warning',
        category: 'liderazgo'
      });
    } else {
      insights.push({
        id: 'ins-1',
        text: `¡Empate en la cima! La competencia está tan reñida que tenemos un codo a codo espectacular en el primer lugar.`,
        type: 'info',
        category: 'liderazgo'
      });
    }
  }

  // Insight de Competencia / Remontada
  if (participants.length > 5) {
    const fifthPlace = participants[4];
    const diffToThird = participants[2]?.totalPoints - fifthPlace.totalPoints;
    if (diffToThird <= 10) {
      insights.push({
        id: 'ins-2',
        text: `¡Ojo con la zona de remontada! Desde el 4º hasta el 8º puesto están sumando fuerte y amenazan con asaltar el podio en la próxima fecha.`,
        type: 'info',
        category: 'competencia'
      });
    }
  }

  // Insight de Pagos
  if (pendingCount > 0) {
    insights.push({
      id: 'ins-3',
      text: `El recaudo va a buen ritmo (${paidPercentage}% pagado), pero aún tenemos ${pendingCount} participante(s) en tarjeta amarilla pendientes de pago. ¡A ponerse al día!`,
      type: 'warning',
      category: 'pagos'
    });
  } else if (totalParticipants > 0 && paidPercentage === 100) {
    insights.push({
      id: 'ins-3',
      text: `¡Excelente gestión financiera! El 100% de los participantes ha pagado su inscripción. La bolsa de premios está completamente asegurada.`,
      type: 'positive',
      category: 'pagos'
    });
  }

  // Insight General / Promedio
  insights.push({
    id: 'ins-4',
    text: `El rendimiento global muestra un promedio de ${avgPoints} puntos por participante. La fase de grupos está marcando la gran diferencia en las tablas.`,
    type: 'neutral',
    category: 'general'
  });

  return {
    participants,
    predictions,
    matches,
    payments,
    summary,
    insights,
    lastUpdated: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    isDemo,
    sourceFileName,
    equiposRonda
  };
}
