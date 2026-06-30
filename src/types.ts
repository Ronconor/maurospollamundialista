export type PaymentStatus = 'pagado' | 'pendiente' | 'sin_informacion';

export type PredictionStatus = 'acierto' | 'error' | 'parcial' | 'pendiente';

export type MatchStatus = 'finalizado' | 'en_juego' | 'pendiente';

export interface Participant {
  id: string;
  name: string;
  totalPoints: number;
  groupsPoints: number;
  knockoutsPoints: number;
  rondaPoints?: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  currency: string;
  diffToLeader: number;
  rank: number;
}

export interface Prediction {
  id: string;
  participantId: string;
  participantName: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  predictedHomeScore: number;
  predictedAwayScore: number;
  actualHomeScore?: number;
  actualAwayScore?: number;
  pointsEarned: number;
  status: PredictionStatus;
  stage: string;
  group?: string;
}

export interface MatchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  winner?: string;
  group: string;
  stage: string;
  date: string;
  status: MatchStatus;
}

export interface Payment {
  id: string;
  participantName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date?: string;
  notes?: string;
}

export interface CurrencySummary {
  currency: string;
  totalCollected: number;
  totalPending: number;
  paidCount: number;
  pendingCount: number;
}

export interface SummaryStats {
  totalParticipants: number;
  totalCollected: number;
  paidCount: number;
  pendingCount: number;
  totalPoints: number;
  avgPoints: number;
  leaderName: string;
  lastPlaceName: string;
  diffFirstSecond: number;
  paidPercentage: number;
  currencySummaries: CurrencySummary[];
}

export interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'warning' | 'info' | 'neutral';
  category: 'liderazgo' | 'pagos' | 'competencia' | 'general';
}

export interface ChartDataPoint {
  name: string;
  puntos: number;
  grupos: number;
  knockouts: number;
}

export interface RondaPrediction {
  teamName: string;
  pointsValue: number;
  isCorrect: boolean;
  isPending: boolean;
}

export interface ParticipantRondaStats {
  participantId: string;
  participantName: string;
  aciertos: {
    dieciseisavos: number;
    octavos: number;
    cuartos: number;
    semis: number;
    final: number;
    total: number;
  };
  points: {
    dieciseisavos: number;
    octavos: number;
    cuartos: number;
    semis: number;
    final: number;
    total: number;
  };
  predictions: {
    dieciseisavos: RondaPrediction[];
    octavos: RondaPrediction[];
    cuartos: RondaPrediction[];
    semis: RondaPrediction[];
    final: RondaPrediction[];
  };
}

export interface EquiposRondaData {
  participantsStats: ParticipantRondaStats[];
  correctTeams: {
    dieciseisavos: string[];
    octavos: string[];
    cuartos: string[];
    semis: string[];
    final: string[];
  };
  isConfirmed: {
    dieciseisavos: boolean;
    octavos: boolean;
    cuartos: boolean;
    semis: boolean;
    final: boolean;
  };
}

export interface PollaData {
  participants: Participant[];
  predictions: Prediction[];
  matches: MatchResult[];
  payments: Payment[];
  summary: SummaryStats;
  insights: Insight[];
  lastUpdated: string;
  isDemo: boolean;
  sourceFileName?: string;
  equiposRonda?: EquiposRondaData;
}
