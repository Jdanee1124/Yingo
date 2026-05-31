"use client";
import { BottomNav } from "@/components/layout/BottomNav";
import { User, Target, Calendar, BookMarked, BookOpen, PenTool, ChevronRight, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserProfile, getVocabProgresses } from "@/lib/storage";
import type { UserProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wc, setWc] = useState(0);
  useEffect(() => { setProfile(getUserProfile()); setWc(getVocabProgresses().length); }, []);

  return (
    <>
      <div className="px-5 pt-12 pb-4"><h1 className="text-xl font-bold">我的</h1></div>
      <div className="px-5">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"><User className="h-7 w-7 text-primary" /></div>
          <div><p className="font-medium">{profile?.name || "Yingo 用户"}</p><p className="text-sm text-muted-foreground">目标分数：{profile?.targetScore || "6.5"}</p></div>
        </div>
      </div>
      <div className="px-5 mt-4">
        <h2 className="text-sm font-medium text-muted-foreground">学习统计</h2>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {[{ icon: BookMarked, color: "text-blue-500", label: "已学词汇", value: wc }, { icon: Calendar, color: "text-orange-500", label: "连续天数", value: profile?.streakDays || 0 }, { icon: BookOpen, color: "text-green-500", label: "阅读篇数", value: profile?.totalReadingDone || 0 }, { icon: PenTool, color: "text-purple-500", label: "写作篇数", value: profile?.totalWritingDone || 0 }].map(({ icon: Icon, color, label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-white p-4"><Icon className={`h-5 w-5 ${color}`} /><p className="mt-2 text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
          ))}
        </div>
      </div>
      <div className="px-5 mt-6">
        <div className="rounded-xl border border-border bg-white divide-y divide-border">
          <button className="flex w-full items-center justify-between px-4 py-3"><div className="flex items-center gap-3"><Target className="h-5 w-5 text-muted-foreground" /><span className="text-sm">目标设置</span></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>
          <button className="flex w-full items-center justify-between px-4 py-3"><div className="flex items-center gap-3"><Settings className="h-5 w-5 text-muted-foreground" /><span className="text-sm">学习设置</span></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>
      <BottomNav />
    </>
  );
}