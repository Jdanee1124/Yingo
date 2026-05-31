"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Volume2, Grid3X3, List, Info, Play } from "lucide-react";
import { speakWord, speakSentence, getVoiceInfo } from "@/lib/tts";
import { techniques, type Technique } from "@/data/techniques";
import { readingTips, type ReadingTip } from "@/data/reading-tips";

interface PhoneData {
  symbol: string;
  label: string;
  soundWord: string;
  soundNote: string;
  examples: string;
  tip: string;
  mouth: string;
  tongue: string;
  stress: string;
  avoid: string;
}

const vowels: PhoneData[] = [
  { symbol: "/iː/", label: "长衣音", soundWord: "see", soundNote: "拉长 ee 音", examples: "see, free, agree, key", tip: "嘴巴微张呈微笑状，舌尖抵下齿，舌前部尽量抬高，拉长发音", mouth: "嘴角向两侧展开，像微笑", tongue: "舌前部抬高，接近硬腭", stress: "长元音，发音时间要比短音/i/长约一倍", avoid: "不要发成中文的\"衣\"，英语更紧、更高" },
  { symbol: "/ɪ/", label: "短衣音", soundWord: "sit", soundNote: "短促 ih 音", examples: "sit, big, system, children", tip: "嘴巴半开，舌前部稍抬，短促有力，不拉长", mouth: "嘴巴比/iː/略松，微张", tongue: "舌前部稍抬，比/iː/低一些", stress: "短促有力，不拖音", avoid: "不要和/iː/混淆，这个更短更松" },
  { symbol: "/e/", label: "诶音", soundWord: "bed", soundNote: "eh 音", examples: "bed, friend, education, any", tip: "嘴巴半开，舌中部稍抬，发音介于\"衣\"和\"啊\"之间", mouth: "嘴巴开合度中等", tongue: "舌中部稍抬，舌前部放平", stress: "中等长度，不要拖太长", avoid: "不要发成中文的\"诶\"，嘴型更小" },
  { symbol: "/æ/", label: "大口梅花音", soundWord: "cat", soundNote: "张大嘴 ah 音", examples: "cat, matter, challenge, map", tip: "嘴巴张大，舌前部低平压下，是英语最典型的元音之一", mouth: "嘴巴张大，上下齿距约一指宽", tongue: "舌前部压低，舌两侧抵上齿", stress: "长元音，要充分张嘴", avoid: "这是中国学生最难的元音，必须张大嘴，不是/e/" },
  { symbol: "/ɑː/", label: "长啊音", soundWord: "car", soundNote: "拉长 ah 音", examples: "car, garden, father, calm", tip: "嘴巴张大，舌后部抬高，声音从喉咙深处发出，拉长", mouth: "嘴巴张大呈圆形", tongue: "舌后部抬高，舌前部放低", stress: "长元音，充分拉长", avoid: "比中文\"啊\"更靠后，嘴更圆" },
  { symbol: "/ɒ/", label: "短哦音", soundWord: "hot", soundNote: "短促 oh 音", examples: "hot, knowledge, process, job", tip: "嘴巴圆张，舌后部稍抬，短促有力", mouth: "嘴唇收圆，微微前突", tongue: "舌后部稍抬高", stress: "短促有力", avoid: "不要和/ɔː/混淆，这个更短" },
  { symbol: "/ɔː/", label: "长哦音", soundWord: "call", soundNote: "拉长 aw 音", examples: "call, thought, morning, all", tip: "嘴巴圆张，舌后部抬高，拉长发音", mouth: "嘴唇收圆前突，比/ɒ/更圆", tongue: "舌后部抬高", stress: "长元音，充分拉长", avoid: "英音中嘴型比美音更圆更小" },
  { symbol: "/ʊ/", label: "短乌音", soundWord: "put", soundNote: "短促 oo 音", examples: "put, good, book, could", tip: "嘴巴微圆，舌后部稍抬，短促", mouth: "嘴唇微圆，不前突", tongue: "舌后部稍抬", stress: "短促，不拖音", avoid: "不要和/uː/混淆，更短更松" },
  { symbol: "/uː/", label: "长乌音", soundWord: "food", soundNote: "拉长 oo 音", examples: "food, room, opportunity, blue", tip: "嘴巴圆缩，舌后部抬高，拉长", mouth: "嘴唇收圆前突，像吹口哨", tongue: "舌后部尽量抬高", stress: "长元音，充分拉长", avoid: "比中文\"乌\"嘴更圆更突" },
  { symbol: "/ʌ/", label: "短阿音", soundWord: "cup", soundNote: "短促 uh 音", examples: "cup, enough, government, love", tip: "嘴巴半开，舌中部稍抬，短促有力，像被吓一跳的声音", mouth: "嘴巴半开，不圆唇", tongue: "舌中部稍抬", stress: "短促有力", avoid: "不是中文\"啊\"，嘴更小更短" },
  { symbol: "/ɜː/", label: "长额音", soundWord: "bird", soundNote: "拉长 er 音", examples: "bird, learn, work, word", tip: "嘴巴半开，舌中部抬高，拉长，英音中不卷舌", mouth: "嘴巴自然半开，不圆不展", tongue: "舌中部抬高，两侧抵上齿", stress: "长元音，充分拉长", avoid: "英音不卷舌！不要发成儿化音" },
  { symbol: "/ə/", label: "轻读额音", soundWord: "about", soundNote: "轻读 uh 音", examples: "about, system, support, sofa", tip: "嘴巴自然放松，舌平放，是最轻松的元音，常出现在非重读音节", mouth: "嘴巴自然放松，微微张开", tongue: "舌自然平放", stress: "永远出现在非重读音节，轻而短", avoid: "不要重读，这是弱读的核心元音" },
];

