"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, BookMarked, PenTool, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "首页", icon: Home },
  { href: "/vocab", label: "词汇", icon: BookMarked },
  { href: "/reading", label: "阅读", icon: BookOpen },
  { href: "/writing", label: "写作", icon: PenTool },
  { href: "/profile", label: "我的", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={cn("flex flex-col items-center gap-0.5 text-xs transition-colors", active ? "text-primary font-medium" : "text-muted-foreground")}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}