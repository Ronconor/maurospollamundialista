import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheet = wb.Sheets['Resultados'];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  let output = '=== RESULTADOS SHEET (Total rows: ' + rows.length + ') ===\n\n';

  rows.forEach((row, rIdx) => {
    // Filtrar celdas no vacías
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '' && item.val !== null);
    if (nonEmpties.length > 0) {
      output += `Row ${rIdx + 1}: ` + JSON.stringify(nonEmpties) + '\n';
    }
  });

  fs.writeFileSync('inspect_res.txt', output);
  console.log('Resultados inspection written to inspect_res.txt');
} catch (e) {
  fs.writeFileSync('inspect_res.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
