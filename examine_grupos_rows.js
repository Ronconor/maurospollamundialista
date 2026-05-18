import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const rows = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });

  let output = '=== PRONOSTICOS GRUPOS DETAILED (First 25 rows) ===\n\n';
  rows.slice(0, 25).forEach((row, rIdx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    output += `Row ${rIdx + 1}: ` + JSON.stringify(nonEmpties.slice(0, 15)) + '\n';
  });

  fs.writeFileSync('grupos_detailed.txt', output);
  console.log('Grupos detailed written to grupos_detailed.txt');
} catch (e) {
  fs.writeFileSync('grupos_detailed.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
