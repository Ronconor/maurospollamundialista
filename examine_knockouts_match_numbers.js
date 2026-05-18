import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== KNOCKOUTS MATCH NUMBERS (Row 1) ===\n\n';
  const matchNumRow = rows[0]; // Row 1
  const stageRow = rows[1]; // Row 2

  for (let m = 0; m < 35; m++) {
    const homeCol = 3 + m * 3;
    const matchNum = matchNumRow[homeCol];
    const stage = stageRow[homeCol];
    if (matchNum !== undefined) {
      output += `Match ${m + 1} (Col ${homeCol}): FIFA Match # ${matchNum} | Stage = ${stage}\n`;
    }
  }

  fs.writeFileSync('knockouts_match_numbers_check.txt', output);
  console.log('Knockouts match numbers check written to knockouts_match_numbers_check.txt');
} catch (e) {
  fs.writeFileSync('knockouts_match_numbers_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
