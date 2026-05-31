import { VocabWord, WordBook } from "@/types";
import { wordBooks as staticBooks } from "@/data/books/index";
import { ieltsCoreWords } from "@/data/books/ielts-core";

const bookWordMap: Record<string, VocabWord[]> = {
  "ielts-core": ieltsCoreWords,
};

export function getWordBooks(): WordBook[] {
  return staticBooks.map(book => ({
    ...book,
    wordCount: (bookWordMap[book.id] || []).length,
  }));
}

export function getWordBookById(bookId: string): WordBook | undefined {
  const book = staticBooks.find(b => b.id === bookId);
  if (!book) return undefined;
  return { ...book, wordCount: (bookWordMap[book.id] || []).length };
}

export function getWordsByBookId(bookId: string): VocabWord[] {
  return bookWordMap[bookId] || [];
}