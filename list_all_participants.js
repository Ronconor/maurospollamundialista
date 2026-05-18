import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const rows = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });

  let output = '=== LISTING ALL PARTICIPANTS IN GRUPOS AND THEIR PREDICTIONS COUNT ===\n\n';

  rows.slice(6).forEach((row, rIdx) => {
    const pId = row[1];
    const pName = row[2];
    if (pName) {
      let predsCount = 0;
      for (let c = 3; c <= 218; c++) {
        if (row[c] !== undefined && row[c] !== '') predsCount++;
      }
      output += `Row ${rIdx + 7} (ID: ${pId}, Name: ${pName}): ${predsCount} predictions\n`;
    }
  });

  fs.writeFileSync('all_participants_preds.txt', output);
  console.log('All participants preds written to all_participants_preds.txt');
} catch (e) {
  fs.writeFileSync('all_participants_preds.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