const diphthongs: PhoneData[] = [
  { symbol: "/eɪ/", label: "诶衣", soundWord: "day", soundNote: "eh→ih 滑动", examples: "day, make, rain, great", tip: "从/e/滑向/ɪ/，嘴巴从半开到收小，是双元音", mouth: "从半开滑向微合", tongue: "舌前部从中间滑向高位", stress: "前重后轻，/e/重读，/ɪ/轻滑", avoid: "不要发成单音，要有滑动感" },
  { symbol: "/aɪ/", label: "啊衣", soundWord: "my", soundNote: "ah→ih 滑动", examples: "time, like, my, life", tip: "从/ɑː/滑向/ɪ/，嘴巴从大张到收小", mouth: "从大张滑向微合", tongue: "舌前部从低位滑向高位", stress: "前重后轻，滑动要明显", avoid: "不要发成\"啊衣\"两个字，要连滑" },
  { symbol: "/ɔɪ/", label: "哦衣", soundWord: "boy", soundNote: "oh→ih 滑动", examples: "boy, choice, enjoy, voice", tip: "从/ɒ/滑向/ɪ/，嘴巴从圆张到收小", mouth: "从圆唇滑向不圆唇", tongue: "舌后部滑向前部高位", stress: "前重后轻", avoid: "滑动要自然，不要断开" },
  { symbol: "/aʊ/", label: "啊乌", soundWord: "now", soundNote: "ah→oo 滑动", examples: "now, house, about, down", tip: "从/ɑː/滑向/ʊ/，嘴巴从大张到圆缩", mouth: "从大张滑向圆缩", tongue: "舌从低位滑向后高位", stress: "前重后轻", avoid: "结尾嘴要收圆" },
  { symbol: "/əʊ/", label: "额乌", soundWord: "go", soundNote: "uh→oo 滑动", examples: "go, home, know, show", tip: "从/ə/滑向/ʊ/，嘴巴从自然到圆缩", mouth: "从自然滑向圆唇", tongue: "舌从中位滑向后高位", stress: "前重后轻", avoid: "英音起点更靠后，嘴更圆" },
  { symbol: "/ɪə/", label: "衣额", soundWord: "here", soundNote: "ih→uh 滑动", examples: "here, near, beer, clear", tip: "从/ɪ/滑向/ə/，嘴巴从微合到自然放松", mouth: "从微合滑向自然", tongue: "舌前部滑向中央", stress: "前重后轻", avoid: "不要卷舌，英音末尾是/ə/" },
  { symbol: "/eə/", label: "诶额", soundWord: "there", soundNote: "eh→uh 滑动", examples: "there, care, air, share", tip: "从/e/滑向/ə/，嘴巴从半开到自然", mouth: "从半开滑向自然", tongue: "舌从中间滑向中央", stress: "前重后轻", avoid: "不要发成\"air\"的美式卷舌" },
  { symbol: "/ʊə/", label: "乌额", soundWord: "tour", soundNote: "oo→uh 滑动", examples: "tour, poor, sure, jury", tip: "从/ʊ/滑向/ə/，嘴巴从圆缩到自然", mouth: "从圆唇滑向自然", tongue: "舌后部滑向中央", stress: "前重后轻", avoid: "较少见，注意不要卷舌" },
];

