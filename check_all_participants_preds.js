import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const rows = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });

  let output = '=== CHECKING ALL PARTICIPANT PREDICTIONS ===\n\n';
  
  // Filas 7 en adelante (índice 6 en adelante)
  rows.slice(6, 35).forEach((row, idx) => {
    const pId = row[1]; // Col 1
    const pName = row[2]; // Col 2
    if (pName) {
      // Verificar celdas de la 3 a la 30
      const preds = [];
      for (let c = 3; c <= 30; c++) {
        if (row[c] !== undefined && row[c] !== '') {
          preds.push(`Col ${c}: ${row[c]}`);
        }
      }
      output += `Row ${idx + 7} (${pName}): ${preds.length > 0 ? preds.join(', ') : 'No predictions in cols 3-30'}\n`;
    }
  });

  fs.writeFileSync('participants_preds_check.txt', output);
  console.log('Participant preds check written to participants_preds_check.txt');
} catch (e) {
  fs.writeFileSync('participants_preds_check.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
