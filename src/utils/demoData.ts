import { Participant, Prediction, MatchResult, Payment } from '../types';

export const demoParticipants: Omit<Participant, 'rank' | 'diffToLeader'>[] = [
  { id: '1', name: 'Mauro Gómez (Admin)', totalPoints: 142, groupsPoints: 95, knockoutsPoints: 47, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '2', name: 'Carlos Valderrama', totalPoints: 138, groupsPoints: 90, knockoutsPoints: 48, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '3', name: 'Radamel Falcao', totalPoints: 135, groupsPoints: 88, knockoutsPoints: 47, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '4', name: 'James Rodríguez', totalPoints: 130, groupsPoints: 85, knockoutsPoints: 45, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '5', name: 'Lionel Messi', totalPoints: 128, groupsPoints: 80, knockoutsPoints: 48, paymentStatus: 'pagado', amountPaid: 15, currency: 'USD' },
  { id: '6', name: 'Kylian Mbappé', totalPoints: 125, groupsPoints: 85, knockoutsPoints: 40, paymentStatus: 'pendiente', amountPaid: 0, currency: 'EUR' },
  { id: '7', name: 'Vinicius Junior', totalPoints: 122, groupsPoints: 82, knockoutsPoints: 40, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '8', name: 'Luis Díaz', totalPoints: 119, groupsPoints: 79, knockoutsPoints: 40, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '9', name: 'Erling Haaland', totalPoints: 115, groupsPoints: 75, knockoutsPoints: 40, paymentStatus: 'pendiente', amountPaid: 0, currency: 'EUR' },
  { id: '10', name: 'Jude Bellingham', totalPoints: 112, groupsPoints: 72, knockoutsPoints: 40, paymentStatus: 'pagado', amountPaid: 15, currency: 'USD' },
  { id: '11', name: 'Luka Modric', totalPoints: 110, groupsPoints: 70, knockoutsPoints: 40, paymentStatus: 'pagado', amountPaid: 15, currency: 'EUR' },
  { id: '12', name: 'Kevin De Bruyne', totalPoints: 108, groupsPoints: 68, knockoutsPoints: 40, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '13', name: 'Harry Kane', totalPoints: 105, groupsPoints: 65, knockoutsPoints: 40, paymentStatus: 'pendiente', amountPaid: 0, currency: 'USD' },
  { id: '14', name: 'Antoine Griezmann', totalPoints: 102, groupsPoints: 62, knockoutsPoints: 40, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '15', name: 'Federico Valverde', totalPoints: 99, groupsPoints: 60, knockoutsPoints: 39, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '16', name: 'Alisson Becker', totalPoints: 96, groupsPoints: 58, knockoutsPoints: 38, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '17', name: 'Emiliano Martínez', totalPoints: 94, groupsPoints: 56, knockoutsPoints: 38, paymentStatus: 'pendiente', amountPaid: 0, currency: 'USD' },
  { id: '18', name: 'Bernardo Silva', totalPoints: 91, groupsPoints: 55, knockoutsPoints: 36, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '19', name: 'Rodri Hernández', totalPoints: 88, groupsPoints: 52, knockoutsPoints: 36, paymentStatus: 'pagado', amountPaid: 15, currency: 'EUR' },
  { id: '20', name: 'Jamal Musiala', totalPoints: 85, groupsPoints: 50, knockoutsPoints: 35, paymentStatus: 'pendiente', amountPaid: 0, currency: 'EUR' },
  { id: '21', name: 'Florian Wirtz', totalPoints: 82, groupsPoints: 48, knockoutsPoints: 34, paymentStatus: 'pagado', amountPaid: 50000, currency: 'COP' },
  { id: '22', name: 'Christian Pulisic', totalPoints: 79, groupsPoints: 45, knockoutsPoints: 34, paymentStatus: 'pagado', amountPaid: 15, currency: 'USD' },
  { id: '23', name: 'Alphonso Davies', totalPoints: 75, groupsPoints: 42, knockoutsPoints: 33, paymentStatus: 'sin_informacion', amountPaid: 0, currency: 'USD' },
  { id: '24', name: 'Guillermo Ochoa', totalPoints: 68, groupsPoints: 38, knockoutsPoints: 30, paymentStatus: 'pendiente', amountPaid: 0, currency: 'COP' }
];

