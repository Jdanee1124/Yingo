"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const article = {
  title: "The Impact of Technology on Education",
  content: `The integration of technology into education has fundamentally transformed how students learn and teachers instruct. Over the past decade, digital tools have moved from being supplementary resources to becoming central components of the learning experience.\n\nOne of the most significant changes has been the shift towards online learning platforms. These platforms enable students to access educational materials from anywhere in the world, breaking down geographical barriers that once limited educational opportunities. During the COVID-19 pandemic, this shift accelerated dramatically.\n\nHowever, the adoption of technology in education is not without challenges. Not all students have equal access to digital devices and reliable internet connections, creating a digital divide that can exacerbate existing educational inequalities.\n\nThe key lies in finding the right balance between technology and traditional teaching methods, ensuring that digital tools enhance rather than replace the human elements of education.`,
  questions: [
    { id: "q1", type: "tfng" as const, question: "Technology has completely replaced traditional teaching methods.", answer: "false" },
    { id: "q2", type: "tfng" as const, question: "Online learning platforms emerged only during the COVID-19 pandemic.", answer: "false" },
    { id: "q3", type: "tfng" as const, question: "The digital divide affects equal access to education.", answer: "true" },
    { id: "q4", type: "mcq" as const, question: "What is a benefit of adaptive learning systems?", options: ["Replace teachers", "Personalize learning", "Eliminate homework", "Reduce class size"], answer: "Personalize learning" },
    { id: "q5", type: "mcq" as const, question: "What does the author suggest about educational technology?", options: ["Replace traditional methods", "Ban in schools", "Complement traditional teaching", "Too expensive"], answer: "Complement traditional teaching" },
  ],
};

export default function ReadingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAns = (id: string, v: string) => setAnswers(p => ({ ...p, [id]: v }));
  const score = submitted ? article.questions.filter(q => answers[q.id] === q.answer).length : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-4 py-3">
        <button onClick={() => router.back()} className="p-1"><ChevronLeft className="h-5 w-5" /></button>
        <span className="text-sm font-medium">阅读练习</span><div className="w-7" />
      </div>
      <div className="px-5 py-4">
        <h2 className="text-lg font-bold">{article.title}</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed">{article.content.split("\\n\\n").map((p, i) => <p key={i}>{p}</p>)}</div>
      </div>
      <div className="border-t border-border px-5 py-4">
        <h3 className="font-semibold">题目 ({article.questions.length} 题)</h3>
        <div className="mt-4 space-y-6">
          {article.questions.map((q, i) => (
            <div key={q.id} className={`rounded-xl border p-4 ${submitted ? (answers[q.id] === q.answer ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50") : "border-border"}`}>
              <p className="text-sm font-medium">{i + 1}. {q.question}</p>
              {q.type === "mcq" && q.options && <div className="mt-3 space-y-2">{q.options.map(o => (
                <label key={o} className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm cursor-pointer ${answers[q.id] === o ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" name={q.id} value={o} checked={answers[q.id] === o} onChange={() => setAns(q.id, o)} disabled={submitted} className="accent-primary" />{o}
                </label>
              ))}</div>}
              {q.type === "tfng" && <div className="mt-3 flex gap-2">{["true", "false", "not given"].map(o => (
                <button key={o} onClick={() => setAns(q.id, o)} disabled={submitted} className={`flex-1 rounded-lg border py-2 text-sm font-medium capitalize ${answers[q.id] === o ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{o}</button>
              ))}</div>}
              {submitted && answers[q.id] !== q.answer && <p className="mt-2 text-xs text-green-700">正确答案：{q.answer}</p>}
            </div>
          ))}
        </div>
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground active:scale-[0.98]">提交答案</button>
        ) : (
          <div className="mt-6 rounded-xl bg-muted p-4 text-center"><p className="text-lg font-bold">得分：{score} / {article.questions.length}</p><p className="mt-1 text-sm text-muted-foreground">正确率 {Math.round(score / article.questions.length * 100)}%</p></div>
        )}
      </div>
    </div>
  );
}