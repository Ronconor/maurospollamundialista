import { read, utils } from 'xlsx';
import { Participant, Prediction, MatchResult, Payment, PaymentStatus, PredictionStatus, MatchStatus, EquiposRondaData, RondaPrediction, ParticipantRondaStats } from '../types';

export interface ParseResult {
  participants: Omit<Participant, 'rank' | 'diffToLeader'>[];
  predictions: Prediction[];
  matches: MatchResult[];
  payments: Payment[];
  errors: string[];
  equiposRonda?: EquiposRondaData;
}

// Función auxiliar para normalizar texto (sin tildes, minúsculas, sin espacios extra)
function normalizeString(str: string): string {
  if (!str) return '';
  return str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// Buscar hoja por nombre aproximado
function findSheetName(sheetNames: string[], possibleNames: string[]): string | undefined {
  const normNames = sheetNames.map(normalizeString);
  for (const possible of possibleNames) {
    const normPossible = normalizeString(possible);
    const index = normNames.findIndex(n => n.includes(normPossible) || normPossible.includes(n));
    if (index !== -1) return sheetNames[index];
  }
  return undefined;
}

// Convertir número de serie de fecha Excel a string YYYY-MM-DD
function excelDateToJSDate(serial: any, defaultDate: string): string {
  if (typeof serial === 'number') {
    // Excel date serial number (e.g., 45454)
    const date = new Date((serial - 25569) * 86400 * 1000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof serial === 'string' && serial.trim() !== '') {
    return serial.trim();
  }
  return defaultDate;
}

export function parseEquiposRonda(workbook: any): EquiposRondaData | undefined {
  const sheetNames = workbook.SheetNames;
  const sheetName = findSheetName(sheetNames, ['equipos por ronda', 'rondas', 'clasificados ronda']);
  if (!sheetName) return undefined;

  const sheet = workbook.Sheets[sheetName];
  const rows: any[][] = utils.sheet_to_json(sheet, { header: 1 });
  if (rows.length < 5) return undefined;

  // 1. Identificar participantes en Fila 2 (índice 1) empezando en Columna 5 (F)
  const participantsList: { name: string; colIndex: number }[] = [];
  const nameRow = rows[1] || [];
  for (let c = 5; c < nameRow.length; c += 3) {
    const name = nameRow[c];
    if (name && typeof name === 'string' && name.trim() !== '' && !name.includes('#REF!')) {
      participantsList.push({ name: name.trim(), colIndex: c });
    }
  }

  // 2. Extraer equipos reales de la Columna C (índice 2)
  const getCorrectTeams = (startRow: number, endRow: number): string[] => {
    const teams: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      const row = rows[r];
      if (row) {
        const team = row[2];
        if (team && typeof team === 'string' && team.trim() !== '') {
          teams.push(team.trim());
        }
      }
    }
    return teams;
  };

  const correctDieciseisavos = getCorrectTeams(5, 36);
  const correctOctavos = getCorrectTeams(40, 55);
  const correctCuartos = getCorrectTeams(59, 66);
  const correctSemis = getCorrectTeams(70, 73);
  const correctFinal = getCorrectTeams(77, 78);

  const isConfirmedDieciseisavos = correctDieciseisavos.length === 32;
  const isConfirmedOctavos = correctOctavos.length === 16;
  const isConfirmedCuartos = correctCuartos.length === 8;
  const isConfirmedSemis = correctSemis.length === 4;
  const isConfirmedFinal = correctFinal.length === 2;

  // 3. Helper para extraer predicciones de un participante
  const getParticipantPredictions = (
    colIndex: number,
    startRow: number,
    endRow: number,
    correctList: string[],
    isRoundConfirmed: boolean,
    pointsValue: number
  ): { predictions: RondaPrediction[]; aciertos: number; points: number } => {
    const predictions: RondaPrediction[] = [];
    let aciertos = 0;
    const normCorrect = new Set(correctList.map(t => normalizeString(t)));

    for (let r = startRow; r <= endRow; r++) {
      const row = rows[r];
      if (row) {
        const teamVal = row[colIndex];
        if (teamVal && typeof teamVal === 'string' && teamVal.trim() !== '') {
          const teamName = teamVal.trim();
          const normTeam = normalizeString(teamName);
          const isCorrect = normCorrect.has(normTeam);
          const isPending = !isCorrect && !isRoundConfirmed;
          
          if (isCorrect) {
            aciertos++;
          }

          predictions.push({
            teamName,
            pointsValue,
            isCorrect,
            isPending
          });
        }
      }
    }

    return {
      predictions,
      aciertos,
      points: aciertos * pointsValue
    };
  };

  // 4. Calcular estadísticas para cada participante
  const participantsStats: ParticipantRondaStats[] = participantsList.map(p => {
    const dieciseisavos = getParticipantPredictions(p.colIndex, 5, 36, correctDieciseisavos, isConfirmedDieciseisavos, 5);
    const octavos = getParticipantPredictions(p.colIndex, 40, 55, correctOctavos, isConfirmedOctavos, 10);
    const cuartos = getParticipantPredictions(p.colIndex, 59, 66, correctCuartos, isConfirmedCuartos, 15);
    const semis = getParticipantPredictions(p.colIndex, 70, 73, correctSemis, isConfirmedSemis, 20);
    const final = getParticipantPredictions(p.colIndex, 77, 78, correctFinal, isConfirmedFinal, 30);

    const totalAciertos = dieciseisavos.aciertos + octavos.aciertos + cuartos.aciertos + semis.aciertos + final.aciertos;
    const totalPoints = dieciseisavos.points + octavos.points + cuartos.points + semis.points + final.points;

    return {
      participantId: normalizeString(p.name),
      participantName: p.name,
      aciertos: {
        dieciseisavos: dieciseisavos.aciertos,
        octavos: octavos.aciertos,
        cuartos: cuartos.aciertos,
        semis: semis.aciertos,
        final: final.aciertos,
        total: totalAciertos
      },
      points: {
        dieciseisavos: dieciseisavos.points,
        octavos: octavos.points,
        cuartos: cuartos.points,
        semis: semis.points,
        final: final.points,
        total: totalPoints
      },
      predictions: {
        dieciseisavos: dieciseisavos.predictions,
        octavos: octavos.predictions,
        cuartos: cuartos.predictions,
        semis: semis.predictions,
        final: final.predictions
      }
    };
  });

  return {
    participantsStats,
    correctTeams: {
      dieciseisavos: correctDieciseisavos,
      octavos: correctOctavos,
      cuartos: correctCuartos,
      semis: correctSemis,
      final: correctFinal
    },
    isConfirmed: {
      dieciseisavos: isConfirmedDieciseisavos,
      octavos: isConfirmedOctavos,
      cuartos: isConfirmedCuartos,
      semis: isConfirmedSemis,
      final: isConfirmedFinal
    }
  };
}

export function parseExcelBuffer(buffer: ArrayBuffer): ParseResult {
  const errors: string[] = [];
  const workbook = read(new Uint8Array(buffer), { type: 'array', cellDates: true });

  const sheetNames = workbook.SheetNames;

  // Identificar hojas
  const gruposSheetName = findSheetName(sheetNames, ['pronosticos grupos', 'grupos', 'fase grupos', 'pronosticos']);
  const knockoutsSheetName = findSheetName(sheetNames, ['pronosticos knockouts', 'knockouts', 'octavos', 'eliminatorias', 'fase final']);
  const resultadosSheetName = findSheetName(sheetNames, ['resultados', 'partidos', 'fixture', 'marcador']);
  const pagosSheetName = findSheetName(sheetNames, ['pagos', 'finanzas', 'recaudo', 'inscripciones', 'estado pagos']);
  const rankingSheetName = findSheetName(sheetNames, ['participantes', 'ranking', 'posiciones', 'tabla general', 'resumen', 'general']);

  if (!gruposSheetName) errors.push('No se detectó una hoja clara para "Pronósticos Grupos". Se intentará leer de la primera hoja.');
  if (!resultadosSheetName) errors.push('No se detectó la hoja de "Resultados" estándar. Se usarán las celdas de marcador real de las hojas de pronósticos.');
  if (!pagosSheetName) errors.push('No se detectó la hoja de "Pagos". Se generarán estados de pago automáticos.');

  let rawPredictions: Prediction[] = [];
  let rawMatches: MatchResult[] = [];
  let rawPayments: Payment[] = [];
  let rawParticipantsMap: { [name: string]: Omit<Participant, 'rank' | 'diffToLeader'> } = {};

  // --- 1. LEER PRONÓSTICOS GRUPOS ---
  const sheetGrupos = gruposSheetName ? workbook.Sheets[gruposSheetName] : workbook.Sheets[sheetNames[0]];
  if (sheetGrupos) {
    const rows: any[][] = utils.sheet_to_json(sheetGrupos, { header: 1 });
    
    // Verificar si es la estructura matricial de Mauro (Fila 4 tiene los equipos como Mx, Sud, Corea)
    const isMauroMatrix = rows[3] && (rows[3][3] === 'Mx' || rows[3][3] === 'Mex' || rows[3][3]?.toString().toLowerCase().includes('mx'));

    if (isMauroMatrix) {
      const teamsRow = rows[3]; // Fila 4 (índice 3): Equipos
      const dateRow = rows[2];  // Fila 3 (índice 2): Fechas
      const realRow = rows[5];  // Fila 6 (índice 5): Marcador Real (x o números)

      // Procesar los 72 partidos de fase de grupos
      for (let m = 0; m < 72; m++) {
        const homeCol = 3 + m * 3;
        const awayCol = homeCol + 1;
        const homeTeam = teamsRow[homeCol];
        const awayTeam = teamsRow[awayCol];

        if (homeTeam && awayTeam) {
          const matchId = `g-${m}-${normalizeString(homeTeam)}-${normalizeString(awayTeam)}`;
          const dateStr = excelDateToJSDate(dateRow ? dateRow[homeCol] : null, '2026-06-11');
          
          let actHomeScore: number | undefined = undefined;
          let actAwayScore: number | undefined = undefined;
          let matchStatus: MatchStatus = 'pendiente';
          let winner: string | undefined = undefined;

          if (realRow && realRow[homeCol] !== undefined && realRow[homeCol] !== '' && realRow[homeCol] !== 'x' &&
              realRow[awayCol] !== undefined && realRow[awayCol] !== '' && realRow[awayCol] !== 'x') {
            actHomeScore = parseInt(realRow[homeCol]);
            actAwayScore = parseInt(realRow[awayCol]);
            if (!isNaN(actHomeScore) && !isNaN(actAwayScore)) {
              matchStatus = 'finalizado';
              winner = actHomeScore > actAwayScore ? homeTeam : actHomeScore < actAwayScore ? awayTeam : 'Empate';
            } else {
              actHomeScore = undefined;
              actAwayScore = undefined;
            }
          }

          // Asignar grupo aproximado según el número de partido (6 partidos por grupo en 12 grupos A-L)
          const groupChar = String.fromCharCode(65 + Math.floor(m / 6));
          const groupName = `Grupo ${groupChar}`;

          rawMatches.push({
            id: matchId,
            homeTeam,
            awayTeam,
            homeScore: actHomeScore,
            awayScore: actAwayScore,
            winner,
            group: groupName,
            stage: 'Fase de Grupos',
            date: dateStr,
            status: matchStatus
          });

          // Leer pronósticos de cada participante para este partido (Filas 7 en adelante)
          for (let rIdx = 6; rIdx < rows.length; rIdx++) {
            const pRow = rows[rIdx];
            if (!pRow) continue;
            const pId = pRow[1]?.toString() || `p-${rIdx}`;
            const pName = pRow[2];

            if (pName && typeof pName === 'string' && pName.trim() !== '' && !pName.includes('Puntos') && !pName.includes('Subtotal')) {
              const normName = normalizeString(pName);

              if (!rawParticipantsMap[normName]) {
                rawParticipantsMap[normName] = {
                  id: pId,
                  name: pName.trim(),
                  totalPoints: 0,
                  groupsPoints: 0,
                  knockoutsPoints: 0,
                  paymentStatus: 'sin_informacion',
                  amountPaid: 0,
                  currency: 'COP'
                };
              }

              const pParticipant = rawParticipantsMap[normName];
              const predHomeVal = pRow[homeCol];
              const predAwayVal = pRow[awayCol];

              if (predHomeVal !== undefined && predHomeVal !== '' && predHomeVal !== 'x' &&
                  predAwayVal !== undefined && predAwayVal !== '' && predAwayVal !== 'x') {
                const predHome = parseInt(predHomeVal);
                const predAway = parseInt(predAwayVal);

                if (!isNaN(predHome) && !isNaN(predAway)) {
                  let pointsEarned = 0;
                  let predStatus: PredictionStatus = 'pendiente';

                  if (actHomeScore !== undefined && actAwayScore !== undefined) {
                    const predDiff = predHome - predAway;
                    const actDiff = actHomeScore - actAwayScore;

                    if (predHome === actHomeScore && predAway === actAwayScore) {
                      predStatus = 'acierto'; // Marcador Perfecto: 5 puntos
                      pointsEarned = 5;
                    } else if ((predDiff > 0 && actDiff > 0) || (predDiff < 0 && actDiff < 0) || (predDiff === 0 && actDiff === 0)) {
                      predStatus = 'parcial'; // Ganador o empate correcto: 2 puntos
                      pointsEarned = 2;
                    } else {
                      predStatus = 'error';
                      pointsEarned = 0;
                    }

                    pParticipant.groupsPoints += pointsEarned;
                    pParticipant.totalPoints += pointsEarned;
                  }

                  rawPredictions.push({
                    id: `pred-${matchId}-${normName}`,
                    participantId: pParticipant.id,
                    participantName: pParticipant.name,
                    matchId,
                    homeTeam,
                    awayTeam,
                    predictedHomeScore: predHome,
                    predictedAwayScore: predAway,
                    actualHomeScore: actHomeScore,
                    actualAwayScore: actAwayScore,
                    pointsEarned,
                    status: predStatus,
                    stage: 'Fase de Grupos',
                    group: groupName
                  });
                }
              }
            }
          }
        }
      }
    } else {
      // Fallback a estructura tabular estándar
      const jsonRows: any[] = utils.sheet_to_json(sheetGrupos, { defval: '' });
      jsonRows.forEach((row, idx) => {
        const pName = row['Participante'] || row['Nombre'] || row['Jugador'] || row['Usuario'] || '';
        const home = row['Local'] || row['Equipo 1'] || row['Equipo Local'] || '';
        const away = row['Visitante'] || row['Equipo 2'] || row['Equipo Visitante'] || '';
        const predHome = parseInt(row['Prediccion Local'] || row['Marcador Local'] || row['Marcador 1']) || 0;
        const predAway = parseInt(row['Prediccion Visitante'] || row['Marcador Visitante'] || row['Marcador 2']) || 0;
        const actHomeVal = row['Resultado Local'] || row['Real Local'];
        const actAwayVal = row['Resultado Visitante'] || row['Real Visitante'];
        const pts = parseFloat(row['Puntos'] || row['Puntaje'] || row['Pts']) || 0;
        const grupo = row['Grupo'] || 'Fase Grupos';

        if (pName && home && away) {
          const normName = normalizeString(pName);
          const matchId = `g-fallback-${normalizeString(home)}-${normalizeString(away)}`;

          let status: PredictionStatus = 'pendiente';
          if (actHomeVal !== undefined && actHomeVal !== '' && actAwayVal !== undefined && actAwayVal !== '') {
            const actHome = parseInt(actHomeVal);
            const actAway = parseInt(actAwayVal);
            const predDiff = predHome - predAway;
            const actDiff = actHome - actAway;
            
            if (predHome === actHome && predAway === actAway) {
              status = 'acierto';
            } else if ((predDiff > 0 && actDiff > 0) || (predDiff < 0 && actDiff < 0) || (predDiff === 0 && actDiff === 0)) {
              status = 'parcial';
            } else {
              status = 'error';
            }
          }

          rawPredictions.push({
            id: `pred-g-${idx}`,
            participantId: normName,
            participantName: pName,
            matchId,
            homeTeam: home,
            awayTeam: away,
            predictedHomeScore: predHome,
            predictedAwayScore: predAway,
            actualHomeScore: actHomeVal !== '' ? parseInt(actHomeVal) : undefined,
            actualAwayScore: actAwayVal !== '' ? parseInt(actAwayVal) : undefined,
            pointsEarned: pts,
            status,
            stage: 'Fase de Grupos',
            group: grupo
          });

          if (!rawParticipantsMap[normName]) {
            rawParticipantsMap[normName] = {
              id: normName,
              name: pName,
              totalPoints: 0,
              groupsPoints: 0,
              knockoutsPoints: 0,
              paymentStatus: 'sin_informacion',
              amountPaid: 0,
              currency: 'COP'
            };
          }
          rawParticipantsMap[normName].groupsPoints += pts;
          rawParticipantsMap[normName].totalPoints += pts;
        }
      });
    }
  }

  // --- 2. LEER PRONÓSTICOS KNOCKOUTS ---
  if (knockoutsSheetName) {
    const sheetKnockouts = workbook.Sheets[knockoutsSheetName];
    const rowsK: any[][] = utils.sheet_to_json(sheetKnockouts, { header: 1 });

    // Verificar si es la estructura matricial de Mauro (Fila 2 tiene las fases como 16avos, Octavos)
    const isMauroKMatrix = rowsK[1] && (rowsK[1][3]?.toString().toLowerCase().includes('16avos') || rowsK[1][3]?.toString().toLowerCase().includes('octavos'));

    if (isMauroKMatrix) {
      const stageRowK = rowsK[1]; // Fila 2 (índice 1): Fases
      const dateRowK = rowsK[2];  // Fila 3 (índice 2): Fechas
      const realRowK = rowsK[5];  // Fila 6 (índice 5): Marcador Real

      // Procesar los 31 partidos de eliminatorias
      for (let m = 0; m < 31; m++) {
        const homeCol = 3 + m * 3;
        const awayCol = homeCol + 1;
        const stageVal = stageRowK[homeCol] || stageRowK[homeCol - 1];

        if (stageVal && stageVal !== 'undefined') {
          const stage = stageVal.toString().trim();
          const matchId = `k-${m}-${normalizeString(stage)}`;
          const dateStr = excelDateToJSDate(dateRowK ? dateRowK[homeCol] : null, '2026-06-28');
          
          let actHomeScore: number | undefined = undefined;
          let actAwayScore: number | undefined = undefined;
          let matchStatus: MatchStatus = 'pendiente';
          let winner: string | undefined = undefined;

          if (realRowK && realRowK[homeCol] !== undefined && realRowK[homeCol] !== '' && realRowK[homeCol] !== 'x' &&
              realRowK[awayCol] !== undefined && realRowK[awayCol] !== '' && realRowK[awayCol] !== 'x') {
            actHomeScore = parseInt(realRowK[homeCol]);
            actAwayScore = parseInt(realRowK[awayCol]);
            if (!isNaN(actHomeScore) && !isNaN(actAwayScore)) {
              matchStatus = 'finalizado';
              winner = actHomeScore > actAwayScore ? `Ganador ${m*2+1}` : actHomeScore < actAwayScore ? `Ganador ${m*2+2}` : 'Empate';
            } else {
              actHomeScore = undefined;
              actAwayScore = undefined;
            }
          }

          const homeTeam = `Clasificado ${m*2+1}`;
          const awayTeam = `Clasificado ${m*2+2}`;

          rawMatches.push({
            id: matchId,
            homeTeam,
            awayTeam,
            homeScore: actHomeScore,
            awayScore: actAwayScore,
            winner,
            group: stage,
            stage: stage,
            date: dateStr,
            status: matchStatus
          });

          // Leer pronósticos de cada participante para eliminatorias (Filas 7 en adelante)
          for (let rIdx = 6; rIdx < rowsK.length; rIdx++) {
            const pRow = rowsK[rIdx];
            if (!pRow) continue;
            const pId = pRow[1]?.toString() || `p-k-${rIdx}`;
            const pName = pRow[2];

            if (pName && typeof pName === 'string' && pName.trim() !== '' && !pName.includes('Puntos') && !pName.includes('Subtotal')) {
              const normName = normalizeString(pName);

              if (!rawParticipantsMap[normName]) {
                rawParticipantsMap[normName] = {
                  id: pId,
                  name: pName.trim(),
                  totalPoints: 0,
                  groupsPoints: 0,
                  knockoutsPoints: 0,
                  paymentStatus: 'sin_informacion',
                  amountPaid: 0,
                  currency: 'COP'
                };
              }

              const pParticipant = rawParticipantsMap[normName];
              const predHomeVal = pRow[homeCol];
              const predAwayVal = pRow[awayCol];

              if (predHomeVal !== undefined && predHomeVal !== '' && predHomeVal !== 'x' &&
                  predAwayVal !== undefined && predAwayVal !== '' && predAwayVal !== 'x') {
                const predHome = parseInt(predHomeVal);
                const predAway = parseInt(predAwayVal);

                if (!isNaN(predHome) && !isNaN(predAway)) {
                  let pointsEarned = 0;
                  let predStatus: PredictionStatus = 'pendiente';

                  if (actHomeScore !== undefined && actAwayScore !== undefined) {
                    const predDiff = predHome - predAway;
                    const actDiff = actHomeScore - actAwayScore;

                    const isFinalStages = stage.toLowerCase().includes('semis') || stage.toLowerCase().includes('final') || stage.toLowerCase().includes('3 y 4');
                    const perfPoints = isFinalStages ? 15 : 10; // Marcador perfecto: 15 en semis/final, 10 en el resto
                    const winPoints = isFinalStages ? 6 : 4;   // Ganador correcto: 6 en semis/final, 4 en el resto

                    if (predHome === actHomeScore && predAway === actAwayScore) {
                      predStatus = 'acierto';
                      pointsEarned = perfPoints;
                    } else if ((predDiff > 0 && actDiff > 0) || (predDiff < 0 && actDiff < 0) || (predDiff === 0 && actDiff === 0)) {
                      predStatus = 'parcial';
                      pointsEarned = winPoints;
                    } else {
                      predStatus = 'error';
                      pointsEarned = 0;
                    }

                    pParticipant.knockoutsPoints += pointsEarned;
                    pParticipant.totalPoints += pointsEarned;
                  }

                  rawPredictions.push({
                    id: `pred-${matchId}-${normName}`,
                    participantId: pParticipant.id,
                    participantName: pParticipant.name,
                    matchId,
                    homeTeam,
                    awayTeam,
                    predictedHomeScore: predHome,
                    predictedAwayScore: predAway,
                    actualHomeScore: actHomeScore,
                    actualAwayScore: actAwayScore,
                    pointsEarned,
                    status: predStatus,
                    stage: stage,
                    group: stage
                  });
                }
              }
            }
          }
        }
      }
    } else {
      // Fallback a estructura tabular estándar para knockouts
      const jsonRows: any[] = utils.sheet_to_json(sheetKnockouts, { defval: '' });
      jsonRows.forEach((row, idx) => {
        const pName = row['Participante'] || row['Nombre'] || row['Jugador'] || '';
        const home = row['Local'] || row['Equipo 1'] || '';
        const away = row['Visitante'] || row['Equipo 2'] || '';
        const predHome = parseInt(row['Prediccion Local'] || row['Marcador 1']) || 0;
        const predAway = parseInt(row['Prediccion Visitante'] || row['Marcador 2']) || 0;
        const actHomeVal = row['Resultado Local'];
        const actAwayVal = row['Resultado Visitante'];
        const pts = parseFloat(row['Puntos'] || row['Puntaje']) || 0;
        const fase = row['Fase'] || row['Etapa'] || 'Knockouts';

        if (pName && home && away) {
          const normName = normalizeString(pName);
          const matchId = `k-fallback-${normalizeString(home)}-${normalizeString(away)}`;
          let status: PredictionStatus = 'pendiente';
          if (actHomeVal !== undefined && actHomeVal !== '') {
            status = pts > 0 ? (pts >= 5 ? 'acierto' : 'parcial') : 'error';
          }

          rawPredictions.push({
            id: `pred-k-${idx}`,
            participantId: normName,
            participantName: pName,
            matchId,
            homeTeam: home,
            awayTeam: away,
            predictedHomeScore: predHome,
            predictedAwayScore: predAway,
            actualHomeScore: actHomeVal !== '' ? parseInt(actHomeVal) : undefined,
            actualAwayScore: actAwayVal !== '' ? parseInt(actAwayVal) : undefined,
            pointsEarned: pts,
            status,
            stage: fase,
            group: fase
          });

          if (!rawParticipantsMap[normName]) {
            rawParticipantsMap[normName] = {
              id: normName,
              name: pName,
              totalPoints: 0,
              groupsPoints: 0,
              knockoutsPoints: 0,
              paymentStatus: 'sin_informacion',
              amountPaid: 0,
              currency: 'COP'
            };
          }
          rawParticipantsMap[normName].knockoutsPoints += pts;
          rawParticipantsMap[normName].totalPoints += pts;
        }
      });
    }
  }

  // --- 3. LEER PAGOS ---
  if (pagosSheetName) {
    const sheetPagos = workbook.Sheets[pagosSheetName];
    const rowsP: any[][] = utils.sheet_to_json(sheetPagos, { header: 1 });

    // Iterar desde la fila 3 (índice 2)
    for (let rIdx = 2; rIdx < rowsP.length; rIdx++) {
      const pRow = rowsP[rIdx];
      if (!pRow) continue;
      
      const pId = pRow[0]?.toString() || `pay-${rIdx}`;
      const pName = pRow[1];

      if (pName && typeof pName === 'string' && pName.trim() !== '' && 
          !pName.includes('Total') && !pName.includes('Pago') && !pName.includes('Tasa') && !pName.includes('Comite') && !pName.includes('Premios') && !pName.includes('Lugar')) {
        const normName = normalizeString(pName);
        const pagoSiNo = pRow[2];
        const pagoCop = pRow[3];
        const pagoMxn = pRow[4];

        const isPaid = pagoSiNo === 'Si' || pagoCop === true || pagoMxn === true || pagoCop === 'Si' || pagoMxn === 'Si';
        const status: PaymentStatus = isPaid ? 'pagado' : 'pendiente';
        const currency = (pagoMxn === true || pagoMxn === 'Si') ? 'MXN' : 'COP';
        const amount = (currency === 'MXN') ? 500 : (status === 'pagado' ? 100000 : 0);

        rawPayments.push({
          id: pId,
          participantName: pName.trim(),
          amount,
          currency,
          status,
          date: new Date().toISOString().split('T')[0],
          notes: status === 'pagado' ? `Pago verificado en ${currency}` : 'Pendiente de pago'
        });

        if (rawParticipantsMap[normName]) {
          rawParticipantsMap[normName].paymentStatus = status;
          rawParticipantsMap[normName].amountPaid = amount;
          rawParticipantsMap[normName].currency = currency;
        } else {
          rawParticipantsMap[normName] = {
            id: pId,
            name: pName.trim(),
            totalPoints: 0,
            groupsPoints: 0,
            knockoutsPoints: 0,
            paymentStatus: status,
            amountPaid: amount,
            currency
          };
        }
      }
    }
  }

  const participants = Object.values(rawParticipantsMap);
  const equiposRonda = parseEquiposRonda(workbook);

  return {
    participants,
    predictions: rawPredictions,
    matches: rawMatches,
    payments: rawPayments,
    errors,
    equiposRonda
  };
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  return parseExcelBuffer(buffer);
}
