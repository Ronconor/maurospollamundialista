import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== PRONOSTICOS KNOCKOUTS SHEET ===\n\n';
  rows.slice(0, 30).forEach((row, rIdx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    if (nonEmpties.length > 0) {
      output += `Row ${rIdx + 1}: ` + JSON.stringify(nonEmpties.slice(0, 20)) + '\n';
    }
  });

  fs.writeFileSync('knockouts_detailed.txt', output);
  console.log('Knockouts detailed written to knockouts_detailed.txt');
} catch (e) {
  fs.writeFileSync('knockouts_detailed.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