const consonants: PhoneData[] = [
  { symbol: "/p/", label: "泼", soundWord: "pie", soundNote: "送气清音", examples: "pen, paper, happy", tip: "双唇紧闭后突然打开，气流冲出，声带不振动", mouth: "双唇紧闭后弹开", tongue: "舌自然平放", stress: "词首送气强，词尾送气弱", avoid: "不要加元音变成\"泼额\"" },
  { symbol: "/b/", label: "波", soundWord: "buy", soundNote: "浊音不送气", examples: "bed, table, job", tip: "双唇紧闭后打开，声带振动，不送气", mouth: "双唇紧闭后弹开", tongue: "舌自然平放", stress: "声带振动，不送气", avoid: "不要和/p/混淆，/b/浊音要振动" },
  { symbol: "/t/", label: "特", soundWord: "tea", soundNote: "清脆弹舌", examples: "tea, water, little", tip: "舌尖抵上齿龈后弹开，声带不振动", mouth: "嘴巴微张", tongue: "舌尖抵上齿龈后弹开", stress: "词首送气，词尾轻弹", avoid: "英音中/t/要清晰，不像美音弹舌" },
  { symbol: "/d/", label: "得", soundWord: "day", soundNote: "浊音弹舌", examples: "dog, idea, played", tip: "舌尖抵上齿龈后弹开，声带振动", mouth: "嘴巴微张", tongue: "舌尖抵上齿龈后弹开", stress: "浊音，声带振动", avoid: "不要和/t/混淆" },
  { symbol: "/k/", label: "克", soundWord: "key", soundNote: "送气清音", examples: "cat, back, quick", tip: "舌后部抵软腭后突然打开，声带不振动", mouth: "嘴巴微张", tongue: "舌后部抵软腭", stress: "词首送气强", avoid: "不要加元音变成\"克额\"" },
  { symbol: "/ɡ/", label: "哥", soundWord: "go", soundNote: "浊音不送气", examples: "go, big, dog", tip: "舌后部抵软腭后打开，声带振动", mouth: "嘴巴微张", tongue: "舌后部抵软腭", stress: "浊音，声带振动", avoid: "不要和/k/混淆" },
  { symbol: "/f/", label: "夫", soundWord: "fee", soundNote: "唇齿摩擦", examples: "fish, enough, photo", tip: "上齿轻触下唇，气流从唇齿间挤出，声带不振动", mouth: "上齿咬下唇", tongue: "舌自然平放", stress: "清音，不振动", avoid: "不要发成中文的\"夫\"" },
  { symbol: "/v/", label: "吾", soundWord: "vie", soundNote: "浊唇齿摩擦", examples: "very, have, view", tip: "上齿轻触下唇，气流从唇齿间挤出，声带振动", mouth: "上齿咬下唇", tongue: "舌自然平放", stress: "浊音，声带振动", avoid: "注意声带要振动" },
  { symbol: "/θ/", label: "咬舌清", soundWord: "think", soundNote: "舌尖咬舌", examples: "think, method, healthy", tip: "舌尖轻触上齿，气流从舌齿间挤出，声带不振动", mouth: "舌尖伸出轻触上齿", tongue: "舌尖放在上下齿之间", stress: "清音，不振动", avoid: "中国学生常错发成/s/，必须咬舌" },
  { symbol: "/ð/", label: "咬舌浊", soundWord: "this", soundNote: "浊咬舌", examples: "this, weather, another", tip: "舌尖轻触上齿，气流从舌齿间挤出，声带振动", mouth: "舌尖伸出轻触上齿", tongue: "舌尖放在上下齿之间", stress: "浊音，声带振动", avoid: "常错发成/z/，必须咬舌" },
  { symbol: "/s/", label: "丝", soundWord: "see", soundNote: "齿龈摩擦", examples: "see, city, glass", tip: "舌尖接近上齿龈，气流从舌面和齿龈间挤出，声带不振动", mouth: "嘴巴微张，嘴角稍展", tongue: "舌尖接近上齿龈", stress: "清音，摩擦音", avoid: "不要和/θ/混淆，/s/不咬舌" },
  { symbol: "/z/", label: "兹", soundWord: "zoo", soundNote: "浊齿龈摩擦", examples: "zoo, easy, please", tip: "舌尖接近上齿龈，气流从舌面和齿龈间挤出，声带振动", mouth: "嘴巴微张，嘴角稍展", tongue: "舌尖接近上齿龈", stress: "浊音，声带振动", avoid: "不要和/ð/混淆，/z/不咬舌" },
  { symbol: "/ʃ/", label: "嘘", soundWord: "she", soundNote: "腭龈摩擦", examples: "show, education, nation", tip: "舌前部抬向硬腭，气流从舌面和硬腭间挤出，声带不振动", mouth: "嘴唇微圆前突", tongue: "舌前部抬向硬腭", stress: "清音，摩擦音", avoid: "不要和/s/混淆，嘴型更圆" },
  { symbol: "/ʒ/", label: "浊嘘", soundWord: "measure", soundNote: "浊腭龈摩擦", examples: "vision, measure, decision", tip: "与/ʃ/相同位置，声带振动", mouth: "嘴唇微圆前突", tongue: "舌前部抬向硬腭", stress: "浊音，声带振动", avoid: "较少见，主要在法语借词中" },
  { symbol: "/h/", label: "喝", soundWord: "he", soundNote: "声门送气", examples: "hat, who, hello", tip: "气流从声门挤出，声带不振动，嘴巴自然张开", mouth: "嘴巴自然张开", tongue: "舌自然平放", stress: "清音，气息音", avoid: "不要和中文\"喝\"混淆，更轻更短" },
  { symbol: "/tʃ/", label: "吃", soundWord: "cheese", soundNote: "塞擦清音", examples: "teach, nature, question", tip: "舌尖抵上齿龈后部，先完全闭塞再放开，声带不振动", mouth: "嘴唇微圆前突", tongue: "舌尖抵上齿龈后部", stress: "清音，塞擦音", avoid: "不要拆成/t/+/ʃ/，要一次发出" },
  { symbol: "/dʒ/", label: "知", soundWord: "jeep", soundNote: "塞擦浊音", examples: "job, challenge, knowledge", tip: "与/tʃ/相同位置，声带振动", mouth: "嘴唇微圆前突", tongue: "舌尖抵上齿龈后部", stress: "浊音，塞擦音", avoid: "不要拆成/d/+/ʒ/，要一次发出" },
  { symbol: "/m/", label: "摸", soundWord: "me", soundNote: "双唇鼻音", examples: "man, time, summer", tip: "双唇紧闭，气流从鼻腔出，声带振动", mouth: "双唇紧闭", tongue: "舌自然平放", stress: "浊音，鼻音", avoid: "词尾要闭嘴，不要吞掉" },
  { symbol: "/n/", label: "呢", soundWord: "no", soundNote: "齿龈鼻音", examples: "no, ten, dinner", tip: "舌尖抵上齿龈，气流从鼻腔出，声带振动", mouth: "嘴巴微张", tongue: "舌尖抵上齿龈", stress: "浊音，鼻音", avoid: "词尾/n/要到位，不要吞掉" },
  { symbol: "/ŋ/", label: "后鼻音", soundWord: "sing", soundNote: "软腭鼻音", examples: "sing, think, long", tip: "舌后部抵软腭，气流从鼻腔出，声带振动", mouth: "嘴巴微张", tongue: "舌后部抵软腭", stress: "浊音，鼻音", avoid: "不要发成/n/+\"哥\"，是一个音" },
  { symbol: "/l/", label: "了", soundWord: "lee", soundNote: "齿龈边音", examples: "like, bell, people", tip: "舌尖抵上齿龈，气流从舌两侧出，声带振动", mouth: "嘴巴微张", tongue: "舌尖抵上齿龈", stress: "浊音，边音", avoid: "词尾的/dark l/舌后部也要抬高" },
  { symbol: "/r/", label: "英式r", soundWord: "read", soundNote: "近音不卷舌", examples: "real, environment, very", tip: "舌尖卷起但不触碰上腭，英音中不卷舌，嘴型微圆", mouth: "嘴唇微圆前突", tongue: "舌尖卷起但不触碰任何部位", stress: "浊音，近音", avoid: "英音不卷舌！和美音最大区别之一" },
  { symbol: "/w/", label: "我", soundWord: "we", soundNote: "半元音圆唇", examples: "will, quality, one", tip: "双唇圆缩后快速滑开发出，声带振动", mouth: "双唇圆缩后快速展开", tongue: "舌后部稍抬", stress: "浊音，半元音", avoid: "不要发成中文的\"我\"，更快更短" },
  { symbol: "/j/", label: "耶", soundWord: "yes", soundNote: "半元音腭化", examples: "yes, beautiful, student", tip: "舌前部抬向硬腭后快速滑开，声带振动", mouth: "嘴巴微张", tongue: "舌前部抬向硬腭后快速滑开", stress: "浊音，半元音", avoid: "不要发成中文的\"耶\"，更快更短" },
];

