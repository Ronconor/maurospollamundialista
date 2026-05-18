import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== ALL KNOCKOUTS MATCHES DETAILED ===\n\n';
  const stageRow = rows[1]; // Row 2
  const dateRow = rows[2]; // Row 3
  const realRow = rows[5]; // Row 6
  const ptsRow = rows[3]; // Row 4 (Puntos acumulados/fechas seriales)

  for (let m = 0; m < 38; m++) {
    const homeCol = 3 + m * 3;
    const awayCol = homeCol + 1;
    const stage = stageRow[homeCol] || stageRow[homeCol - 1] || 'undefined';
    const dateVal = dateRow[homeCol];
    const realHome = realRow ? realRow[homeCol] : 'N/A';
    const realAway = realRow ? realRow[awayCol] : 'N/A';

    output += `Match ${m + 1} (Cols ${homeCol}-${awayCol}): Stage=${stage} | DateVal=${dateVal} | Real=[${realHome}-${realAway}]\n`;
  }

  fs.writeFileSync('all_knockouts_matches.txt', output);
  console.log('All knockouts matches written to all_knockouts_matches.txt');
} catch (e) {
  fs.writeFileSync('all_knockouts_matches.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
