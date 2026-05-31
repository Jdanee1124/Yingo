// Text-to-Speech utility with British English voice preference for IELTS learning

let preferredVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

// British English voice names to prefer (ordered by quality)
const BRITISH_VOICES = [
  "Microsoft Emma",           // UK English female
  "Microsoft George",         // UK English male
  "Google UK English Female",
  "Google UK English Male",
  "Samantha",                 // macOS British
  "Daniel",                   // macOS British male
  "Moira",                    // macOS Irish
  "Tom",                      // macOS
  "Karen",                    // macOS Australian
];

const US_FALLBACK = [
  "Microsoft Zira",
  "Google US English",
  "Samantha",
];

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined") return [];
  return window.speechSynthesis?.getVoices() || [];
}

function findBestVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (voices.length === 0) return null;

  // Try British English voices first
  for (const name of BRITISH_VOICES) {
    const v = voices.find(v => v.name.includes(name));
    if (v) return v;
  }

  // Try any en-GB voice
  const britishVoice = voices.find(v => v.lang.startsWith("en-GB"));
  if (britishVoice) return britishVoice;

  // Try any en-IE (Irish, close to British)
  const irishVoice = voices.find(v => v.lang.startsWith("en-IE"));
  if (irishVoice) return irishVoice;

  // Fallback to US English
  for (const name of US_FALLBACK) {
    const v = voices.find(v => v.name.includes(name));
    if (v) return v;
  }

  // Any English voice
  const anyEnglish = voices.find(v => v.lang.startsWith("en"));
  if (anyEnglish) return anyEnglish;

  return voices[0] || null;
}

// Ensure voices are loaded (they load async in some browsers)
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = true;
    preferredVoice = findBestVoice();
  };
  // Try immediate load
  preferredVoice = findBestVoice();
  voicesLoaded = loadVoices().length > 0;
}

export function speakWord(word: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  // Re-check voices if not loaded yet
  if (!preferredVoice || !voicesLoaded) {
    preferredVoice = findBestVoice();
    voicesLoaded = true;
  }

  const u = new SpeechSynthesisUtterance(word);
  if (preferredVoice) {
    u.voice = preferredVoice;
  }
  u.lang = preferredVoice?.lang || "en-GB";
  u.rate = 0.82;   // Slightly slower than normal for clarity
  u.pitch = 1.0;
  u.volume = 1.0;
  window.speechSynthesis.speak(u);
}

export function speakSentence(sentence: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  if (!preferredVoice || !voicesLoaded) {
    preferredVoice = findBestVoice();
    voicesLoaded = true;
  }

  const u = new SpeechSynthesisUtterance(sentence);
  if (preferredVoice) {
    u.voice = preferredVoice;
  }
  u.lang = preferredVoice?.lang || "en-GB";
  u.rate = 0.78;   // Slower for sentence comprehension
  u.pitch = 1.0;
  u.volume = 1.0;
  window.speechSynthesis.speak(u);
}

export function getVoiceInfo(): string {
  if (!preferredVoice) return "未检测到语音引擎";
  return `${preferredVoice.name} (${preferredVoice.lang})`;
}
