import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  let output = 'Sheets: ' + wb.SheetNames.join(', ') + '\n\n';

  wb.SheetNames.forEach(s => {
    output += '=== SHEET: ' + s + ' ===\n';
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[s], { defval: '' });
    output += 'Total rows: ' + rows.length + '\n';
    output += 'First 5 rows:\n' + JSON.stringify(rows.slice(0, 5), null, 2) + '\n\n';
  });

  fs.writeFileSync('inspect.txt', output);
  console.log('Inspection written to inspect.txt');
} catch (e) {
  fs.writeFileSync('inspect.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
