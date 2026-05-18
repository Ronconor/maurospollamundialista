import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetPagos = wb.Sheets['Pagos'];
  const rows = xlsx.utils.sheet_to_json(sheetPagos, { header: 1 });

  let output = '=== PAGOS SHEET DETAILED ===\n\n';
  rows.slice(0, 30).forEach((row, rIdx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    if (nonEmpties.length > 0) {
      output += `Row ${rIdx + 1}: ` + JSON.stringify(nonEmpties) + '\n';
    }
  });

  fs.writeFileSync('pagos_detailed.txt', output);
  console.log('Pagos detailed written to pagos_detailed.txt');
} catch (e) {
  fs.writeFileSync('pagos_detailed.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
