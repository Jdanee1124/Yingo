const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname);
const backupPath = path.join(dataDir, 'vocab-sample.bak.ts');
const outputPath = path.join(dataDir, 'vocab-sample.ts');
const examplesDir = path.join(dataDir, 'examples');

// Read backup
const raw = fs.readFileSync(backupPath, 'utf-8');
const clean = raw.replace(/ as const/g, '');
const words = eval(clean.substring(clean.indexOf('['), clean.lastIndexOf(']') + 1));
console.log('Loaded ' + words.length + ' words');

// Load all batch JSON files
const allExamples = {};
if (fs.existsSync(examplesDir)) {
  const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.json')).sort();
  for (const file of files) {
    const batch = JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf-8'));
    Object.assign(allExamples, batch);
  }
}
console.log('Loaded ' + Object.keys(allExamples).length + ' examples');

// Apply examples
let matched = 0;
for (const w of words) {
  if (allExamples[w.id]) {
    w.example = allExamples[w.id].e;
    w.exampleTranslation = allExamples[w.id].t;
    matched++;
  }
}
console.log('Applied ' + matched + ' examples');

// Write output
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }
function serWord(w) {
  const p = [];
  p.push('id: "' + w.id + '"');
  p.push('word: "' + w.word + '"');
  p.push('phonetic: "' + w.phonetic + '"');
  p.push('meaning: "' + esc(w.meaning) + '"');
  if (w.meaningEn) p.push('meaningEn: "' + esc(w.meaningEn) + '"');
  p.push('example: "' + esc(w.example) + '"');
  if (w.exampleTranslation) p.push('exampleTranslation: "' + esc(w.exampleTranslation) + '"');
  if (w.roots) p.push('roots: "' + esc(w.roots) + '"');
  if (w.association) p.push('association: "' + esc(w.association) + '"');
  p.push('level: "' + w.level + '" as const');
  if (w.tags) p.push('tags: ' + JSON.stringify(w.tags));
  return '  { ' + p.join(', ') + ' }';
}

const header = raw.substring(0, raw.indexOf('= [') + 2);
const body = words.map(w => serWord(w)).join(',\n');
const output = header + '[\n' + body + ',\n];\n';
fs.writeFileSync(outputPath, output, 'utf-8');
console.log('Written ' + output.length + ' bytes to vocab-sample.ts');