type ViewMode = "list" | "grid";

function PhoneCard({ phone, viewMode, isExpanded, onToggle }: { phone: PhoneData; viewMode: ViewMode; isExpanded: boolean; onToggle: () => void }) {
  const expanded = isExpanded;
  const [playingSymbol, setPlayingSymbol] = useState(false);
  const [playingExample, setPlayingExample] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playSymbol = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setPlayingSymbol(true);
    speakWord(phone.soundWord);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPlayingSymbol(false), 2000);
  }, [phone]);

  const playExample = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setPlayingExample(true);
    speakSentence(phone.examples.split(",")[0].trim());
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setPlayingExample(false), 3000);
  }, [phone]);

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  if (viewMode === "grid") {
    return (
      <div
        onClick={onToggle}
        className={`relative rounded-xl border transition-all duration-300 cursor-pointer select-none overflow-hidden ${
          expanded
            ? "border-primary bg-white shadow-lg col-span-2 row-span-2 z-10"
            : "border-border bg-white shadow-sm active:scale-95"
        }`}
      >
        {/* Symbol + play button */}
        <div className={`flex items-center justify-between ${expanded ? "p-4 pb-2" : "p-3"}`}>
          <div className="flex items-center gap-1.5">
            <span className={`${expanded ? "text-3xl" : "text-lg"} font-bold text-primary transition-all`}>{phone.symbol}</span>
            <span className={`${expanded ? "text-sm" : "text-[10px]"} text-muted-foreground`}>{phone.label}</span>
          </div>
          <button
            onClick={playSymbol}
            className={`rounded-full p-2 transition-all ${playingSymbol ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary"}`}
            title={`播放 ${phone.symbol} 的发音`}
          >
            <Play className="h-4 w-4" />
          </button>
        </div>

        {/* Sound note */}
        <div className={`${expanded ? "px-4" : "px-3"} pb-1`}>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2 py-0.5 text-[10px] text-primary">
            🔊 {phone.soundNote}
          </span>
        </div>

        {expanded ? (
          <div className="p-4 pt-2 space-y-2">
            <div className="rounded-lg bg-muted/50 p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">例词</p>
                <button onClick={playExample} className="rounded-full bg-primary/10 p-1 text-primary">
                  <Volume2 className="h-3 w-3" />
                </button>
              </div>
              <p className="text-sm">{phone.examples}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2.5">
              <p className="text-xs font-medium text-blue-700">🗣️ 口型</p>
              <p className="text-xs text-blue-600">{phone.mouth}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-2.5">
              <p className="text-xs font-medium text-green-700">👅 舌位</p>
              <p className="text-xs text-green-600">{phone.tongue}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-2.5">
              <p className="text-xs font-medium text-purple-700">⚡ 发音要领</p>
              <p className="text-xs text-purple-600">{phone.tip}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-2.5">
              <p className="text-xs font-medium text-amber-700">📏 重读/节奏</p>
              <p className="text-xs text-amber-600">{phone.stress}</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2.5">
              <p className="text-xs font-medium text-red-700">⚠️ 常见错误</p>
              <p className="text-xs text-red-600">{phone.avoid}</p>
            </div>
          </div>
        ) : (
          <p className="px-3 pb-3 text-xs text-muted-foreground truncate">{phone.examples.split(",")[0].trim()}</p>
        )}
      </div>
    );
  }

  // List view
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{phone.symbol}</span>
          <span className="text-xs text-muted-foreground">{phone.label}</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/5 px-1.5 py-0.5 text-[10px] text-primary">🔊 {phone.soundNote}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={playSymbol} className={`rounded-full p-2 transition-all ${playingSymbol ? "bg-primary text-white" : "bg-primary/10 text-primary"}`} title="播放音标发音">
            <Play className="h-4 w-4" />
          </button>
          <button onClick={playExample} className={`rounded-full p-2 transition-colors ${playingExample ? "bg-green-500 text-white" : "bg-green-50 text-green-600"}`} title="播放例词">
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">例词：{phone.examples}</p>
      <p className="mt-1 text-xs text-blue-600">{phone.tip}</p>
      {expanded && (
        <div className="mt-2 space-y-1.5 border-t border-border pt-2">
          <div className="flex gap-2"><span className="shrink-0 text-xs font-medium text-blue-600 w-14">口型</span><span className="text-xs text-muted-foreground">{phone.mouth}</span></div>
          <div className="flex gap-2"><span className="shrink-0 text-xs font-medium text-green-600 w-14">舌位</span><span className="text-xs text-muted-foreground">{phone.tongue}</span></div>
          <div className="flex gap-2"><span className="shrink-0 text-xs font-medium text-purple-600 w-14">重读</span><span className="text-xs text-muted-foreground">{phone.stress}</span></div>
          <div className="flex gap-2"><span className="shrink-0 text-xs font-medium text-red-600 w-14">易错</span><span className="text-xs text-muted-foreground">{phone.avoid}</span></div>
        </div>
      )}
      <button onClick={onToggle} className="mt-2 flex items-center gap-1 text-xs text-primary">
        <Info className="h-3 w-3" />{expanded ? "收起详情" : "展开详情"}
      </button>
    </div>
  );
}



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

