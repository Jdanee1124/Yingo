export interface Technique {
  title: string;
  subtitle: string;
  rules: string[];
  examples: { en: string; cn: string; note: string }[];
}

export const techniques: Technique[] = [
  {
    title: "🔗 连读 Linking",
    subtitle: "前一个词的尾音和后一个词的首音连在一起读",
    rules: [
      "辅音+元音连读：前词以辅音结尾，后词以元音开头，连在一起读",
      "r/re+元音：前词以r或re结尾，后词以元音开头，r要发音并连读",
      "元音+元音：在两个元音之间插入轻微的/w/或/j/过渡音",
    ],
    examples: [
      { en: "take it easy", cn: "别紧张", note: "take的/k/连上it的/i/ → /teɪ.kɪ.tiː.zɪ/" },
      { en: "far away", cn: "遥远的", note: "far的r连上away的/a/ → /fɑː.rə.weɪ/" },
      { en: "I am a student", cn: "我是学生", note: "am的/m/连上a的/a/ → /aɪ.æ.mə.stjuː.dənt/" },
      { en: "turn off", cn: "关掉", note: "turn的n连上off的/o/ → /tɜː.nɒf/" },
      { en: "an apple", cn: "一个苹果", note: "an的/n/连上apple的/a/ → /ə.næ.pl/" },
      { en: "put it on", cn: "穿上它", note: "put的/t/连it的/i/，it的/t/连on的/o/ → /pʊ.tɪ.tɒn/" },
    ],
  },
  {
    title: "✂️ 省略 Elision",
    subtitle: "某些音在口语中被省略不发",
    rules: [
      "三个辅音相连时，中间的爆破音常省略：next day → /nek.deɪ/",
      "/t/和/d/在/n/和/s/前常省略：internet → /ɪn.ə.net/",
      "非重读音节中的/t/和/d/常省略：standby → /stæn.baɪ/",
      "/h/在非重读代词中常省略：give him → /ɡɪv.ɪm/",
    ],
    examples: [
      { en: "next day", cn: "第二天", note: "next的/t/省略 → /nek.deɪ/" },
      { en: "sandwich", cn: "三明治", note: "中间的d省略 → /sæn.wɪdʒ/" },
      { en: "different", cn: "不同的", note: "口语中常省略中间的/ə/ → /dɪf.rənt/" },
      { en: "just now", cn: "刚才", note: "just的/t/省略 → /dʒʌs.naʊ/" },
      { en: "most people", cn: "大多数人", note: "most的/t/在/p/前省略 → /məʊs.piː.pl/" },
      { en: "government", cn: "政府", note: "省略中间音节 → /ɡʌv.mənt/" },
    ],
  },
  {
    title: "🔄 同化 Assimilation",
    subtitle: "一个音受相邻音的影响而发生变化",
    rules: [
      "/t/+/you/ → /tʃuː/：如meet you → /miː.tʃuː/",
      "/d/+/you/ → /dʒuː/：如need you → /niː.dʒuː/",
      "/s/+/you/ → /ʃuː/：如miss you → /mɪ.ʃuː/",
      "/z/+/you/ → /ʒuː/：如as you → /æ.ʒuː/",
      "/n/+/you/ → /njuː/：如can you → /kæn.juː/",
      "/t/+/her/ → /tʃə/：如met her → /me.tʃə/",
    ],
    examples: [
      { en: "nice to meet you", cn: "很高兴认识你", note: "meet的/t/受you影响 → /miː.tʃuː/" },
      { en: "would you mind?", cn: "你介意吗？", note: "would的/d/ → /wʊ.dʒuː/" },
      { en: "I miss you", cn: "我想你", note: "miss的/s/ → /mɪ.ʃuː/" },
      { en: "as you know", cn: "如你所知", note: "as的/z/ → /æ.ʒuː.nəʊ/" },
      { en: "can you help?", cn: "你能帮忙吗？", note: "can的/n/连读 → /kæn.juː.help/" },
      { en: "got her number", cn: "拿到了她的号码", note: "got的/t/受her影响 → /ɡɒ.tʃə.nʌm.bə/" },
    ],
  },
  {
    title: "📉 弱读 Weak Forms",
    subtitle: "功能词在非重读位置时发音变化",
    rules: [
      "介词、连词、代词等功能词在句子中通常弱读",
      "弱读时元音常变成/ə/，如from /frɒm/ → /frəm/",
      "冠词a, an, the在非重读时：a /eɪ/ → /ə/, the /ðiː/ → /ðə/",
      "助动词和情态动词也常弱读：can /kæn/ → /kən/",
    ],
    examples: [
      { en: "a cup of tea", cn: "一杯茶", note: "a弱读为/ə/，of弱读为/əv/ → /ə.kʌp.əv.tiː/" },
      { en: "I can do it", cn: "我能做到", note: "can弱读为/kən/ → /aɪ.kən.duː.ɪt/" },
      { en: "to be or not to be", cn: "生存还是毁灭", note: "to弱读为/tə/，or弱读为/ə/" },
      { en: "What are you doing?", cn: "你在做什么？", note: "are弱读为/ə/，you弱读为/jə/" },
      { en: "He has been there", cn: "他一直在那里", note: "has弱读为/həz/，been弱读为/bɪn/" },
      { en: "a piece of cake", cn: "一块蛋糕/很简单", note: "a和of都弱读 → /ə.piːs.əv.keɪk/" },
    ],
  },
  {
    title: "➕ 插入 Intrusion",
    subtitle: "在特定音之间自然插入额外的音",
    rules: [
      "两个元音之间插入/r/：前词以元音结尾，后词以元音开头",
      "如 law and order → /lɔː.rən.ɔː.də/",
      "如 idea of → /aɪ.dɪə.rɒv.ɪt/（英音中插入/r/）",
      "口语中常用and的弱读/ən/连接两个词",
    ],
    examples: [
      { en: "law and order", cn: "法律与秩序", note: "law和and之间插入/r/ → /lɔː.rən.ɔː.də/" },
      { en: "idea of it", cn: "它的概念", note: "idea和of之间插入/r/ → /aɪ.dɪə.rɒv.ɪt/" },
      { en: "far away", cn: "遥远的", note: "far的r和away的a连读 → /fɑː.rə.weɪ/" },
      { en: "the area of study", cn: "研究领域", note: "area和of之间插入/r/" },
      { en: "answer a question", cn: "回答问题", note: "answer的r和a连读" },
      { en: "better idea", cn: "更好的主意", note: "better的r和idea连读" },
    ],
  },
  {
    title: "🎵 重读与节奏 Stress and Rhythm",
    subtitle: "英语是重音计时语言，重读和弱读形成节奏",
    rules: [
      "实词（名词、动词、形容词、副词）通常重读",
      "虚词（介词、冠词、连词、代词）通常弱读",
      "句子重音落在最重要的信息词上",
      "重读音节之间的间隔大致相等，形成节奏感",
    ],
    examples: [
      { en: "I want to GO to LONdon", cn: "我想去伦敦", note: "GO和LON重读，其他弱读，形成节奏" },
      { en: "She CAN do it VERY well", cn: "她能做得很好", note: "CAN和VERY重读" },
      { en: "the BEAUtiful GREEN garden", cn: "美丽的绿色花园", note: "BEAU和GREEN重读" },
      { en: "a piece of CAKE", cn: "一块蛋糕/很简单", note: "CAKE重读，其他弱读" },
      { en: "PUT it ON please", cn: "请穿上它", note: "PUT和ON重读" },
      { en: "What TIME is it?", cn: "几点了？", note: "TIME重读，What弱读" },
    ],
  },
  {
    title: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 英式特有技巧",
    subtitle: "英式英语特有的发音习惯",
    rules: [
      "不卷舌：词尾的r不发音，如car /kɑː/、teacher /tiː.tʃə/",
      "/t/清晰发音：不弹舌，如water /wɔː.tə/，不像美音的闪音",
      "喉塞音：词尾的/t/有时变成喉塞音，如button /bʌ.ʔn/",
      "宽a：bath, grass, path等词用/ɑː/而非/æ/",
    ],
    examples: [
      { en: "car", cn: "汽车", note: "英音 /kɑː/ 不卷舌，美音 /kɑːr/ 卷舌" },
      { en: "water", cn: "水", note: "英音 /wɔː.tə/ 清晰t，美音弹t" },
      { en: "bath", cn: "洗澡", note: "英音 /bɑːθ/ 长a，美音 /bæθ/ 梅花音" },
      { en: "better", cn: "更好的", note: "英音 /be.tə/，美音弹t" },
      { en: "button", cn: "按钮", note: "英音词尾t变喉塞音 → /bʌ.ʔn/" },
      { en: "here", cn: "这里", note: "英音 /hɪə/ 不卷舌，美音 /hɪr/ 卷舌" },
    ],
  },
];
