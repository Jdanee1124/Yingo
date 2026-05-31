const fs = require('fs');
const path = require('path');
const audioDir = path.join(__dirname, '..', 'public', 'audio');

if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const SR = 22050;

function createWav(samples, sampleRate) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 30);
  buf.writeUInt16LE(16, 32);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32000), 44 + i * 2);
  }
  return buf;
}

// Glottal pulse source (more natural than sine wave)
function glottalPulse(t, f0) {
  const phase = (t * f0) % 1;
  // Rosenberg glottal pulse model
  if (phase < 0.4) {
    return 0.5 * (1 - Math.cos(Math.PI * phase / 0.4));
  } else if (phase < 0.6) {
    return Math.cos(Math.PI * (phase - 0.4) / 0.4);
  }
  return 0;
}

// Formant filter (bandpass)
function formantFilter(input, freq, bandwidth, sr) {
  const w = 2 * Math.PI * freq / sr;
  const r = Math.exp(-Math.PI * bandwidth / sr);
  const c = r * Math.cos(w);
  // Simple resonator
  const output = new Float64Array(input.length);
  let y1 = 0, y2 = 0;
  for (let i = 0; i < input.length; i++) {
    const y = input[i] + 2 * c * y1 - r * r * y2;
    y2 = y1;
    y1 = y;
    output[i] = y;
  }
  return output;
}

// Generate vowel with proper formant synthesis
function generateVowel(formants, duration) {
  const n = Math.floor(SR * duration);
  const src = new Float64Array(n);
  const f0 = 130; // fundamental frequency
  
  // Generate glottal source with jitter
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const jitter = 1 + 0.005 * Math.sin(2 * Math.PI * 5.5 * t); // slight jitter
    src[i] = glottalPulse(t, f0 * jitter) * 0.8;
    // Add aspiration noise
    src[i] += 0.02 * (Math.random() * 2 - 1);
  }
  
  // Apply formant filters and mix
  const output = new Float64Array(n);
  const amplitudes = [0.5, 0.3, 0.12, 0.05];
  const bandwidths = [80, 90, 120, 150];
  
  for (let f = 0; f < Math.min(formants.length, 4); f++) {
    const filtered = formantFilter(src, formants[f], bandwidths[f], SR);
    for (let i = 0; i < n; i++) {
      output[i] += filtered[i] * amplitudes[f];
    }
  }
  
  // Add vibrato
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    output[i] *= 1 + 0.03 * Math.sin(2 * Math.PI * 5 * t);
  }
  
  // Apply envelope
  const attack = Math.floor(SR * 0.03);
  const release = Math.floor(SR * 0.08);
  for (let i = 0; i < n; i++) {
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > n - release) env = (n - i) / release;
    output[i] *= env;
  }
  
  return output;
}

// Generate diphthong with formant transition
function generateDiphthong(fromFormants, toFormants, duration) {
  const n = Math.floor(SR * duration);
  const src = new Float64Array(n);
  const f0 = 130;
  
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const jitter = 1 + 0.005 * Math.sin(2 * Math.PI * 5.5 * t);
    src[i] = glottalPulse(t, f0 * jitter) * 0.8;
    src[i] += 0.02 * (Math.random() * 2 - 1);
  }
  
  const output = new Float64Array(n);
  const amplitudes = [0.5, 0.3, 0.12];
  const bandwidths = [80, 90, 120];
  const transPoint = Math.floor(n * 0.55);
  
  for (let f = 0; f < 3; f++) {
    const filtered = formantFilter(src, fromFormants[f], bandwidths[f], SR);
    // Smooth transition
    for (let i = 0; i < n; i++) {
      let freq = fromFormants[f];
      if (i > transPoint) {
        const progress = Math.min(1, (i - transPoint) / (n * 0.25));
        freq = fromFormants[f] + (toFormants[f] - fromFormants[f]) * progress;
      }
      output[i] += filtered[i] * amplitudes[f];
    }
  }
  
  // Envelope
  const attack = Math.floor(SR * 0.03);
  const release = Math.floor(SR * 0.1);
  for (let i = 0; i < n; i++) {
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > n - release) env = (n - i) / release;
    output[i] *= env;
  }
  
  return output;
}

// Generate fricative consonant
function generateFricative(freq, duration, voiced) {
  const n = Math.floor(SR * duration);
  const output = new Float64Array(n);
  
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let val = (Math.random() * 2 - 1) * 0.3;
    // Bandpass filter approximation
    val *= Math.sin(2 * Math.PI * freq * t);
    if (voiced) {
      val += 0.15 * glottalPulse(t, 120);
    }
    output[i] = val;
  }
  
  const attack = Math.floor(SR * 0.015);
  const release = Math.floor(SR * 0.03);
  for (let i = 0; i < n; i++) {
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > n - release) env = (n - i) / release;
    output[i] *= env;
  }
  
  return output;
}

// Generate burst consonant
function generateBurst(freq, voiced) {
  const n = Math.floor(SR * 0.12);
  const output = new Float64Array(n);
  
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let val = (Math.random() * 2 - 1) * 0.4;
    val *= Math.exp(-t * 30);
    val *= Math.sin(2 * Math.PI * freq * t);
    if (voiced && i < n * 0.3) {
      val += 0.2 * glottalPulse(t, 120) * Math.exp(-t * 10);
    }
    output[i] = val;
  }
  
  return output;
}

