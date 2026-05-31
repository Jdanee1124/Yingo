"use client";
import { useState, useEffect } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getWordBookById, getWordsByBookId } from "@/lib/books";
import { detectCategory, CATEGORY_LABELS, CATEGORY_ICONS, CATEGORY_COLORS, type VocabCategory } from "@/lib/categories";
import type { VocabWord, WordBook } from "@/types";

export default function BookDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const bookId = (routeParams?.bookId as string) || "ielts-core";
  const [book, setBook] = useState<WordBook | null>(null);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "core" | "advanced">("all");
  const [catFilter, setCatFilter] = useState<VocabCategory>("all");

  useEffect(() => {
    const b = getWordBookById(bookId);
    if (b) {
      setBook(b);
      setWords(getWordsByBookId(bookId));
    }
  }, [bookId]);

  const filtered = words.filter(w => {
    const matchSearch = search === "" || w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.includes(search);
    const matchLevel = levelFilter === "all" || w.level === levelFilter;
    const matchCat = catFilter === "all" || detectCategory(w) === catFilter;
    return matchSearch && matchLevel && matchCat;
  });

  // Count categories
  const catCounts: Record<string, number> = { all: words.length };
  words.forEach(w => {
    const cat = detectCategory(w);
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  if (!book) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">加载中...</p>
    </div>
  );

  return (
    <>
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => router.back()} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{book.icon}</span>
            <h1 className="text-xl font-bold">{book.name}</h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{book.description}</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索单词或中文释义..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
        {/* Level filter */}
        <div className="mt-3 flex gap-2">
          {(["all", "core", "advanced"] as const).map(f => (
            <button
              key={f}
              onClick={() => setLevelFilter(f)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                levelFilter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {f === "all" ? "全部" : f === "core" ? "核心词" : "进阶词"}
            </button>
          ))}
        </div>
        {/* Category filter - horizontal scroll */}
        <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {(Object.keys(CATEGORY_LABELS) as VocabCategory[]).map(cat => {
            const count = catCounts[cat] || 0;
            if (cat !== "all" && count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  catFilter === cat
                    ? "bg-primary text-primary-foreground"
                    : CATEGORY_COLORS[cat]
                }`}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                <span>{CATEGORY_LABELS[cat]}</span>
                <span className="opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-5 pb-24">
        <Link
          href={`/vocab/learn?book=${bookId}`}
          className="mb-4 block rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-all active:scale-95"
        >
          开始学习（{filtered.length} 词）
        </Link>
        <div className="text-xs text-muted-foreground mb-2">共 {filtered.length} 个单词</div>
        <div className="divide-y divide-border rounded-xl border border-border bg-white">
          {filtered.map(word => {
            const cat = detectCategory(word);
            return (
              <div key={word.id} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{word.word}</span>
                    <span className="text-xs text-muted-foreground">{word.phonetic}</span>
                    {cat !== "all" && (
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[cat]}`}>
                        {CATEGORY_ICONS[cat]}{CATEGORY_LABELS[cat]}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{word.meaning}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">没有找到匹配的单词</div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
