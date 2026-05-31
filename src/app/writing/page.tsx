"use client";
import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Clock, FileText } from "lucide-react";

const tasks = [
  { id: "w001", type: "task2" as const, title: "Some people believe university students should be required to attend classes, while others think it should be optional. Discuss both views.", timeLimit: 40, minWords: 250 },
  { id: "w002", type: "task2" as const, title: "In many countries, the gap between rich and poor is increasing. What problems does this cause? What solutions can you suggest?", timeLimit: 40, minWords: 250 },
  { id: "w003", type: "task1" as const, title: "The chart below shows the percentage of people in different age groups who used social media in 2024. Summarize the information.", timeLimit: 20, minWords: 150 },
];

export default function WritingPage() {
  const [sel, setSel] = useState<string | null>(null);
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const task = tasks.find(t => t.id === sel);
  const wc = essay.trim().split(/\s+/).filter(Boolean).length;

  const submit = () => {
    if (!essay.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(`AI 评分参考（仅供参考，非官方评分）\n\n预估分数：6.0-6.5\n\nTask Response - 你回应了题目要求，建议加入更具体的例子\nCoherence - 段落结构基本清晰，建议多用连接词\nLexical Resource - 使用了一些高级词汇，建议多用同义替换\nGrammar - 句式有一定变化，注意时态一致性\n\n当前字数：${wc}\n建议：多读高分范文，写完后留2-3分钟检查语法`);
      setLoading(false);
    }, 1500);
  };

  if (task) return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-4 py-3">
        <button onClick={() => { setSel(null); setResult(null); setEssay(""); }} className="text-sm text-primary">返回</button>
        <span className="text-sm font-medium">{task.type === "task1" ? "Task 1" : "Task 2"}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{task.timeLimit}分钟</div>
      </div>
      <div className="px-5 py-4"><p className="text-sm leading-relaxed">{task.title}</p><p className="mt-2 text-xs text-muted-foreground">至少 {task.minWords} 词</p></div>
      <div className="px-5"><textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder="在此输入你的作文..." disabled={loading} className="min-h-[300px] w-full rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed outline-none focus:border-primary resize-none" />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground"><span>字数：{wc}</span><span>目标：{task.minWords}+</span></div>
      </div>
      <div className="px-5 py-4">
        {!result ? (
          <button onClick={submit} disabled={!essay.trim() || wc < 50 || loading} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground active:scale-[0.98] disabled:opacity-50">{loading ? "AI 正在批改..." : "提交批改"}</button>
        ) : (
          <div className="rounded-xl border border-border bg-white p-4"><div className="whitespace-pre-wrap text-sm">{result}</div></div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="px-5 pt-12 pb-4"><h1 className="text-xl font-bold">写作练习</h1><p className="mt-1 text-sm text-muted-foreground">AI 辅助批改</p></div>
      <div className="px-5 pb-24 space-y-3">
        {tasks.map(t => (
          <button key={t.id} onClick={() => setSel(t.id)} className="w-full rounded-xl border border-border bg-white p-4 text-left active:scale-[0.98]">
            <div className="flex items-start gap-3"><FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div>
              <div className="flex items-center gap-2"><span className="text-xs font-medium text-primary">{t.type === "task1" ? "Task 1" : "Task 2"}</span><span className="text-xs text-muted-foreground">{t.timeLimit}分钟 {t.minWords}+词</span></div>
              <p className="mt-1.5 text-sm leading-relaxed line-clamp-2">{t.title}</p>
            </div></div>
          </button>
        ))}
      </div>
      <BottomNav />
    </>
  );
}