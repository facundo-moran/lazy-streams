// scripts/gen-coverage-badge.js
import fs from 'fs';
import path from 'path';
import { badgen } from 'badgen';

// Buscar subcarpeta coverage/* que contenga un index.html
const coverageDir = 'coverage';
const subdirs = fs.readdirSync(coverageDir);
console.log('[DEBUG] Subcarpetas en /coverage:', subdirs);

const reportDir = subdirs.find(dir => {
  const possiblePath = path.join(coverageDir, dir, 'index.html');
  return fs.existsSync(possiblePath);
});

if (!reportDir) {
  console.error('❌ No se encontró index.html en ninguna subcarpeta de /coverage.');
  process.exit(1);
}

const htmlPath = path.join(coverageDir, reportDir, 'index.html');
console.log('[DEBUG] Leyendo HTML desde:', htmlPath);

const html = fs.readFileSync(htmlPath, 'utf-8');
if (!html || html.length < 100) {
  console.error('❌ El archivo HTML está vacío o es sospechosamente corto.');
  process.exit(1);
}

// Buscar la cobertura de Statements
const match = html.match(/<span class="strong">([\d.]+)%\s*<\/span>\s*<span class="quiet">Statements<\/span>/);

if (!match || !match[1]) {
  console.error('❌ No se pudo extraer el porcentaje de cobertura desde el HTML.');
  process.exit(1);
}

const coverage = parseFloat(match[1]);

const badge = badgen({
  label: 'coverage',
  status: `${coverage.toFixed(2)}%`,
  color:
    coverage >= 90 ? 'green' :
    coverage >= 75 ? 'yellow' :
    coverage >= 50 ? 'orange' : 'red'
});

const outputPath = path.join('coverage', 'badge.svg');
fs.writeFileSync(outputPath, badge);
console.log(`✅ Badge generado: ${outputPath} (${coverage.toFixed(2)}%)`);
