"use client";
import { Suspense } from "react";
import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { getWordsByBookId, getWordBookById } from "@/lib/books";
import { calculateSM2, createProgress, getMasteryLevel } from "@/lib/sm2";
import { getVocabProgress, saveVocabProgress, getToday, updateDailyStats, getDailyStats } from "@/lib/storage";
import { speakWord, speakSentence } from "@/lib/tts";
import type { VocabProgress, VocabWord, WordBook } from "@/types";

function VocabLearnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("book") || "ielts-core";

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [words, setWords] = useState<VocabWord[]>([]);
  const [progresses, setProgresses] = useState<Map<string, VocabProgress>>(new Map());
  const [stats, setStats] = useState({ newWords: 0, reviewed: 0, correct: 0, incorrect: 0 });
  const [finished, setFinished] = useState(false);
  const [book, setBook] = useState<WordBook | null>(null);

  useEffect(() => {
    const b = getWordBookById(bookId);
    if (b) setBook(b);
    const bookWords = getWordsByBookId(bookId);
    const all = new Map<string, VocabProgress>();
    bookWords.forEach(w => { const p = getVocabProgress(w.id); if (p) all.set(w.id, p); });
    setProgresses(all);
    const now = Date.now();
    const due = bookWords.filter(w => { const p = all.get(w.id); return p && p.nextReview <= now; });
    const newW = bookWords.filter(w => !all.has(w.id));
    const ts = getDailyStats(getToday());
    setWords([...due.slice(0, 30 - ts.reviewed), ...newW.slice(0, 20 - ts.newWords)]);
    setStats(ts);
  }, [bookId]);

  const word = words[idx];
  const flip = useCallback(() => setFlipped(!flipped), [flipped]);

  const rate = useCallback((q: number) => {
    if (!word) return;
    const exist = progresses.get(word.id) || createProgress(word.id, bookId);
    const upd = calculateSM2(exist, q);
    saveVocabProgress(upd);
    const np = new Map(progresses); np.set(word.id, upd); setProgresses(np);
    const isNew = !progresses.has(word.id);
    const today = getToday();
    updateDailyStats(today, {
      newWords: stats.newWords + (isNew ? 1 : 0),
      reviewed: stats.reviewed + 1,
      correct: stats.correct + (q >= 3 ? 1 : 0),
      incorrect: stats.incorrect + (q < 3 ? 1 : 0),
    });
    setFlipped(false);
    if (idx < words.length - 1) setIdx(idx + 1); else setFinished(true);
  }, [word, idx, words.length, progresses, stats, bookId]);

  const speak = useCallback(() => {
    if (!word) return;
    speakWord(word.word);
  }, [word]);

  const speakExample = useCallback(() => {
    if (!word?.example) return;
    speakSentence(word.example);
  }, [word]);

  if (words.length === 0) return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <p className="text-muted-foreground">今日学习已完成 🎉</p>
      <button onClick={() => router.push(`/vocab/book/${bookId}`)} className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">返回词汇书</button>
    </div>
  );

  if (finished) return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5">
      <p className="text-4xl">🎉</p>
      <h2 className="mt-3 text-xl font-bold">今日学习完成！</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        今日学习 {stats.newWords + stats.reviewed} 词，正确率 {stats.reviewed > 0 ? Math.round(stats.correct / (stats.correct + stats.incorrect) * 100) : 0}%
      </p>
      <button onClick={() => router.push(`/vocab/book/${bookId}`)} className="mt-6 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground">返回词汇书</button>
    </div>
  );

  const mastery = getMasteryLevel(progresses.get(word?.id || "") || createProgress(word?.id || "", bookId));

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-4 pt-12 pb-2">
        <button onClick={() => router.back()} className="p-2"><ChevronLeft className="h-5 w-5" /></button>
        <span className="text-sm text-muted-foreground">{book?.name} · {idx + 1} / {words.length}</span>
        <div className="w-9" />
      </div>
      <div className="mx-5 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${((idx + 1) / words.length) * 100}%` }} />
      </div>
      <div className="flex flex-1 items-center justify-center px-5">
        <div onClick={flip} className={`card-flip w-full cursor-pointer ${flipped ? "flipped" : ""}`}>
          <div className="card-flip-inner relative w-full" style={{ minHeight: "360px" }}>
            <div className="card-flip-front absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold">{word?.word}</p>
              <p className="mt-2 text-lg text-muted-foreground">{word?.phonetic}</p>
              <button onClick={e => { e.stopPropagation(); speak(); }} className="mt-4 rounded-full bg-muted p-3 active:scale-95"><Volume2 className="h-5 w-5" /></button>
              <p className="mt-4 text-sm text-muted-foreground">点击翻转查看释义</p>
            </div>
            <div className="card-flip-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold">{word?.meaning}</p>
              {word?.meaningEn && <p className="mt-2 text-sm text-muted-foreground italic">{word.meaningEn}</p>}
              {word?.example && (
                <div className="mt-4 w-full rounded-lg bg-muted/50 p-3">
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-sm leading-relaxed">{word.example}</p>
                    <button onClick={e => { e.stopPropagation(); speakExample(); }} className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-2 active:scale-95" title="播放例句"><Volume2 className="h-4 w-4 text-primary" /></button>
                  </div>
                  {word.exampleTranslation && <p className="mt-1.5 text-xs text-muted-foreground">{word.exampleTranslation}</p>}
                </div>
              )}
              {word?.roots && <p className="mt-3 text-xs text-blue-600">词根：{word.roots}</p>}
              {word?.association && <p className="mt-1 text-xs text-orange-600">{word.association}</p>}
              <p className="mt-3 text-xs text-muted-foreground">掌握度 {mastery}%</p>
            </div>
          </div>
        </div>
      </div>
      {flipped && (
        <div className="px-5 pb-8">
          <p className="mb-3 text-center text-sm text-muted-foreground">这个词你记住了吗？</p>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => rate(1)} className="rounded-xl bg-red-50 py-3 text-sm font-medium text-red-600 active:scale-95">忘了</button>
            <button onClick={() => rate(3)} className="rounded-xl bg-orange-50 py-3 text-sm font-medium text-orange-600 active:scale-95">模糊</button>
            <button onClick={() => rate(4)} className="rounded-xl bg-green-50 py-3 text-sm font-medium text-green-600 active:scale-95">记住了</button>
            <button onClick={() => rate(5)} className="rounded-xl bg-blue-50 py-3 text-sm font-medium text-blue-600 active:scale-95">很简单</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VocabLearnPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">加载中...</p></div>}>
      <VocabLearnContent />
    </Suspense>
  );
}

