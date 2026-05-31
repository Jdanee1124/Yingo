"use client";
import { BottomNav } from "@/components/layout/BottomNav";
import Link from "next/link";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { BookMarked, BookOpen, PenTool, Flame, Target, TrendingUp, Headphones, ChevronRight, Search, Volume2, X } from "lucide-react";
import { getWordBooks, getWordsByBookId } from "@/lib/books";
import { speakWord } from "@/lib/tts";
import { getVocabProgresses, getUserProfile } from "@/lib/storage";

function getAllWords() { const books = getWordBooks(); let all: any[] = []; books.forEach(b => { all = all.concat(getWordsByBookId(b.id)); }); return all; }

function getInitialStats() {
  const books = getWordBooks();
  const total = books.reduce((sum, b) => sum + b.wordCount, 0);
  const progress = getVocabProgresses();
  const learned = progress.filter(p => p.repetitions > 0).length;
  const profile = getUserProfile();
  return { total, learned, streak: profile.streakDays || 0 };
}

export default function HomePage() {
  const stats = getInitialStats();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const allWords = useMemo(() => getAllWords(), []);
  const searchRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return allWords.filter(w =>
      w.word.toLowerCase().includes(q) ||
      w.meaning.includes(q) ||
      (w.meaningEn && w.meaningEn.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [query, allWords]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pb-8 pt-12 text-white">
        <h1 className="text-2xl font-bold">Yingo</h1>
        <p className="mt-1 text-sm text-blue-100">学英语，改变自己</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-white/15 p-3 text-center">
            <Flame className="mx-auto h-5 w-5 text-orange-300" />
            <p className="mt-1 text-lg font-bold">{stats.streak}</p>
            <p className="text-xs text-blue-100">连续天数</p>
          </div>
          <div className="rounded-xl bg-white/15 p-3 text-center">
            <Target className="mx-auto h-5 w-5 text-green-300" />
            <p className="mt-1 text-lg font-bold">{stats.learned}</p>
            <p className="text-xs text-blue-100">已学词汇</p>
          </div>
          <div className="rounded-xl bg-white/15 p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-yellow-300" />
            <p className="mt-1 text-lg font-bold">{stats.total}</p>
            <p className="text-xs text-blue-100">总词汇量</p>
          </div>
        </div>
      </div>
      <div ref={searchRef} className="px-5 -mt-4 relative z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索单词、中文释义..."
            value={query}
            onChange={e => { setQuery(e.target.value); setShowResults(e.target.value.trim().length > 0); }}
            onFocus={() => query.trim() && setShowResults(true)}
            className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-9 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button onClick={() => { setQuery(""); setShowResults(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-white shadow-lg z-20">
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">找到 {results.length} 个结果</div>
            {results.map(w => (
              <div key={w.id} className="flex items-center gap-3 px-3 py-2.5 border-b border-border/50 last:border-0 active:bg-muted/50">
                <button onClick={() => speakWord(w.word)} className="shrink-0 rounded-full bg-primary/10 p-1.5 text-primary">
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">{w.word}</span>
                    <span className="text-xs text-muted-foreground">{w.phonetic}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{w.meaning}</p>
                </div>
                <Link href="/vocab/book/ielts-core" className="shrink-0 text-xs text-primary">查看</Link>
              </div>
            ))}
          </div>
        )}
        {showResults && query.trim() && results.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border border-border bg-white shadow-lg z-20 p-4 text-center text-sm text-muted-foreground">
            没有找到匹配的单词
          </div>
        )}
      </div>
      <div className="px-5 mt-3">
        <div className="grid grid-cols-3 gap-3">
          <Link href="/vocab" className="rounded-xl bg-white p-4 shadow-sm border border-border text-center transition-all active:scale-95">
            <BookMarked className="mx-auto h-8 w-8 text-blue-500" />
            <p className="mt-2 font-medium text-sm">词汇学习</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stats.total} 核心词</p>
          </Link>
          <Link href="/reading" className="rounded-xl bg-white p-4 shadow-sm border border-border text-center transition-all active:scale-95">
            <BookOpen className="mx-auto h-8 w-8 text-green-500" />
            <p className="mt-2 font-medium text-sm">阅读练习</p>
            <p className="mt-0.5 text-xs text-muted-foreground">限时刷题</p>
          </Link>
          <Link href="/writing" className="rounded-xl bg-white p-4 shadow-sm border border-border text-center transition-all active:scale-95">
            <PenTool className="mx-auto h-8 w-8 text-purple-500" />
            <p className="mt-2 font-medium text-sm">写作批改</p>
            <p className="mt-0.5 text-xs text-muted-foreground">AI评分</p>
          </Link>
        </div>
      </div>
      <div className="px-5 mt-3">
        <Link href="/pronunciation" className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-border transition-all active:scale-[0.98]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-2xl">
            <Headphones className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">音标发音</p>
            <p className="mt-0.5 text-xs text-muted-foreground">元音辅音 · 雅思发音技巧 · 学习方法</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      </div>
      <div className="px-5 mt-6">
        <h2 className="text-base font-semibold">今日推荐</h2>
        <div className="mt-3 rounded-xl border border-border bg-white p-4">
          <p className="text-sm text-muted-foreground">开始你的第一次词汇学习</p>
          <Link href="/vocab" className="mt-3 block rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-all active:scale-95">开始学习</Link>
        </div>
      </div>
      <BottomNav />
    </>
  );
}


