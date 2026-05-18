import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetRes = wb.Sheets['Resultados'];
  const jsonRes = xlsx.utils.sheet_to_json(sheetRes, { header: 1 });
  
  let output = '=== RESULTADOS SHEET DETAILED (First 30 rows) ===\n\n';
  jsonRes.slice(0, 30).forEach((row, idx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    output += `Row ${idx + 1}: ` + JSON.stringify(nonEmpties) + '\n';
  });

  fs.writeFileSync('res_detailed.txt', output);
  console.log('Detailed Resultados written to res_detailed.txt');
} catch (e) {
  fs.writeFileSync('res_detailed.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
