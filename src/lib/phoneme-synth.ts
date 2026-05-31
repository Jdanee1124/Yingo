// Web Audio API Formant Synthesizer for IPA symbols
// Generates approximate phonetic sounds using oscillator formants

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

// Formant frequencies [F1, F2, F3] in Hz for vowels
const VOWEL_FORMANTS: Record<string, [number, number, number]> = {
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
  "eɪ":  [530, 1840, 2480],
  "aɪ":  [660, 1720, 2410],
  "ɔɪ":  [570, 840,  2410],
  "aʊ":  [730, 1090, 2440],
  "əʊ":  [500, 1500, 2500],
  "ɪə":  [390, 1990, 2550],
  "eə":  [530, 1840, 2480],
  "ʊə":  [440, 1020, 2240],
};

// Diphthong transition times (seconds)
const DIPHTHONGS = ["eɪ", "aɪ", "ɔɪ", "aʊ", "əʊ", "ɪə", "eə", "ʊə"];

// Consonant synthesis params: [duration, type, freq/noise, filterFreq, filterQ]
type ConsonantParams = {
  type: "burst" | "fricative" | "nasal" | "lateral" | "approx";
  freq?: number;
  noise?: boolean;
  filterFreq?: number;
  filterQ?: number;
  duration: number;
  voiced: boolean;
};

const CONSONANT_PARAMS: Record<string, ConsonantParams> = {
  "p": { type: "burst", noise: true, filterFreq: 2000, filterQ: 1, duration: 0.08, voiced: false },
  "b": { type: "burst", noise: true, filterFreq: 1500, filterQ: 1, duration: 0.08, voiced: true },
  "t": { type: "burst", noise: true, filterFreq: 4000, filterQ: 2, duration: 0.06, voiced: false },
  "d": { type: "burst", noise: true, filterFreq: 3000, filterQ: 2, duration: 0.06, voiced: true },
  "k": { type: "burst", noise: true, filterFreq: 2500, filterQ: 3, duration: 0.06, voiced: false },
  "ɡ": { type: "burst", noise: true, filterFreq: 1800, filterQ: 3, duration: 0.06, voiced: true },
  "f": { type: "fricative", noise: true, filterFreq: 5000, filterQ: 0.5, duration: 0.3, voiced: false },
  "v": { type: "fricative", noise: true, filterFreq: 3500, filterQ: 0.5, duration: 0.3, voiced: true },
  "θ": { type: "fricative", noise: true, filterFreq: 7000, filterQ: 0.5, duration: 0.3, voiced: false },
  "ð": { type: "fricative", noise: true, filterFreq: 5000, filterQ: 0.5, duration: 0.3, voiced: true },
  "s": { type: "fricative", noise: true, filterFreq: 8000, filterQ: 1, duration: 0.3, voiced: false },
  "z": { type: "fricative", noise: true, filterFreq: 6000, filterQ: 1, duration: 0.3, voiced: true },
  "ʃ": { type: "fricative", noise: true, filterFreq: 3500, filterQ: 0.7, duration: 0.3, voiced: false },
  "ʒ": { type: "fricative", noise: true, filterFreq: 3000, filterQ: 0.7, duration: 0.3, voiced: true },
  "h": { type: "fricative", noise: true, filterFreq: 1500, filterQ: 0.3, duration: 0.2, voiced: false },
  "tʃ": { type: "burst", noise: true, filterFreq: 3000, filterQ: 1.5, duration: 0.12, voiced: false },
  "dʒ": { type: "burst", noise: true, filterFreq: 2500, filterQ: 1.5, duration: 0.12, voiced: true },
  "m": { type: "nasal", freq: 280, duration: 0.4, voiced: true },
  "n": { type: "nasal", freq: 320, duration: 0.4, voiced: true },
  "ŋ": { type: "nasal", freq: 250, duration: 0.4, voiced: true },
  "l": { type: "lateral", freq: 350, duration: 0.3, voiced: true },
  "r": { type: "approx", freq: 320, filterFreq: 1500, filterQ: 2, duration: 0.25, voiced: true },
  "w": { type: "approx", freq: 300, filterFreq: 800, filterQ: 3, duration: 0.15, voiced: true },
  "j": { type: "approx", freq: 280, filterFreq: 2200, filterQ: 3, duration: 0.15, voiced: true },
};

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function synthesizeVowel(symbol: string, duration: number = 0.5) {
  const ctx = getCtx();
  const formants = VOWEL_FORMANTS[symbol];
  if (!formants) return;

  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
  gainNode.gain.setValueAtTime(0.3, now + duration - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);
  gainNode.connect(ctx.destination);

  // Create formant oscillators
  const [f1, f2, f3] = formants;
  const amplitudes = [0.5, 0.3, 0.15];

  [f1, f2, f3].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const formantGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now);
    formantGain.gain.setValueAtTime(amplitudes[i], now);
    
    // Bandpass filter for each formant
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, now);
    filter.Q.setValueAtTime(10 + i * 5, now);
    
    osc.connect(filter);
    filter.connect(formantGain);
    formantGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration);
  });

  // Add slight jitter for naturalness
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(5, now);
  lfoGain.gain.setValueAtTime(2, now);
  lfo.connect(lfoGain);
  lfo.start(now);
  lfo.stop(now + duration);
}