// Generate nasal consonant
function generateNasal(freq, duration) {
  const n = Math.floor(SR * duration);
  const output = new Float64Array(n);
  
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let val = glottalPulse(t, 120) * 0.4;
    val *= Math.sin(2 * Math.PI * freq * t);
    output[i] = val;
  }
  
  const attack = Math.floor(SR * 0.02);
  const release = Math.floor(SR * 0.05);
  for (let i = 0; i < n; i++) {
    let env = 1;
    if (i < attack) env = i / attack;
    else if (i > n - release) env = (n - i) / release;
    output[i] *= env;
  }
  
  return output;
}

// Formant data for vowels [F1, F2, F3]
const V = {
  "iː":  [270, 2300, 2890],
  "ɪ":   [390, 1990, 2550],
  "e":   [530, 1840, 2480],
  "æ":   [660, 1720, 2410],
  "ɑː":  [730, 1090, 2440],
  "ɒ":   [570, 840,  2410],
  "ɔː":  [590, 920,  2410],
  "ʊ":   [440, 1020, 2240],
  "uː":  [300, 870,  2240],
  "ʌ":   [640, 1190, 2390],
  "ɜː":  [490, 1350, 1690],
  "ə":   [500, 1500, 2500],
};

const DIPHTHONGS = {
  "eɪ":  [[530, 1840, 2480], [390, 1990, 2550]],
  "aɪ":  [[660, 1720, 2410], [390, 1990, 2550]],
  "ɔɪ":  [[570, 840,  2410], [390, 1990, 2550]],
  "aʊ":  [[730, 1090, 2440], [440, 1020, 2240]],
  "əʊ":  [[500, 1500, 2500], [440, 1020, 2240]],
  "ɪə":  [[390, 1990, 2550], [500, 1500, 2500]],
  "eə":  [[530, 1840, 2480], [500, 1500, 2500]],
  "ʊə":  [[440, 1020, 2240], [500, 1500, 2500]],
};

let count = 0;

// Generate vowels
for (const [sym, formants] of Object.entries(V)) {
  const filename = sym.replace(/\//g, '') + '.wav';
  const samples = generateVowel(formants, 0.7);
  fs.writeFileSync(path.join(audioDir, filename), createWav(samples, SR));
  count++;
}
console.log('Generated ' + count + ' vowels');

// Generate diphthongs
for (const [sym, [from, to]] of Object.entries(DIPHTHONGS)) {
  const filename = sym.replace(/\//g, '') + '.wav';
  const samples = generateDiphthong(from, to, 0.8);
  fs.writeFileSync(path.join(audioDir, filename), createWav(samples, SR));
  count++;
}
console.log('Generated ' + (count - 12) + ' diphthongs');

// Generate consonants
const C = {
  "p": { type: "burst", freq: 2000, voiced: false },
  "b": { type: "burst", freq: 1500, voiced: true },
  "t": { type: "burst", freq: 4000, voiced: false },
  "d": { type: "burst", freq: 3000, voiced: true },
  "k": { type: "burst", freq: 2500, voiced: false },
  "g": { type: "burst", freq: 1800, voiced: true },
  "f": { type: "fric", freq: 5000, voiced: false },
  "v": { type: "fric", freq: 3500, voiced: true },
  "θ": { type: "fric", freq: 7000, voiced: false },
  "ð": { type: "fric", freq: 5000, voiced: true },
  "s": { type: "fric", freq: 8000, voiced: false },
  "z": { type: "fric", freq: 6000, voiced: true },
  "ʃ": { type: "fric", freq: 3500, voiced: false },
  "ʒ": { type: "fric", freq: 3000, voiced: true },
  "h": { type: "fric", freq: 1500, voiced: false },
  "tʃ": { type: "burst", freq: 3000, voiced: false },
  "dʒ": { type: "burst", freq: 2500, voiced: true },
  "m": { type: "nasal", freq: 280 },
  "n": { type: "nasal", freq: 320 },
  "ŋ": { type: "nasal", freq: 250 },
  "l": { type: "nasal", freq: 350 },
  "r": { type: "nasal", freq: 320 },
  "w": { type: "nasal", freq: 300 },
  "j": { type: "nasal", freq: 280 },
};

for (const [sym, params] of Object.entries(C)) {
  const filename = sym.replace(/\//g, '') + '.wav';
  let samples;
  if (params.type === "burst") {
    samples = generateBurst(params.freq, params.voiced);
  } else if (params.type === "fric") {
    samples = generateFricative(params.freq, 0.3, params.voiced);
  } else {
    samples = generateNasal(params.freq, 0.35);
  }
  fs.writeFileSync(path.join(audioDir, filename), createWav(samples, SR));
  count++;
}
console.log('Generated ' + (count - 20) + ' consonants');
console.log('Total: ' + count + ' files in ' + audioDir);

// List files
const files = fs.readdirSync(audioDir).filter(f => f.endsWith('.wav'));
console.log('Files: ' + files.join(', '));
