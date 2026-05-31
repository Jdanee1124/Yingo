export interface ReadingTip {
  title: string;
  icon: string;
  content: string;
  examples: { word: string; rule: string; result: string }[];
}

export const readingTips: ReadingTip[] = [
  {
    title: "音节划分",
    icon: "✂️",
    content: "元音是音节核心，一个单词有几个元音（a/e/i/o/u）就有几个音节。元音之间有两个辅音从中间切分，一个辅音归后一个音节。",
    examples: [
      { word: "important", rule: "3个元音=3个音节", result: "im·por·tant" },
      { word: "education", rule: "4个元音=4个音节", result: "e·du·ca·tion" },
      { word: "computer", rule: "元音间两个辅音从中间切", result: "com·pu·ter" },
      { word: "level", rule: "元音间一个辅音归后", result: "lev·el" },
      { word: "happen", rule: "双写辅音只发一次", result: "hap·pen" },
      { word: "strawberry", rule: "三音节切分", result: "straw·ber·ry" },
    ],
  },
  {
    title: "开音节 vs 闭音节",
    icon: "📖",
    content: "开音节：辅音+元音+辅音+e 结尾，元音发字母本身音。闭音节：辅音+元音+辅音 结尾，元音发短音。这是判断元音发音的核心规则。",
    examples: [
      { word: "make", rule: "辅+a+辅+e → 开音节", result: "a 发 /eɪ/（字母音）" },
      { word: "time", rule: "辅+i+辅+e → 开音节", result: "i 发 /aɪ/（字母音）" },
      { word: "note", rule: "辅+o+辅+e → 开音节", result: "o 发 /əʊ/（字母音）" },
      { word: "cat", rule: "辅+a+辅 → 闭音节", result: "a 发 /æ/（短音）" },
      { word: "sit", rule: "辅+i+辅 → 闭音节", result: "i 发 /ɪ/（短音）" },
      { word: "hot", rule: "辅+o+辅 → 闭音节", result: "o 发 /ɒ/（短音）" },
    ],
  },
  {
    title: "元音组合规则",
    icon: "🔤",
    content: "两个元音在一起时，通常第一个重读发字母音，第二个不发音。但有很多固定组合需要记忆。",
    examples: [
      { word: "rain", rule: "ai 组合 → 第一个重读", result: "a 发 /eɪ/，i 不发音" },
      { word: "boat", rule: "oa 组合 → 第一个重读", result: "o 发 /əʊ/，a 不发音" },
      { word: "sleep", rule: "ee 组合 → 发长音", result: "ee 发 /iː/" },
      { word: "moon", rule: "oo 组合 → 发长音", result: "oo 发 /uː/" },
      { word: "ight", rule: "ight 组合 → 固定发音", result: "ight 发 /aɪt/" },
      { word: "ough", rule: "ough 组合 → 多种读法", result: "though/through/bough 各不同" },
    ],
  },
  {
    title: "辅音组合规则",
    icon: "🔗",
    content: "常见辅音组合有固定发音，掌握这些组合能大幅提高单词品读准确率。",
    examples: [
      { word: "ch", rule: "ch 组合", result: "发 /tʃ/（China, change）" },
      { word: "sh", rule: "sh 组合", result: "发 /ʃ/（she, shoe）" },
      { word: "th", rule: "th 组合", result: "发 /θ/ 或 /ð/（think/this）" },
      { word: "ph", rule: "ph 组合", result: "发 /f/（phone, photo）" },
      { word: "kn", rule: "kn 在词首", result: "k 不发音（know, knife）" },
      { word: "wr", rule: "wr 在词首", result: "w 不发音（write, wrong）" },
    ],
  },
  {
    title: "后缀发音规则",
    icon: "📝",
    content: "常见后缀有固定发音模式，掌握后缀能快速判断词尾发音。",
    examples: [
      { word: "-tion", rule: "名词后缀", result: "发 /ʃn/（nation, action）" },
      { word: "-ous", rule: "形容词后缀", result: "发 /əs/（famous, nervous）" },
      { word: "-ful", rule: "形容词后缀", result: "发 /fl/（careful, helpful）" },
      { word: "-ly", rule: "副词后缀", result: "发 /li/（quickly, slowly）" },
      { word: "-ment", rule: "名词后缀", result: "发 /mənt/（government）" },
      { word: "-ight", rule: "固定组合", result: "发 /aɪt/（night, light）" },
    ],
  },
  {
    title: "重音判断技巧",
    icon: "🎵",
    content: "重音位置有规律可循：双音节名词/形容词重音偏前，动词偏后。-tion/-sion/-ic 结尾重音在后缀前一个音节。",
    examples: [
      { word: "TABLE", rule: "双音节名词 → 重音在前", result: "TA·ble /ˈteɪ.bl/" },
      { word: "reCORD", rule: "双音节动词 → 重音在后", result: "re·CORD /rɪˈkɔːd/" },
      { word: "eduCAtion", rule: "-tion 结尾 → 后缀前一音节", result: "e·du·CA·tion" },
      { word: "baSIC", rule: "-ic 结尾 → 后缀前一音节", result: "ba·SIC /beɪˈsɪk/" },
      { word: "HAPpiness", rule: "加后缀重音不变", result: "HAP·pi·ness" },
      { word: "CAREful", rule: "加 -ful 重音不变", result: "CARE·ful" },
    ],
  },
  {
    title: "不看音标品读实战步骤",
    icon: "🎯",
    content: "拿到一个生词，按以下步骤品读：先数元音定音节 → 找后缀定尾音 → 找辅音组合 → 判断开闭音节 → 定重音 → 整体读出。",
    examples: [
      { word: "environment", rule: "en+vi+ron+ment → 4音节，-ment后缀", result: "en·VI·ron·ment" },
      { word: "government", rule: "gov+ern+ment → 3音节，-ment后缀", result: "GOV·ern·ment" },
      { word: "psychology", rule: "ps开头p不发，-ology后缀", result: "psy·CHOL·o·gy" },
      { word: "necessary", rule: "ne+ces+sa+ry → 4音节", result: "NE·ces·sa·ry" },
      { word: "restaurant", rule: "restau+rant → 3音节", result: "RES·tau·rant" },
      { word: "Wednesday", rule: "不规则拼写，需记忆", result: "WEDNES·day /ˈwenz.deɪ/" },
    ],
  },
];
