import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== PRONOSTICOS KNOCKOUTS COLS 68-75 ===\n\n';

  [0, 1, 2, 3, 5, 6].forEach(rIdx => {
    output += `Row ${rIdx + 1}:\n`;
    for (let c = 68; c <= 75; c++) {
      output += `  Col ${c}: ${rows[rIdx][c] !== undefined ? rows[rIdx][c] : 'undefined'}\n`;
    }
  });

  fs.writeFileSync('octavos_cols_check.txt', output);
  console.log('Octavos cols check written to octavos_cols_check.txt');
} catch (e) {
  fs.writeFileSync('octavos_cols_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