export const demoMatches: MatchResult[] = [
  { id: 'm1', homeTeam: 'Colombia', awayTeam: 'Brasil', homeScore: 2, awayScore: 1, winner: 'Colombia', group: 'Grupo A', stage: 'Fase de Grupos', date: '2026-06-15', status: 'finalizado' },
  { id: 'm2', homeTeam: 'Argentina', awayTeam: 'España', homeScore: 3, awayScore: 2, winner: 'Argentina', group: 'Grupo B', stage: 'Fase de Grupos', date: '2026-06-16', status: 'finalizado' },
  { id: 'm3', homeTeam: 'Francia', awayTeam: 'Alemania', homeScore: 1, awayScore: 1, winner: 'Empate', group: 'Grupo C', stage: 'Fase de Grupos', date: '2026-06-17', status: 'finalizado' },
  { id: 'm4', homeTeam: 'Inglaterra', awayTeam: 'Italia', homeScore: 2, awayScore: 0, winner: 'Inglaterra', group: 'Grupo D', stage: 'Fase de Grupos', date: '2026-06-18', status: 'finalizado' },
  { id: 'm5', homeTeam: 'Uruguay', awayTeam: 'Portugal', homeScore: 2, awayScore: 2, winner: 'Empate', group: 'Grupo E', stage: 'Fase de Grupos', date: '2026-06-19', status: 'finalizado' },
  { id: 'm6', homeTeam: 'México', awayTeam: 'Estados Unidos', homeScore: 1, awayScore: 2, winner: 'Estados Unidos', group: 'Grupo F', stage: 'Fase de Grupos', date: '2026-06-20', status: 'finalizado' },
  { id: 'm7', homeTeam: 'Colombia', awayTeam: 'Uruguay', homeScore: 2, awayScore: 1, winner: 'Colombia', group: 'Octavos', stage: 'Octavos de Final', date: '2026-06-28', status: 'finalizado' },
  { id: 'm8', homeTeam: 'Argentina', awayTeam: 'Inglaterra', homeScore: 2, awayScore: 1, winner: 'Argentina', group: 'Octavos', stage: 'Octavos de Final', date: '2026-06-29', status: 'finalizado' },
  { id: 'm9', homeTeam: 'Brasil', awayTeam: 'Francia', homeScore: 0, awayScore: 1, winner: 'Francia', group: 'Octavos', stage: 'Octavos de Final', date: '2026-06-30', status: 'finalizado' },
  { id: 'm10', homeTeam: 'Colombia', awayTeam: 'Francia', homeScore: 2, awayScore: 2, winner: 'Empate', group: 'Cuartos', stage: 'Cuartos de Final', date: '2026-07-04', status: 'en_juego' },
  { id: 'm11', homeTeam: 'Argentina', awayTeam: 'Alemania', group: 'Cuartos', stage: 'Cuartos de Final', date: '2026-07-05', status: 'pendiente' },
  { id: 'm12', homeTeam: 'España', awayTeam: 'Portugal', group: 'Cuartos', stage: 'Cuartos de Final', date: '2026-07-06', status: 'pendiente' }
];

