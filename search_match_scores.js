import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  let output = '=== SEARCHING FOR MATCH SCORES IN ALL SHEETS ===\n\n';

  wb.SheetNames.forEach(sheetName => {
    output += `--- SHEET: ${sheetName} ---\n`;
    const sheet = wb.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    rows.forEach((row, rIdx) => {
      const rowStr = row.join(' ');
      // Buscar si la fila menciona equipos como Mx, Sud, Corea, Canada, Usa, Brasil
      if (rowStr.includes('Mx') || rowStr.includes('Sud') || rowStr.includes('Corea') || rowStr.includes('Canada') || rowStr.includes('Usa') || rowStr.includes('Brasil')) {
        const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
        output += `Row ${rIdx + 1}: ` + JSON.stringify(nonEmpties.slice(0, 20)) + '\n';
      }
    });
    output += '\n';
  });

  fs.writeFileSync('match_scores_search.txt', output);
  console.log('Match scores search written to match_scores_search.txt');
} catch (e) {
  fs.writeFileSync('match_scores_search.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
