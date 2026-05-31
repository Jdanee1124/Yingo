import { VocabProgress } from "@/types";

export function calculateSM2(progress: VocabProgress, quality: number): VocabProgress {
  let { easeFactor, interval, repetitions } = progress;
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  const now = Date.now();
  const nextReview = now + interval * 24 * 60 * 60 * 1000;
  return { ...progress, easeFactor, interval, repetitions, nextReview, lastReview: now };
}

export function createProgress(wordId: string, bookId: string = "ielts-core"): VocabProgress {
  return { wordId, bookId, easeFactor: 2.5, interval: 0, repetitions: 0, nextReview: Date.now() };
}

export function getMasteryLevel(progress: VocabProgress): number {
  if (progress.repetitions === 0) return 0;
  const base = Math.min(progress.repetitions * 15, 60);
  const efBonus = (progress.easeFactor - 1.3) * 20;
  return Math.min(Math.round(base + efBonus), 100);
}