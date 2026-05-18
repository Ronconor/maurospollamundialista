import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== PRONOSTICOS KNOCKOUTS ROW 2 (Cols 45 to 95) ===\n\n';
  const stageRow = rows[1];

  for (let c = 45; c <= 95; c++) {
    if (stageRow[c] !== undefined && stageRow[c] !== '') {
      output += `Col ${c}: ${stageRow[c]}\n`;
    }
  }

  fs.writeFileSync('knockouts_row2_check.txt', output);
  console.log('Knockouts row2 check written to knockouts_row2_check.txt');
} catch (e) {
  fs.writeFileSync('knockouts_row2_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
