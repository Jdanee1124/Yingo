const fs = require('fs');
const p = 'D:\\Claude cli\\MyApp\\yingo\\src\\data\\vocab-sample.ts';
let c = fs.readFileSync(p,'utf8').replace(/\];\s*$/,'');
const d = [
// D词族
['dynamic','/daɪˈnæmɪk/','adj. 动态的','changing over time','Dynamic environment.','动态环境。','dyn(力量)+amic'],
['economy','/ɪˈkɒnəmi/','n. 经济','system of production','Global economy growing.','全球经济增长。','eco(家)+nomy(管理)'],
['efficient','/ɪˈfɪʃnt/','adj. 高效的','achieving results with waste','Efficient system.','高效系统。','ef+fic(做)+ient'],
['elaborate','/ɪˈlæbərət/','adj. 精心的','complex and detailed','Elaborate plan.','精心计划。','e+labor(劳动)+ate'],
['eliminate','/ɪˈlɪmɪneɪt/','v. 消除','to remove completely','Eliminate waste.','消除浪费。','e+limin(界限)+ate'],
['emerge','/ɪˈmɜːdʒ/','v. 出现','to come into view','New trends emerge.','新趋势出现。','e+merge(沉)'],
['emphasis','/ˈemfəsɪs/','n. 强调','special importance','Emphasis on education.','强调教育。','em+phas(显示)+is'],
['enable','/ɪˈneɪbl/','v. 使能够','to make possible','Technology enables communication.','技术使交流成为可能。','en+able'],
['encounter','/ɪnˈkaʊntə/','v./n. 遇见','to meet unexpectedly','Encountered difficulties.','遇到困难。','en+counter(对抗)'],
['encourage','/ɪnˈkʌrɪdʒ/','v. 鼓励','to give support','Encourage learning.','鼓励学习。','en+courage(勇气)'],
['endeavour','/ɪnˈdevə/','n./v. 努力','an attempt','We endeavour to improve.','我们努力改进。','en+deavour(债务)'],
['energy','/ˈenədʒi/','n. 能源','power and vitality','Renewable energy.','可再生能源。','energ(活力)+y'],
['engage','/ɪnˈɡeɪdʒ/','v. 从事；吸引','to participate or attract','Students engaged in study.','学生投入学习。','en+gage(承诺)'],
['enhance','/ɪnˈhɑːns/','v. 提高','to improve quality','Enhance performance.','提高性能。','en+hance(高)'],
['enormous','/ɪˈnɔːməs/','adj. 巨大的','very large in size','Enormous impact.','巨大影响。','e+norm(标准)+ous'],
['enterprise','/ˈentəpraɪz/','n. 企业','a business organization','Small enterprise.','小企业。','enter(之间)+prise(抓)'],
['entire','/ɪnˈtaɪə/','adj. 全部的','whole or complete','Entire population.','全部人口。','en+tire(拉)'],
['environment','/ɪnˈvaɪrənmənt/','n. 环境','natural surroundings','Protect environment.','保护环境。','environ(围绕)+ment'],
['equivalent','/ɪˈkwɪvələnt/','adj. 等同的','equal in value','Equivalent to $100.','等同于100美元。','equi(相等)+val(价值)+ent'],
['era','/ˈɪərə/','n. 时代','a long period','Digital era.','数字时代。'],
['essential','/ɪˈsenʃl/','adj. 必要的','extremely important','Essential skill.','必要技能。','ess(存在)+ential'],
['establish','/ɪˈstæblɪʃ/','v. 建立','to set up','Established company.','建立公司。','e+stabl(站)+ish'],
['estimate','/ˈestɪmeɪt/','v./n. 估计','to roughly calculate','Estimated cost.','估计成本。','estim(评价)+ate'],
['evaluate','/ɪˈvæljueɪt/','v. 评估','to assess value','Evaluate performance.','评估表现。','e+valu(价值)+ate'],
['evidence','/ˈevɪdəns/','n. 证据','proof or indication','Scientific evidence.','科学证据。','e+vid(看)+ence'],
['evolve','/ɪˈvɒlv/','v. 进化；发展','to develop gradually','Species evolve over time.','物种随时间进化。','e+volve(转)'],
['exaggerate','/ɪɡˈzædʒəreɪt/','v. 夸大','to make seem larger','Don\'t exaggerate.','别夸大。','ex+ag+ger(搬运)+ate'],
['examine','/ɪɡˈzæmɪn/','v. 检查','to inspect carefully','Examine the evidence.','检查证据。','ex+amin(衡量)'],
['exceed','/ɪkˈsiːd/','v. 超过','to go beyond','Exceeded expectations.','超出预期。','ex+ceed(走)'],
['exclusive','/ɪkˈskluːsɪv/','adj. 独有的','restricted to few','Exclusive access.','独有访问权。','ex+clus(关闭)+ive'],
['execute','/ˈeksɪkjuːt/','v. 执行','to carry out','Execute the plan.','执行计划。','ex+secut(跟随)+e'],
['exhibit','/ɪɡˈzɪbɪt/','v./n. 展览','to display','Exhibit artwork.','展览艺术品。','ex+hibit(持有)'],
['expand','/ɪkˈspænd/','v. 扩展','to become larger','Expand business.','扩展业务。','ex+pand(展开)'],
['expertise','/ˌekspɜːˈtiːz/','n. 专业知识','specialized knowledge','Technical expertise.','技术专长。','expert+ise'],
['explicit','/ɪkˈsplɪsɪt/','adj. 明确的','stated clearly','Explicit instructions.','明确指示。','ex+plic(折叠)+it'],
['exploit','/ɪkˈsplɔɪt/','v. 开发；剥削','to use fully','Exploit resources.','开发资源。','ex+ploit(折叠)'],
['expose','/ɪkˈspəʊz/','v. 暴露','to make visible','Exposed to risk.','暴露于风险。','ex+pose(放置)'],
['extend','/ɪkˈstend/','v. 延伸','to make longer','Extend deadline.','延长截止日期。','ex+tend(伸)'],
['external','/ɪkˈstɜːnl/','adj. 外部的','coming from outside','External factors.','外部因素。','ex+tern(外部)+al'],
['extract','/ˈekstrækt/','v./n. 提取','to remove','Extract data.','提取数据。','ex+tract(拉)'],
// F词族
['factor','/ˈfæktə/','n. 因素','a contributing element','Key factor.','关键因素。','fact(做)+or'],
['fade','/feɪd/','v. 褪色；逐渐消失','to gradually disappear','Memory fades.','记忆褪色。'],
['fatal','/ˈfeɪtl/','adj. 致命的','causing death','Fatal accident.','致命事故。','fate(命运)+al'],
['favour','/ˈfeɪvə/','n./v. 支持','preferential treatment','Favour this option.','支持这个选项。'],
['feature','/ˈfiːtʃə/','n. 特征；功能','a distinctive quality','Key feature.','关键特征。'],
['federal','/ˈfedərəl/','adj. 联邦的','relating to central government','Federal government.','联邦政府。','feder(联盟)+al'],
['finance','/ˈfaɪnæns/','n./v. 资金','management of money','Personal finance.','个人财务。','fin(结束)+ance'],
['flexible','/ˈfleksəbl/','adj. 灵活的','able to bend or adapt','Flexible schedule.','灵活时间表。','flex(弯曲)+ible'],
['fluctuate','/ˈflʌktʃueɪt/','v. 波动','to rise and fall','Prices fluctuate.','价格波动。','fluctu(流动)+ate'],
['focus','/ˈfəʊkəs/','n./v. 焦点','center of attention','Focus on quality.','关注质量。'],
['forbid','/fəˈbɪd/','v. 禁止','to prohibit','Smoking forbidden.','禁止吸烟。','for(离开)+bid(命令)'],
['forecast','/ˈfɔːkɑːst/','v./n. 预测','to predict','Weather forecast.','天气预报。','fore(前)+cast(投)'],
['formula','/ˈfɔːmjələ/','n. 公式','a rule expressed in symbols','Mathematical formula.','数学公式。','form(形)+ula'],
['fortune','/ˈfɔːtʃuːn/','n. 财富；运气','a large amount of money','Made a fortune.','发了财。','fort(强)+une'],
['found','/faʊnd/','v. 建立','to establish','Founded in 1990.','成立于1990年。'],
['fraction','/ˈfrækʃn/','n. 分数；小部分','a small part','A fraction of the cost.','成本的一小部分。','fract(打碎)+ion'],
['framework','/ˈfreɪmwɜːk/','n. 框架','a basic structure','Legal framework.','法律框架。','frame(框架)+work'],
['frequent','/ˈfriːkwənt/','adj. 频繁的','happening often','Frequent visits.','频繁访问。','frequ(频繁)+ent'],
['friction','/ˈfrɪkʃn/','n. 摩擦','resistance when surfaces meet','Social friction.','社会摩擦。','frict(摩擦)+ion'],
['function','/ˈfʌŋkʃn/','n./v. 功能','a purpose or role','Main function.','主要功能。','funct(执行)+ion'],
// G词族
['generate','/ˈdʒenəreɪt/','v. 产生','to produce','Generate electricity.','发电。','gen(产生)+erate'],
['genuine','/ˈdʒenjuɪn/','adj. 真正的','truly what it is said','Genuine concern.','真正的关心。','genu(产生)+ine'],
['global','/ˈɡləʊbl/','adj. 全球的','relating to the whole world','Global warming.','全球变暖。','glob(球)+al'],
['gradual','/ˈɡrædʒuəl/','adj. 逐渐的','happening slowly','Gradual improvement.','逐渐改善。','grad(步)+ual'],
['grant','/ɡrɑːnt/','v./n. 授予','to give or allow','Granted permission.','给予许可。'],
['guarantee','/ˌɡærənˈtiː/','v./n. 保证','a promise','Guarantee quality.','保证质量。','guar(守卫)+antee'],
['guideline','/ˈɡaɪdlaɪn/','n. 指导方针','a rule or principle','Follow guidelines.','遵循指导方针。','guide(指导)+line'],
// H词族
['halt','/hɔːlt/','v./n. 停止','to come to a stop','Production halted.','生产停止。'],
['harsh','/hɑːʃ/','adj. 严厉的','severe or strict','Harsh conditions.','恶劣条件。'],
['hazard','/ˈhæzəd/','n. 危险','a source of danger','Health hazard.','健康危害。','haz(运气)+ard'],
['hierarchy','/ˈhaɪərɑːki/','n. 等级制度','a ranking system','Social hierarchy.','社会等级制度。','hier(神圣)+archy(统治)'],
['highlight','/ˈhaɪlaɪt/','v./n. 强调','to emphasize','Highlight important points.','强调重点。','high(高)+light(光)'],
['hypothesis','/haɪˈpɒθəsɪs/','n. 假设','a proposed explanation','Testing hypothesis.','测试假设。','hypo(在下)+thesis(放置)'],
];
let id = 151;
for (const w of d) {
  const [word,phonetic,meaning,meaningEn,example,exampleTranslation,roots,association] = w;
  const nid = 'w'+String(id).padStart(3,'0');
  c += `  { id: "${nid}", word: "${word}", phonetic: "${phonetic}", meaning: "${meaning}", meaningEn: "${meaningEn}", example: "${example}", exampleTranslation: "${exampleTranslation}"${roots ? `, roots: "${roots}"` : ''}${association ? `, association: "${association}"` : ''}, level: "core" as const, tags: ["高频"] },\n`;
  id++;
}
c += '];\n';
fs.writeFileSync(p,c,'utf8');
console.log('Added '+d.length+' words, total id up to w'+String(id-1).padStart(3,'0'));
