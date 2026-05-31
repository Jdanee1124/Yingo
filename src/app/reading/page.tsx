"use client";
import { BottomNav } from "@/components/layout/BottomNav";
import { Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

const articles = [
  { id: "r001", title: "The Impact of Technology on Education", level: "intermediate" as const, section: 3, questionCount: 5, timeLimit: 20 },
  { id: "r002", title: "Urban Planning and Sustainable Cities", level: "intermediate" as const, section: 2, questionCount: 5, timeLimit: 15 },
  { id: "r003", title: "The Psychology of Language Learning", level: "advanced" as const, section: 4, questionCount: 5, timeLimit: 25 },
];
const ll = { basic: "基础", intermediate: "中级", advanced: "高级" };
const lc = { basic: "text-green-600 bg-green-50", intermediate: "text-blue-600 bg-blue-50", advanced: "text-red-600 bg-red-50" };

export default function ReadingPage() {
  return (
    <>
      <div className="px-5 pt-12 pb-4"><h1 className="text-xl font-bold">阅读练习</h1><p className="mt-1 text-sm text-muted-foreground">限时练习，提升阅读速度</p></div>
      <div className="px-5 pb-24 space-y-3">
        {articles.map(a => (
          <Link key={a.id} href={`/reading/${a.id}`} className="block rounded-xl border border-border bg-white p-4 transition-all active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1"><h3 className="font-medium">{a.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className={`rounded-full px-2 py-0.5 ${lc[a.level]}`}>{ll[a.level]}</span>
                  <span>Section {a.section}</span><span>{a.questionCount} 题</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.timeLimit} 分钟</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
      <BottomNav />
    </>
  );
}