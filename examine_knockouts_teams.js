import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetKnockouts = wb.Sheets['Pronosticos Knockouts'];
  const rows = xlsx.utils.sheet_to_json(sheetKnockouts, { header: 1 });

  let output = '=== PRONOSTICOS KNOCKOUTS ROW 4 & 5 ===\n\n';
  const row4 = rows[3];
  const row5 = rows[4];

  output += 'Row 4 (index 3):\n';
  row4.forEach((val, cIdx) => {
    if (val !== undefined && val !== '') {
      output += `Col ${cIdx}: ${val} | `;
    }
  });
  output += '\n\n';

  output += 'Row 5 (index 4):\n';
  row5.forEach((val, cIdx) => {
    if (val !== undefined && val !== '') {
      output += `Col ${cIdx}: ${val} | `;
    }
  });
  output += '\n\n';

  fs.writeFileSync('knockouts_teams_check.txt', output);
  console.log('Knockouts teams check written to knockouts_teams_check.txt');
} catch (e) {
  fs.writeFileSync('knockouts_teams_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
