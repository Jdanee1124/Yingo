"use client";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getWordBooks } from "@/lib/books";
import { getVocabProgresses } from "@/lib/storage";
import type { WordBook } from "@/types";

function getInitialData() {
  const books = getWordBooks();
  const allProgress = getVocabProgresses();
  const counts: Record<string, number> = {};
  allProgress.forEach(p => {
    if (p.repetitions > 0) {
      counts[p.bookId] = (counts[p.bookId] || 0) + 1;
    }
  });
  return { books, learnedCounts: counts };
}

export default function VocabPage() {
  const [data] = useState(getInitialData);

  return (
    <>
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold">词汇学习</h1>
        <p className="mt-1 text-sm text-muted-foreground">选择词汇书开始学习</p>
      </div>
      <div className="px-5 pb-24 space-y-3">
        {data.books.map(book => {
          const learned = data.learnedCounts[book.id] || 0;
          const progress = book.wordCount > 0 ? Math.round((learned / book.wordCount) * 100) : 0;
          return (
            <Link
              key={book.id}
              href={`/vocab/book/${book.id}`}
              className="block rounded-xl border border-border bg-white p-4 transition-all active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${book.color} text-2xl`}>
                  {book.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{book.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{book.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{book.wordCount} 词</span>
                    <span>·</span>
                    <span>已学 {learned}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground mt-1" />
              </div>
            </Link>
          );
        })}
        {data.books.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">暂无词汇书</div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
