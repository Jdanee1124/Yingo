export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  meaningEn?: string;
  example: string;
  exampleTranslation?: string;
  roots?: string;
  association?: string;
  level: "core" | "advanced";
  tags?: string[];
}

export interface WordBook {
  id: string;
  name: string;
  description: string;
  wordCount: number;
  icon: string;
  color: string;
  categories?: string[];
}

export interface VocabProgress {
  wordId: string;
  bookId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview?: number;
}

export interface DailyVocabStats {
  date: string;
  newWords: number;
  reviewed: number;
  correct: number;
  incorrect: number;
}

export interface UserProfile {
  name: string;
  targetScore: string;
  joinDate: string;
  streakDays: number;
  totalWordsLearned: number;
  totalReadingDone: number;
  totalWritingDone: number;
}