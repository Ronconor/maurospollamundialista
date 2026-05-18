import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const rows = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });

  let output = '=== FINDING ANY PREDICTION IN GRUPOS (Rows 7-300, Cols 3-218) ===\n\n';
  let found = 0;

  rows.slice(6).forEach((row, rIdx) => {
    const pName = row[2];
    if (pName) {
      for (let c = 3; c <= 218; c++) {
        if (row[c] !== undefined && row[c] !== '') {
          output += `Row ${rIdx + 7} (${pName}), Col ${c}: ${row[c]}\n`;
          found++;
        }
      }
    }
  });

  if (found === 0) {
    output += 'NO PREDICTIONS FOUND IN ANY PARTICIPANT ROW (Cols 3-218 are completely empty)\n';
  }

  fs.writeFileSync('any_pred_check.txt', output);
  console.log('Any pred check written to any_pred_check.txt');
} catch (e) {
  fs.writeFileSync('any_pred_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
