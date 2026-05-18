import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== KNOCKOUTS STAGES MAPPING ===\n\n';
  const stageRow = rows[1]; // Row 2

  for (let m = 0; m < 35; m++) {
    const homeCol = 3 + m * 3;
    const stage = stageRow[homeCol];
    if (stage) {
      output += `Match ${m + 1} (Col ${homeCol}): Stage = ${stage}\n`;
    }
  }

  fs.writeFileSync('knockouts_stages_check.txt', output);
  console.log('Knockouts stages check written to knockouts_stages_check.txt');
} catch (e) {
  fs.writeFileSync('knockouts_stages_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
