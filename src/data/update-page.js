const fs = require('fs');
const f = 'D:\\Claude cli\\MyApp\\yingo\\src\\app\\pronunciation\\page.tsx';
let c = fs.readFileSync(f, 'utf-8');

// 1. Add reading tips import
c = c.replace(
  'import { techniques, type Technique } from "@/data/techniques";',
  'import { techniques, type Technique } from "@/data/techniques";\nimport { readingTips, type ReadingTip } from "@/data/reading-tips";'
);

// 2. Add reading to tab type  
c = c.replace(
  '"techniques"',
  '"techniques" | "reading"'
);

// 3. Add reading tab button
c = c.replace(
  '{ key: "techniques" as const, label: "口语技巧", count: 0 }',
  '{ key: "techniques" as const, label: "口语技巧", count: 0 },\n          { key: "reading" as const, label: "单词品读", count: 0 }'
);

// 4. Add ReadingSection component
const readingComp = `
function ReadingSection({ tip }: { tip: ReadingTip }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between p-4 text-left">
        <div className="flex items-center gap-2"><span className="text-lg">{tip.icon}</span><p className="font-medium text-sm">{tip.title}</p></div>
        <span className="text-muted-foreground text-xs">{expanded ? "收起" : "展开"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tip.content}</p>
          <div className="space-y-2">
            {tip.examples.map((ex, i) => (
              <div key={i} className="rounded-lg bg-muted/50 p-2.5">
                <span className="text-sm font-mono font-medium text-primary">{ex.word}</span>
                <p className="text-xs text-muted-foreground mt-1">{ex.rule}</p>
                <p className="text-xs text-blue-600 mt-0.5">→ {ex.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
`;
c = c.replace('function TechniqueSection', readingComp + '\nfunction TechniqueSection');

// 5. Add reading tab rendering in the ternary
// Find the techniques content closing and add reading tab
const techMapStr = '{techniques.map((t, i) => <TechniqueSection key={i} tech={t} />)}';
const techMapIdx = c.indexOf(techMapStr);
if (techMapIdx > 0) {
  // Find the </div> that closes the techniques section
  let depth = 0;
  let searchStart = techMapIdx;
  let closeIdx = -1;
  for (let i = techMapIdx; i < c.length; i++) {
    if (c.substring(i, i + 5) === '<div' && (i === 0 || c[i-1] !== '{')) depth++;
    if (c.substring(i, i + 6) === '</div>') {
      depth--;
      if (depth === 0) { closeIdx = i + 6; break; }
    }
  }
  
  if (closeIdx > 0) {
    const readingTab = `
        ) : activeTab === "reading" ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-1">不看音标也能读 · 英语拼读规则大全</p>
            {readingTips.map((t, i) => <ReadingSection key={i} tip={t} />)}
          </div>`;
    c = c.substring(0, closeIdx) + readingTab + c.substring(closeIdx);
  }
}

fs.writeFileSync(f, c, 'utf-8');
console.log('Done, length: ' + c.length);
