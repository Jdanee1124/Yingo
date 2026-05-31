const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, 'vocab-sample.ts');
const mappingsDir = path.join(__dirname, 'examples');

// Read and parse the vocab array
const raw = fs.readFileSync(vocabPath, 'utf-8');
const arrayStart = raw.indexOf('[');
const arrayEnd = raw.lastIndexOf(']');
const arrayStr = raw.substring(arrayStart, arrayEnd + 1);

// Parse using eval (safe for local build script)
const words = eval(arrayStr);
console.log('Parsed ' + words.length + ' words');

// Load all batch mappings
const batchFiles = fs.readdirSync(mappingsDir).filter(f => f.endsWith('.json')).sort();
const allMappings = {};
for (const file of batchFiles) {
  const batch = JSON.parse(fs.readFileSync(path.join(mappingsDir, file), 'utf-8'));
  Object.assign(allMappings, batch);
}
console.log('Loaded ' + Object.keys(allMappings).length + ' mappings');

// Apply mappings
let updated = 0;
for (const w of words) {
  if (allMappings[w.id]) {
    w.example = allMappings[w.id].example;
    w.exampleTranslation = allMappings[w.id].translation;
    updated++;
  }
}
console.log('Updated ' + updated + ' words');

// Reconstruct the file
function serializeWord(w) {
  const parts = [];
  parts.push('id: "' + w.id + '"');
  parts.push('word: "' + w.word + '"');
  parts.push('phonetic: "' + w.phonetic + '"');
  parts.push('meaning: "' + w.meaning + '"');
  if (w.meaningEn) parts.push('meaningEn: "' + w.meaningEn + '"');
  parts.push('example: "' + w.example.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"');
  if (w.exampleTranslation) parts.push('exampleTranslation: "' + w.exampleTranslation.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"');
  if (w.roots) parts.push('roots: "' + w.roots + '"');
  if (w.association) parts.push('association: "' + w.association + '"');
  parts.push('level: "' + w.level + '" as const');
  if (w.tags) parts.push('tags: ' + JSON.stringify(w.tags));
  return '  { ' + parts.join(', ') + ' }';
}

const header = raw.substring(0, arrayStart);
const footer = '\n];\n';
const body = words.map(w => serializeWord(w)).join(',\n');
const output = header + '[\n' + body + ',' + footer;

fs.writeFileSync(vocabPath, output, 'utf-8');
console.log('Written updated vocab-sample.ts (' + output.length + ' bytes)');
