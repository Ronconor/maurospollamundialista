import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  let output = '=== TRACKING TEAM NAMES IN ALL SHEETS ===\n\n';

  wb.SheetNames.forEach(sheetName => {
    output += `--- SHEET: ${sheetName} ---\n`;
    const sheet = wb.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, rIdx) => {
      const rowStr = row.join(' ');
      if (rowStr.includes('Mx') || rowStr.includes('Canada') || rowStr.includes('Usa') || rowStr.includes('Brasil')) {
        output += `Row ${rIdx + 1}:\n`;
        row.forEach((val, cIdx) => {
          if (val !== undefined && val !== '') {
            output += `  Col ${cIdx}: ${val}\n`;
          }
        });
      }
    });
    output += '\n';
  });

  fs.writeFileSync('team_names_tracking.txt', output);
  console.log('Team names tracking written to team_names_tracking.txt');
} catch (e) {
  fs.writeFileSync('team_names_tracking.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
