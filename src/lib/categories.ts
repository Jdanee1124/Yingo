// IELTS topic categories for vocabulary filtering
export type VocabCategory = 
  | "all" | "education" | "environment" | "health" | "technology" 
  | "economy" | "society" | "law" | "science" | "psychology" | "politics";

export const CATEGORY_LABELS: Record<VocabCategory, string> = {
  all: "全部",
  education: "教育",
  environment: "环境",
  health: "健康",
  technology: "科技",
  economy: "经济",
  society: "社会",
  law: "法律",
  science: "科学",
  psychology: "心理",
  politics: "政治",
};

export const CATEGORY_ICONS: Record<VocabCategory, string> = {
  all: "📋",
  education: "🎓",
  environment: "🌿",
  health: "🏥",
  technology: "💻",
  economy: "📊",
  society: "👥",
  law: "⚖️",
  science: "🔬",
  psychology: "🧠",
  politics: "🏛️",
};

export const CATEGORY_COLORS: Record<VocabCategory, string> = {
  all: "bg-gray-100 text-gray-700",
  education: "bg-blue-100 text-blue-700",
  environment: "bg-green-100 text-green-700",
  health: "bg-red-100 text-red-700",
  technology: "bg-purple-100 text-purple-700",
  economy: "bg-yellow-100 text-yellow-700",
  society: "bg-pink-100 text-pink-700",
  law: "bg-indigo-100 text-indigo-700",
  science: "bg-cyan-100 text-cyan-700",
  psychology: "bg-orange-100 text-orange-700",
  politics: "bg-slate-100 text-slate-700",
};

export function detectCategory(word: { meaning: string; meaningEn?: string }): VocabCategory {
  const m = (word.meaning + " " + (word.meaningEn || "")).toLowerCase();
  if (/教育|school|student|learn|teach|educat|curriculum|academic|classroom|university|college|degree|lecture|tuition|scholar/.test(m)) return "education";
  if (/环境|environ|climate|ecolog|nature|forest|pollut|sustain|green|energy|wildlife|biodivers|conservation|recycl/.test(m)) return "environment";
  if (/健康|health|disease|medic|hospital|patient|physical|mental|well-being|nutrition|diet|exercise|therapy|symptom|treatment|diagnos/.test(m)) return "health";
  if (/技术|technolog|digital|comput|automat|robot|artificial|machine|software|hardware|internet|cyber|data|algorithm|innovat/.test(m)) return "technology";
  if (/经济|econom|financ|market|trade|business|commercial|invest|budget|inflation|recession|revenue|profit|tax|salary|wage/.test(m)) return "economy";
  if (/社会|social|communit|culture|divers|equal|poverty|welfare|demographic|population|urban|rural|migration|immigra/.test(m)) return "society";
  if (/法律|law|legal|regulat|legislat|enforce|justice|court|judge|rights|constitut|penalty|crime|criminal|prosecut/.test(m)) return "law";
  if (/科学|research|scientif|experiment|evidence|hypothesis|laboratory|theory|chemical|physics|biology|genetic|DNA/.test(m)) return "science";
  if (/心理|cognit|behavio|emotion|psycholog|stress|anxiety|perception|memory|attention|motivation|personality|attitude/.test(m)) return "psychology";
  if (/政治|govern|democrac|parliament|authorit|election|politic|vote|campaign|ideology|reform|policy|administra/.test(m)) return "politics";
  return "all";
}

export function getCategoriesForWords(words: { meaning: string; meaningEn?: string }[]): Record<VocabCategory, number> {
  const counts: Record<string, number> = {};
  words.forEach(w => {
    const cat = detectCategory(w);
    counts[cat] = (counts[cat] || 0) + 1;
  });
  counts.all = words.length;
  return counts as Record<VocabCategory, number>;
}
