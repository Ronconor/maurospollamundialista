import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetReglas = wb.Sheets['Info y Reglas'];
  const rows = xlsx.utils.sheet_to_json(sheetReglas, { header: 1 });

  let output = '=== INFO Y REGLAS SHEET ===\n\n';
  rows.forEach((row, rIdx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    if (nonEmpties.length > 0) {
      output += `Row ${rIdx + 1}: ` + JSON.stringify(nonEmpties) + '\n';
    }
  });

  fs.writeFileSync('reglas_detailed.txt', output);
  console.log('Reglas detailed written to reglas_detailed.txt');
} catch (e) {
  fs.writeFileSync('reglas_detailed.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
