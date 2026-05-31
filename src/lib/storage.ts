import { VocabProgress, DailyVocabStats, UserProfile } from "@/types";

const KEYS = { VOCAB: "yingo_vocab", STATS: "yingo_stats", USER: "yingo_user" } as const;

function get<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function getVocabProgresses(): VocabProgress[] { return get<VocabProgress[]>(KEYS.VOCAB, []); }
export function getVocabProgress(wordId: string) { return getVocabProgresses().find(p => p.wordId === wordId); }

export function saveVocabProgress(progress: VocabProgress): void {
  const all = getVocabProgresses();
  const i = all.findIndex(p => p.wordId === progress.wordId);
  if (i >= 0) all[i] = progress; else all.push(progress);
  set(KEYS.VOCAB, all);
}

export function getDailyStats(date: string): DailyVocabStats {
  const all = get<DailyVocabStats[]>(KEYS.STATS, []);
  return all.find(s => s.date === date) || { date, newWords: 0, reviewed: 0, correct: 0, incorrect: 0 };
}

export function updateDailyStats(date: string, update: Partial<DailyVocabStats>): void {
  const all = get<DailyVocabStats[]>(KEYS.STATS, []);
  const i = all.findIndex(s => s.date === date);
  const cur = all[i] || { date, newWords: 0, reviewed: 0, correct: 0, incorrect: 0 };
  const updated = { ...cur, ...update };
  if (i >= 0) all[i] = updated; else all.push(updated);
  set(KEYS.STATS, all);
}

export function getUserProfile(): UserProfile {
  return get<UserProfile>(KEYS.USER, { name: "", targetScore: "6.5", joinDate: new Date().toISOString().split("T")[0], streakDays: 0, totalWordsLearned: 0, totalReadingDone: 0, totalWritingDone: 0 });
}

export function saveUserProfile(profile: UserProfile): void { set(KEYS.USER, profile); }
export function getToday(): string { return new Date().toISOString().split("T")[0]; }