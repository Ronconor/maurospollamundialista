import xlsx from 'xlsx';
import fs from 'fs';

try {
  const wb = xlsx.readFile('Mundial 2026 Usa_Can_Mx.xlsx');
  let output = '=== EXCEL ANALYSIS ===\n\n';

  // Analizar Pronosticos Grupos
  const sheetGrupos = wb.Sheets['Pronosticos Grupos'];
  const jsonGrupos = xlsx.utils.sheet_to_json(sheetGrupos, { header: 1 });
  
  output += '--- PRONOSTICOS GRUPOS (First 5 rows) ---\n';
  jsonGrupos.slice(0, 5).forEach((row, idx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    output += `Row ${idx + 1}: ` + JSON.stringify(nonEmpties.slice(0, 15)) + '\n';
  });
  output += '\n';

  // Analizar Resultados
  const sheetRes = wb.Sheets['Resultados'];
  const jsonRes = xlsx.utils.sheet_to_json(sheetRes, { header: 1 });
  
  output += '--- RESULTADOS (First 15 rows) ---\n';
  jsonRes.slice(0, 15).forEach((row, idx) => {
    const nonEmpties = row.map((val, cIdx) => ({ cIdx, val })).filter(item => item.val !== undefined && item.val !== '');
    output += `Row ${idx + 1}: ` + JSON.stringify(nonEmpties.slice(0, 15)) + '\n';
  });

  fs.writeFileSync('analysis.txt', output);
  console.log('Analysis written to analysis.txt');
} catch (e) {
  fs.writeFileSync('analysis.txt', 'ERROR: ' + e.message + '\n' + e.stack);
}