function synthesizeDiphthong(symbol: string, duration: number = 0.6) {
  const ctx = getCtx();
  const fromFormants = VOWEL_FORMANTS[symbol];
  if (!fromFormants) return;

  // Get the target formants (second vowel)
  const targetMap: Record<string, string> = {
    "eɪ": "ɪ", "aɪ": "ɪ", "ɔɪ": "ɪ",
    "aʊ": "ʊ", "əʊ": "ʊ",
    "ɪə": "ə", "eə": "ə", "ʊə": "ə"
  };
  const toSymbol = targetMap[symbol];
  const toFormants = toSymbol ? VOWEL_FORMANTS[toSymbol] : fromFormants;

  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
  gainNode.gain.setValueAtTime(0.3, now + duration - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, now + duration);
  gainNode.connect(ctx.destination);

  const amplitudes = [0.5, 0.3, 0.15];
  const transitionTime = duration * 0.5; // Start transition at 50%

  fromFormants.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const formantGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.linearRampToValueAtTime(toFormants[i], now + transitionTime);
    formantGain.gain.setValueAtTime(amplitudes[i], now);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq, now);
    filter.frequency.linearRampToValueAtTime(toFormants[i], now + transitionTime);
    filter.Q.setValueAtTime(10 + i * 5, now);

    osc.connect(filter);
    filter.connect(formantGain);
    formantGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration);
  });
}

function synthesizeConsonant(symbol: string) {
  const ctx = getCtx();
  const params = CONSONANT_PARAMS[symbol];
  if (!params) return;

  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  gainNode.connect(ctx.destination);

  if (params.type === "burst" || params.type === "fricative") {
    // Noise-based consonants
    const noiseBuffer = createNoiseBuffer(ctx, params.duration + 0.05);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(params.filterFreq || 3000, now);
    filter.Q.setValueAtTime(params.filterQ || 1, now);

    noiseSource.connect(filter);
    filter.connect(gainNode);

    if (params.type === "burst") {
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.duration);
    } else {
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gainNode.gain.setValueAtTime(0.2, now + params.duration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, now + params.duration);
    }

    // Add voicing if voiced
    if (params.voiced) {
      const voicingOsc = ctx.createOscillator();
      const voicingGain = ctx.createGain();
      voicingOsc.type = "sawtooth";
      voicingOsc.frequency.setValueAtTime(120, now);
      voicingGain.gain.setValueAtTime(0.15, now);
      voicingOsc.connect(voicingGain);
      voicingGain.connect(gainNode);
      voicingOsc.start(now);
      voicingOsc.stop(now + params.duration);
    }

    noiseSource.start(now);
    noiseSource.stop(now + params.duration + 0.05);
  } else {
    // Voiced consonants (nasal, lateral, approx)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(params.freq || 280, now);
    oscGain.gain.setValueAtTime(0.25, now);

    if (params.filterFreq) {
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(params.filterFreq, now);
      filter.Q.setValueAtTime(params.filterQ || 2, now);
      osc.connect(filter);
      filter.connect(oscGain);
    } else {
      osc.connect(oscGain);
    }

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gainNode.gain.setValueAtTime(0.3, now + params.duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + params.duration);

    oscGain.connect(gainNode);
    osc.start(now);
    osc.stop(now + params.duration);
  }
}

export function playPhoneme(symbol: string) {
  // Strip slashes
  const s = symbol.replace(/\//g, "");

  if (VOWEL_FORMANTS[s]) {
    if (DIPHTHONGS.includes(s)) {
      synthesizeDiphthong(s);
    } else {
      synthesizeVowel(s);
    }
  } else if (CONSONANT_PARAMS[s]) {
    synthesizeConsonant(s);
  } else {
    // Fallback: try to speak it as a word
    console.warn("No synthesis data for:", symbol);
  }
}