function TechniqueSection({ tech }: { tech: Technique }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between p-4 text-left">
        <div><p className="font-medium text-sm">{tech.title}</p><p className="mt-0.5 text-xs text-muted-foreground">{tech.subtitle}</p></div>
        <span className="text-muted-foreground text-xs">{expanded ? "收起" : "展开"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="space-y-1.5">{tech.rules.map((r, i) => <p key={i} className="text-xs text-muted-foreground leading-relaxed">• {r}</p>)}</div>
          <div className="space-y-2">
            {tech.examples.map((ex, i) => (
              <div key={i} className="rounded-lg bg-muted/50 p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{ex.en}</p>
                  <button onClick={() => speakSentence(ex.en)} className="shrink-0 rounded-full bg-primary/10 p-1.5 text-primary"><Volume2 className="h-3.5 w-3.5" /></button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{ex.cn}</p>
                <p className="text-xs text-blue-600 mt-0.5">💡 {ex.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default function PronunciationPage() {
  const [activeTab, setActiveTab] = useState<"vowels" | "diphthongs" | "consonants" | "techniques" | "reading">("vowels");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const phoneData = activeTab === "vowels" ? vowels : activeTab === "diphthongs" ? diphthongs : consonants;
  const tabLabel = activeTab === "vowels" ? "单元音 (12)" : activeTab === "diphthongs" ? "双元音 (8)" : activeTab === "consonants" ? "辅音 (24)" : "";

  return (
    <>
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-xl font-bold">音标发音</h1>
        <p className="mt-1 text-sm text-muted-foreground">英语全部44个音标 · 点击 ▶ 播放音标发音</p>
      </div>

      <div className="mx-5 mb-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">🎙️ {getVoiceInfo()}</p>
        <div className="flex gap-1 rounded-lg bg-muted p-0.5">
          <button onClick={() => setViewMode("grid")} className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}>
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`rounded-md p-1.5 transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}>
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mx-5 mb-3 flex gap-2">
        {([
          { key: "vowels" as const, label: "单元音", count: 12 },
          { key: "diphthongs" as const, label: "双元音", count: 8 },
          { key: "consonants" as const, label: "辅音", count: 24 },{ key: "techniques" as const, label: "口语技巧", count: 0 },
          { key: "reading" as const, label: "单词品读", count: 0 },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="px-5 pb-24">
        {activeTab !== "techniques" ? (
          <>
            <p className="mb-2 text-xs text-muted-foreground">{tabLabel} · 共 {phoneData.length} 个音标</p>
            {viewMode === "grid" ? (
              <>{expandedId && <div className="fixed inset-0 bg-black/20 z-20" onClick={() => setExpandedId(null)} />}<div className="grid grid-cols-3 gap-2 relative">
                {phoneData.map(p => <PhoneCard key={p.symbol} phone={p} viewMode="grid" isExpanded={expandedId === p.symbol} onToggle={() => setExpandedId(expandedId === p.symbol ? null : p.symbol)} />)}
              </div></>
            ) : (
              <div className="space-y-2">
                {phoneData.map(p => <PhoneCard key={p.symbol} phone={p} viewMode="list" isExpanded={expandedId === p.symbol} onToggle={() => setExpandedId(expandedId === p.symbol ? null : p.symbol)} />)}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-1">雅思口语高分必备 · 英式连读弱读技巧</p>
            {techniques.map((t, i) => <TechniqueSection key={i} tech={t} />)}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}