export const demoPredictions: Prediction[] = [
  // Mauro Gómez (1)
  { id: 'p1', participantId: '1', participantName: 'Mauro Gómez (Admin)', matchId: 'm1', homeTeam: 'Colombia', awayTeam: 'Brasil', predictedHomeScore: 2, predictedAwayScore: 1, actualHomeScore: 2, actualAwayScore: 1, pointsEarned: 5, status: 'acierto', stage: 'Fase de Grupos', group: 'Grupo A' },
  { id: 'p2', participantId: '1', participantName: 'Mauro Gómez (Admin)', matchId: 'm2', homeTeam: 'Argentina', awayTeam: 'España', predictedHomeScore: 3, predictedAwayScore: 1, actualHomeScore: 3, actualAwayScore: 2, pointsEarned: 3, status: 'parcial', stage: 'Fase de Grupos', group: 'Grupo B' },
  { id: 'p3', participantId: '1', participantName: 'Mauro Gómez (Admin)', matchId: 'm3', homeTeam: 'Francia', awayTeam: 'Alemania', predictedHomeScore: 2, predictedAwayScore: 0, actualHomeScore: 1, actualAwayScore: 1, pointsEarned: 0, status: 'error', stage: 'Fase de Grupos', group: 'Grupo C' },
  { id: 'p4', participantId: '1', participantName: 'Mauro Gómez (Admin)', matchId: 'm4', homeTeam: 'Inglaterra', awayTeam: 'Italia', predictedHomeScore: 2, predictedAwayScore: 0, actualHomeScore: 2, actualAwayScore: 0, pointsEarned: 5, status: 'acierto', stage: 'Fase de Grupos', group: 'Grupo D' },
  { id: 'p5', participantId: '1', participantName: 'Mauro Gómez (Admin)', matchId: 'm10', homeTeam: 'Colombia', awayTeam: 'Francia', predictedHomeScore: 2, predictedAwayScore: 1, actualHomeScore: 2, actualAwayScore: 2, pointsEarned: 0, status: 'pendiente', stage: 'Cuartos de Final', group: 'Cuartos' },
  
  // Carlos Valderrama (2)
  { id: 'p6', participantId: '2', participantName: 'Carlos Valderrama', matchId: 'm1', homeTeam: 'Colombia', awayTeam: 'Brasil', predictedHomeScore: 1, predictedAwayScore: 0, actualHomeScore: 2, actualAwayScore: 1, pointsEarned: 3, status: 'parcial', stage: 'Fase de Grupos', group: 'Grupo A' },
  { id: 'p7', participantId: '2', participantName: 'Carlos Valderrama', matchId: 'm2', homeTeam: 'Argentina', awayTeam: 'España', predictedHomeScore: 3, predictedAwayScore: 2, actualHomeScore: 3, actualAwayScore: 2, pointsEarned: 5, status: 'acierto', stage: 'Fase de Grupos', group: 'Grupo B' },
  { id: 'p8', participantId: '2', participantName: 'Carlos Valderrama', matchId: 'm3', homeTeam: 'Francia', awayTeam: 'Alemania', predictedHomeScore: 1, predictedAwayScore: 1, actualHomeScore: 1, actualAwayScore: 1, pointsEarned: 5, status: 'acierto', stage: 'Fase de Grupos', group: 'Grupo C' },
  { id: 'p9', participantId: '2', participantName: 'Carlos Valderrama', matchId: 'm4', homeTeam: 'Inglaterra', awayTeam: 'Italia', predictedHomeScore: 1, predictedAwayScore: 1, actualHomeScore: 2, actualAwayScore: 0, pointsEarned: 0, status: 'error', stage: 'Fase de Grupos', group: 'Grupo D' },
  
  // Radamel Falcao (3)
  { id: 'p10', participantId: '3', participantName: 'Radamel Falcao', matchId: 'm1', homeTeam: 'Colombia', awayTeam: 'Brasil', predictedHomeScore: 2, predictedAwayScore: 1, actualHomeScore: 2, actualAwayScore: 1, pointsEarned: 5, status: 'acierto', stage: 'Fase de Grupos', group: 'Grupo A' },
  { id: 'p11', participantId: '3', participantName: 'Radamel Falcao', matchId: 'm2', homeTeam: 'Argentina', awayTeam: 'España', predictedHomeScore: 2, predictedAwayScore: 2, actualHomeScore: 3, actualAwayScore: 2, pointsEarned: 0, status: 'error', stage: 'Fase de Grupos', group: 'Grupo B' },
  { id: 'p12', participantId: '3', participantName: 'Radamel Falcao', matchId: 'm3', homeTeam: 'Francia', awayTeam: 'Alemania', predictedHomeScore: 2, predictedAwayScore: 1, actualHomeScore: 1, actualAwayScore: 1, pointsEarned: 0, status: 'error', stage: 'Fase de Grupos', group: 'Grupo C' }
];

export const demoPayments: Payment[] = [
  { id: 'pay1', participantName: 'Mauro Gómez (Admin)', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-01', notes: 'Transferencia Bancolombia' },
  { id: 'pay2', participantName: 'Carlos Valderrama', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-02', notes: 'Efectivo' },
  { id: 'pay3', participantName: 'Radamel Falcao', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-03', notes: 'Nequi' },
  { id: 'pay4', participantName: 'James Rodríguez', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-04', notes: 'DaviPlata' },
  { id: 'pay5', participantName: 'Lionel Messi', amount: 15, currency: 'USD', status: 'pagado', date: '2026-05-05', notes: 'PayPal' },
  { id: 'pay6', participantName: 'Kylian Mbappé', amount: 15, currency: 'EUR', status: 'pendiente', date: '2026-05-06', notes: 'Prometió pagar el viernes' },
  { id: 'pay7', participantName: 'Vinicius Junior', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-07', notes: 'Nequi' },
  { id: 'pay8', participantName: 'Luis Díaz', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-08', notes: 'Transferencia' },
  { id: 'pay9', participantName: 'Erling Haaland', amount: 15, currency: 'EUR', status: 'pendiente', date: '2026-05-09', notes: 'Pendiente de confirmación' },
  { id: 'pay10', participantName: 'Jude Bellingham', amount: 15, currency: 'USD', status: 'pagado', date: '2026-05-10', notes: 'Zelle' },
  { id: 'pay11', participantName: 'Luka Modric', amount: 15, currency: 'EUR', status: 'pagado', date: '2026-05-11', notes: 'Revolut' },
  { id: 'pay12', participantName: 'Kevin De Bruyne', amount: 50000, currency: 'COP', status: 'pagado', date: '2026-05-12', notes: 'Efectivo' },
  { id: 'pay13', participantName: 'Harry Kane', amount: 15, currency: 'USD', status: 'pendiente', date: '2026-05-13', notes: 'Falta verificar pago' },
  { id: 'pay14', participantName: 'Alphonso Davies', amount: 15, currency: 'USD', status: 'sin_informacion', notes: 'No ha reportado' },
  { id: 'pay15', participantName: 'Guillermo Ochoa', amount: 50000, currency: 'COP', status: 'pendiente', notes: 'Paga en la segunda fecha' }
];
