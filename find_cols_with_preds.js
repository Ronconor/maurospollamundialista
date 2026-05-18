import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const rows = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });

  let output = '=== FINDING COLS WITH PREDS FOR MAURO ARBELAEZ (Row 7) ===\n\n';
  const mauroRow = rows[6]; // Row 7

  mauroRow.forEach((val, cIdx) => {
    if (val !== undefined && val !== '') {
      output += `Col ${cIdx}: ${val}\n`;
    }
  });

  fs.writeFileSync('mauro_cols_check.txt', output);
  console.log('Mauro cols check written to mauro_cols_check.txt');
} catch (e) {
  fs.writeFileSync('mauro_cols_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
