import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const rows = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });

  let output = '=== MAURO ARBELAEZ & LUIS GARCIA PREDICTIONS ===\n\n';
  
  // Row 4 tiene los equipos
  const teamsRow = rows[3];
  output += 'Teams Row (Row 4):\n';
  teamsRow.forEach((val, cIdx) => {
    if (val !== undefined && val !== '') {
      output += `Col ${cIdx}: ${val} | `;
    }
  });
  output += '\n\n';

  // Row 7 (Mauro)
  const mauroRow = rows[6];
  output += 'Mauro Arbelaez (Row 7):\n';
  mauroRow.forEach((val, cIdx) => {
    if (val !== undefined && val !== '') {
      output += `Col ${cIdx}: ${val} | `;
    }
  });
  output += '\n\n';

  // Row 8 (Luis)
  const luisRow = rows[7];
  output += 'Luis Garcia (Row 8):\n';
  luisRow.forEach((val, cIdx) => {
    if (val !== undefined && val !== '') {
      output += `Col ${cIdx}: ${val} | `;
    }
  });
  output += '\n\n';

  fs.writeFileSync('mauro_preds.txt', output);
  console.log('Mauro preds written to mauro_preds.txt');
} catch (e) {
  fs.writeFileSync('mauro_preds.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
