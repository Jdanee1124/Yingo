const fs = require('fs');
const f = 'D:\\Claude cli\\MyApp\\yingo\\src\\app\\page.tsx';
let c = fs.readFileSync(f, 'utf-8');

// Add imports
c = c.replace(
  'import { BookMarked, BookOpen, PenTool, Flame, Target, TrendingUp, Headphones, ChevronRight } from "lucide-react";',
  'import { BookMarked, BookOpen, PenTool, Flame, Target, TrendingUp, Headphones, ChevronRight, Search, Volume2, X } from "lucide-react";'
);
c = c.replace(
  'import { getWordBooks } from "@/lib/books";',
  'import { getWordBooks, getWordsByBookId } from "@/lib/books";\nimport { speakWord } from "@/lib/tts";'
);
c = c.replace(
  'import Link from "next/link";',
  'import Link from "next/link";\nimport { useState, useCallback, useMemo, useRef, useEffect } from "react";'
);

// Add allWords helper
c = c.replace(
  'function getInitialStats() {',
  'function getAllWords() { const books = getWordBooks(); let all: any[] = []; books.forEach(b => { all = all.concat(getWordsByBookId(b.id)); }); return all; }\n\nfunction getInitialStats() {'
);

// Add state declarations after getInitialStats
c = c.replace(
  'export default function HomePage() {\n  const stats = getInitialStats();',
  'export default function HomePage() {\n  const stats = getInitialStats();\n  const [query, setQuery] = useState("");\n  const [showResults, setShowResults] = useState(false);\n  const allWords = useMemo(() => getAllWords(), []);\n  const searchRef = useRef<HTMLDivElement>(null);\n\n  const results = useMemo(() => {\n    if (!query.trim()) return [];\n    const q = query.toLowerCase().trim();\n    return allWords.filter(w =>\n      w.word.toLowerCase().includes(q) ||\n      w.meaning.includes(q) ||\n      (w.meaningEn && w.meaningEn.toLowerCase().includes(q))\n    ).slice(0, 20);\n  }, [query, allWords]);\n\n  useEffect(() => {\n    const handler = (e: MouseEvent) => {\n      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);\n    };\n    document.addEventListener("mousedown", handler);\n    return () => document.removeEventListener("mousedown", handler);\n  }, []);'
);

// Add search bar after blue header, before nav cards
const searchUI = `
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
      </div>`;

c = c.replace(
  '      </div>\n      <div className="px-5 -mt-3">',
  '      </div>' + searchUI + '\n      <div className="px-5 mt-3">'
);

fs.writeFileSync(f, c, 'utf-8');
console.log('Done, length: ' + c.length);
