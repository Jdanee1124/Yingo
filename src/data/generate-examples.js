const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, 'vocab-sample.bak.ts');
const outputPath = path.join(__dirname, 'vocab-sample.ts');

const raw = fs.readFileSync(backupPath, 'utf-8');
const clean = raw.replace(/ as const/g, '');
const arrayStart = clean.indexOf('[');
const arrayEnd = clean.lastIndexOf(']');
const words = eval(clean.substring(arrayStart, arrayEnd + 1));

// Context-aware sentence generator
// Groups words by their meaningEn keywords and provides appropriate contexts
const contextMap = {
  // Verbs - academic/IELTS contexts
  'give up': ['The research team was forced to abandon the experiment due to unforeseen complications in the data collection process.', '项目因数据收集过程中不可预见的复杂情况而被迫放弃。'],
  'power or skill': ['The ability to synthesise information from multiple sources is increasingly valued in contemporary academic discourse.', '从多个来源综合信息的能力在当代学术讨论中越来越受到重视。'],
  'end officially': ['International advocacy groups continue to campaign for the abolition of punitive sentencing policies that disproportionately affect marginalised communities.', '国际倡导团体继续运动要求废除对边缘化社区产生不成比例影响的惩罚性量刑政策。'],
  'take in': ['The capacity of wetlands to absorb carbon dioxide makes them invaluable in the fight against climate change.', '湿地吸收二氧化碳的能力使它们在应对气候变化方面具有不可估量的价值。'],
  'in thought only': ['The distinction between concrete and abstract reasoning is central to understanding cognitive development in children.', '具体推理和抽象推理之间的区别是理解儿童认知发展的核心。'],
  'in large quantities': ['The availability of abundant renewable energy resources positions the region as a potential leader in sustainable development.', '丰富的可再生能源资源的可用性使该地区成为可持续发展的潜在领导者。'],
  'relating to education': ['Academic rigour and intellectual curiosity are qualities that universities seek to cultivate in their students.', '学术严谨性和求知欲是大学寻求培养学生的核心品质。'],
  'to increase speed': ['The digital revolution has accelerated the pace of change in virtually every sector of the global economy.', '数字革命加速了全球经济几乎每个领域的变革步伐。'],
  'right to use': ['Ensuring equitable access to quality education remains one of the most pressing challenges facing modern democracies.', '确保公平获得优质教育仍然是现代民主国家面临的最紧迫挑战之一。'],
  'to provide space': ['Universities must accommodate an increasingly diverse student population, including those with disabilities and from varied cultural backgrounds.', '大学必须容纳日益多元化的学生群体，包括残疾学生和来自不同文化背景的学生。'],
  'to go with': ['The decline in biodiversity has been accompanied by the degradation of essential ecosystem services upon which human societies depend.', '生物多样性的下降伴随着人类社会所依赖的基本生态系统服务的退化。'],
  'to achieve': ['Through sustained effort and strategic planning, the team managed to accomplish objectives that many had considered unattainable.', '通过持续努力和战略规划，该团队成功实现了许多人认为无法实现的目标。'],
  'responsibility': ['Enhanced accountability in public institutions is fundamental to restoring citizen trust in governmental processes.', '公共机构中更强的问责制是恢复公民对政府程序信任的基础。'],
  'to build up': ['Sediments gradually accumulate at the mouths of rivers, creating new land formations over extended periods.', '沉积物逐渐在河口积累，在较长时期内形成新的地貌。'],
  'correct': ['Ensuring that research methodologies are sufficiently accurate is paramount to producing valid and reproducible scientific findings.', '确保研究方法足够准确对于产生有效和可重复的科学发现至关重要。'],
  'to reach goal': ['Individuals who establish clearly defined objectives and work systematically towards them are more likely to achieve lasting professional success.', '设定明确定义的目标并系统地朝之努力的人更有可能取得持久的职业成功。'],
  'to recognise': ['Many scholars have acknowledged that traditional assessment methods fail to capture the full range of student competencies.', '许多学者已经承认，传统的评估方法未能全面反映学生的能力。'],
  'to obtain': ['The acquisition of advanced digital literacy skills has become indispensable for professionals navigating the modern workplace.', '获得高级数字素养技能已成为在现代职场中工作的专业人士不可或缺的能力。'],
  'to adjust': ['Species that cannot adapt sufficiently quickly to shifting climate conditions face a heightened risk of population decline.', '无法足够快地适应气候变化的物种面临种群下降的更高风险。'],
  'sufficient': ['Current levels of funding are manifestly inadequate to address the scale of infrastructure challenges in developing regions.', '目前的资金水平明显不足以应对发展中地区基础设施挑战的规模。'],
  'next to': ['The university campus is situated adjacent to several leading research facilities, fostering opportunities for collaborative inquiry.', '大学校园毗邻几个领先的研究机构，为合作探究创造了机会。'],
  'governing process': ['The administration of large-scale vaccination campaigns demands extraordinary logistical coordination and public communication.', '大规模疫苗接种运动的管理需要非凡的后勤协调和公共沟通。'],
  'young person': ['Adolescents navigating the transition to adulthood require robust mental health support systems and mentorship opportunities.', '在向成年过渡的青少年需要强有力的心理健康支持系统和导师指导机会。'],
  'to accept': ['Many institutions have begun to adopt innovative pedagogical approaches that prioritise critical thinking over rote memorisation.', '许多机构已开始采用创新的教学方法，将批判性思维置于死记硬背之上。'],
  'to move forward': ['Technological advancement has enabled remarkable progress in medical diagnostics and treatment methodologies.', '技术进步在医疗诊断和治疗方法方面取得了显著进展。'],
  'to support': ['Environmental organisations continue to advocate for comprehensive legislation to protect endangered species and their habitats.', '环保组织继续倡导全面立法以保护濒危物种及其栖息地。'],
  'to have effect on': ['Prolonged exposure to environmental toxins has been shown to adversely affect neurological development in young children.', '长期暴露于环境毒素已被证明会对幼儿的神经发育产生不利影响。'],
  'whole formed': ['The aggregate impact of individual consumer choices on global supply chains is a subject of growing academic interest.', '个人消费者选择对全球供应链的综合影响是学术界日益关注的话题。'],
  'ready to attack': ['The aggressive pursuit of market share by multinational corporations has raised concerns about the erosion of local business ecosystems.', '跨国公司对市场份额的积极追求引发了对当地商业生态系统侵蚀的担忧。'],
  'quick to notice': ['Researchers must remain alert to potential biases in data collection that could compromise the integrity of their findings.', '研究人员必须对可能损害研究结果完整性的数据收集潜在偏见保持警惕。'],
  'distribute resources': ['The equitable allocation of public resources across communities is essential for fostering social cohesion and reducing inequality.', '在社区之间公平分配公共资源对于促进社会凝聚力和减少不平等至关重要。'],
  'partnership': ['The strategic alliance between universities and industry partners has proven instrumental in driving technological innovation.', '大学与行业合作伙伴之间的战略联盟已被证明在推动技术创新方面发挥了关键作用。'],
  'give permission': ['Governments must allow sufficient fiscal flexibility to enable local authorities to respond effectively to emerging crises.', '政府必须给予足够的财政灵活性，使地方当局能够有效应对新兴危机。'],
  'to change': ['The digital revolution has fundamentally altered the mechanisms through which information is produced, distributed, and consumed.', '数字革命从根本上改变了信息生产、分配和消费的机制。'],
  'another option': ['The transition to alternative energy sources is no longer merely desirable but increasingly essential for long-term economic resilience.', '向替代能源的过渡不再仅仅可取，而且对长期经济韧性越来越必要。'],
  'open to more than one': ['The deliberately ambiguous wording of the regulation has generated considerable confusion among compliance officers.', '法规中故意含糊的措辞在合规官员中引起了相当大的困惑。'],
  'having a desire': ['Ambitious graduates who combine academic excellence with practical experience are highly sought after by leading employers.', '将学术优秀与实践经验相结合的有抱负的毕业生受到主要雇主的高度追捧。'],
  'to change slightly': ['Parliament is expected to amend the existing environmental legislation to incorporate more stringent emission standards.', '议会预计将修改现行环境立法，纳入更严格的排放标准。'],
  'more than enough': ['The study provided ample evidence to substantiate the claim that early intervention programmes significantly improve literacy outcomes.', '该研究提供了充分的证据来证实早期干预项目可显著提高读写能力的主张。'],
  'to examine': ['Researchers employ sophisticated statistical techniques to analyse complex datasets and identify meaningful patterns.', '研究人员使用复杂的统计技术来分析复杂的数据集并识别有意义的模式。'],
  'yearly': ['The organisation publishes an annual report detailing its financial performance and strategic achievements.', '该组织发布年度报告，详细说明其财务表现和战略成就。'],
  'to expect': ['Economic analysts anticipate that inflationary pressures will gradually ease over the coming fiscal quarters.', '经济分析师预计，通胀压力将在接下来的财政季度逐渐缓解。'],
  'clearly visible': ['The adverse effects of climate change on vulnerable populations have become increasingly apparent in recent years.', '气候变化对弱势群体的不利影响近年来变得越来越明显。'],
  'to attract': ['The growing appeal of interdisciplinary degree programmes reflects a broader shift in employer expectations.', '跨学科课程日益增长的吸引力反映了雇主期望的更广泛转变。'],
  'desire for food': ['Chronic psychological stress has been consistently linked to disrupted appetite regulation and altered eating patterns.', '慢性心理压力一直与食欲调节紊乱和饮食模式改变有关。'],
  'household device': ['The proliferation of energy-intensive household appliances has contributed significantly to rising residential electricity consumption.', '高能耗家用电器的普及极大地促进了住宅用电量的增长。'],
  'formal request': ['The application of artificial intelligence to diagnostic medicine holds transformative potential for healthcare delivery in underserved communities.', '将人工智能应用于诊断医学对医疗服务不足社区的医疗服务具有变革性潜力。'],
  'to value': ['Experienced educators deeply appreciate the role that mentorship plays in shaping the professional trajectories of young people.', '经验丰富的教育工作者深切认识到导师指导在塑造年轻人职业轨迹方面的作用。'],
  'way of dealing': ['A multifaceted approach to addressing poverty is essential for achieving sustainable and equitable economic development.', '应对贫困的多方面方法对于实现可持续和公平的经济发展至关重要。'],
  'suitable': ['It is imperative that assessment criteria are appropriate for evaluating the diverse competencies that students develop throughout their studies.', '评估标准必须适合评价学生在学习过程中发展的多样化能力。'],
  'to agree to': ['The proposal received overwhelming approval from board members following a comprehensive review of its anticipated benefits.', '在对其预期收益进行全面审查后，该提案获得了董事会成员的一致批准。'],
  'close to exact': ['Approximately two-thirds of the global population now resides in urban areas, a figure that continues to rise annually.', '全球大约三分之二的人口现在居住在城市地区，这一数字每年继续增长。'],
  'random': ['Critics have argued that the allocation of resources appeared arbitrary and lacked any transparent decision-making framework.', '批评者认为，资源的分配似乎具有随意性，缺乏任何透明的决策框架。'],
  'to emerge': ['Unforeseen challenges are likely to arise as nations attempt to implement the ambitious targets set by international climate agreements.', '随着各国试图实施国际气候协议设定的宏伟目标，不可预见的挑战可能会出现。'],
  'made by humans': ['The rapid advancement of artificial intelligence has prompted urgent debates about the future of human employment and creativity.', '人工智能的快速发展引发了关于人类就业和创造力未来的紧迫辩论。'],
  'statement': ['The assertion that education alone can eradicate poverty has been challenged by scholars who emphasise the role of structural inequality.', '教育本身就能消除贫困的论断受到了强调结构性不平等作用的学者的质疑。'],
  'to evaluate': ['A comprehensive assessment of student learning must go beyond standardised testing to include portfolio-based and performance-based evaluations.', '对学生学习的全面评估必须超越标准化测试，包括基于作品集和基于表现的评估。'],
  'to suppose': ['The assumption that economic growth inevitably benefits all segments of society has been increasingly questioned by development economists.', '经济增长必然使社会所有阶层受益的假设受到了发展经济学家越来越多的质疑。'],
  'regarded as caused by': ['The attributes most consistently associated with academic excellence include intellectual curiosity, self-discipline, and resilience.', '与学术优秀最持续相关的特质包括求知欲、自律和韧性。'],
  'power to give orders': ['The authority to enforce environmental regulations must be exercised with due regard for both ecological imperatives and economic realities.', '执行环境法规的权力必须在充分考虑生态紧迫性和经济现实的基础上审慎行使。'],
  'knowledge or perception': ['Growing public awareness of the health risks associated with processed foods has driven demand for organic and natural alternatives.', '公众对加工食品健康风险认识的增加推动了对有机和天然替代品的需求。'],
  'between two parties': ['Bilateral trade agreements between neighbouring nations can facilitate economic growth and promote regional stability.', '邻国之间的双边贸易协定可以促进经济增长和区域稳定。'],
  'the maximum amount': ['The capacity of existing healthcare infrastructure to absorb the demands of an ageing population is severely limited.', '现有医疗基础设施容纳老龄化人口需求的能力严重有限。'],
  'logical and consistent': ['The ability to construct a coherent and well-supported argument is fundamental to success in both academic writing and professional communication.', '构建连贯且有充分支持的论点的能力是学术写作和职业沟通成功的基础。'],
  'to fall down': ['The collapse of the banking sector in 2008 had devastating consequences for economies worldwide, triggering a prolonged global recession.', '2008年银行业崩溃对全球经济产生了毁灭性后果，引发了长期的全球衰退。'],
  'to fight against': ['Governments must invest in robust public health infrastructure to effectively combat the spread of infectious diseases.', '政府必须投资于健全的公共卫生基础设施，以有效抗击传染病的传播。'],
  'dedication': ['Sustained commitment to professional development is essential for educators seeking to remain at the forefront of pedagogical innovation.', '对专业发展的持续投入对于寻求站在教学创新前沿的教育工作者至关重要。'],
  'able to be transmitted': ['The control of communicable diseases in densely populated regions requires coordinated international surveillance and response mechanisms.', '在人口稠密地区控制传染病需要协调的国际监测和应对机制。'],
  'a group of people': ['Active community participation in local governance enhances democratic accountability and promotes more responsive public services.', '社区积极参与地方治理可以增强民主问责制并促进更具响应性的公共服务。'],
  'able to exist together': ['Ensuring that new digital platforms are compatible with established systems is a significant challenge during technological transitions.', '确保新数字平台与现有系统兼容是技术过渡期间的重大挑战。'],
  'to make up for': ['Companies should provide adequate compensation to employees who work overtime to ensure fair labour practices are maintained.', '公司应为加班员工提供足够的补偿，以确保维持公平的劳动实践。'],
  'to collect information': ['Researchers compile extensive evidence from peer-reviewed sources to substantiate their hypotheses and conclusions.', '研究人员从同行评审来源汇编大量证据来支持他们的假设和结论。'],
  'to add to something': ['Practical training placements should complement classroom-based instruction to produce graduates with well-rounded competencies.', '实践培训实习应补充课堂教学，以培养具有全面能力的毕业生。'],
  'many interconnected parts': ['The complex interplay between globalisation and cultural identity presents multifaceted challenges for policymakers and communities.', '全球化与文化认同之间的复杂相互作用为政策制定者和社区带来了多方面的挑战。'],
  'a part of a whole': ['Critical thinking is a fundamental component of higher education that equips students with transferable analytical skills.', '批判性思维是高等教育的基本组成部分，为学生提供可转移的分析技能。'],
  'including all elements': ['A comprehensive review of the literature reveals significant gaps in our understanding of long-term climate adaptation strategies.', '对文献的全面回顾揭示了我们对长期气候适应策略理解的重大空白。'],
  'to form in the mind': ['It is difficult to conceive of a future in which artificial intelligence does not play a central role in healthcare delivery.', '很难想象一个人工智能不在医疗服务中发挥核心作用的未来。'],
  'to focus attention': ['Students who can concentrate effectively in noisy or distracting environments demonstrate superior academic performance.', '能够在嘈杂或分心环境中有效集中的学生表现出更优的学术表现。'],
  'an abstract idea': ['The concept of sustainable development has evolved considerably since it was first introduced in the Brundtland Report of 1987.', '自1987年《布伦特兰报告》首次提出以来，可持续发展的概念已经发生了相当大的演变。'],
  'a feeling of worry': ['The growing prevalence of mental health disorders among young people is a matter of acute concern for educators and policymakers alike.', '年轻人心理健康障碍的日益普遍是教育工作者和政策制定者共同严重关切的问题。'],
  'to arrive at judgment': ['The research team concluded that sustained investment in early childhood education yields substantial returns in terms of social mobility.', '研究团队得出结论，对幼儿教育的持续投资在社会流动方面产生可观的回报。'],
  'to organise and carry out': ['The research team conducted a longitudinal study spanning fifteen years to examine the effects of urbanisation on mental health.', '研究团队进行了一项跨越十五年的纵向研究，以考察城市化对心理健康的影响。'],
  'to keep within limits': ['The debate about immigration policy should not be confined to economic considerations alone but must encompass social and cultural dimensions.', '关于移民政策的辩论不应仅限于经济考量，还必须涵盖社会和文化维度。'],
  'to establish truth': ['Recent empirical evidence has confirmed that regular physical activity significantly reduces the risk of cardiovascular disease.', '最近的经验证据证实，定期体育锻炼可显著降低心血管疾病的风险。'],
  'a serious disagreement': ['The escalating conflict between economic development objectives and environmental conservation goals threatens to undermine sustainability efforts.', '经济发展目标与环境保护目标之间日益加剧的冲突有可能破坏可持续发展努力。'],
  'to face up to': ['Societies must confront the uncomfortable reality that current patterns of consumption are ecologically unsustainable.', '社会必须面对令人不安的现实，即当前的消费模式在生态上是不可持续的。'],
  'aware of surroundings': ['Making a conscious effort to reduce household waste can contribute meaningfully to mitigating environmental degradation.', '有意识地努力减少家庭废物可以为减轻环境退化做出有意义的贡献。'],
  'a result of an action': ['The far-reaching consequences of widespread deforestation extend well beyond the immediate loss of timber resources.', '大面积毁林的深远后果远远超出了直接的木材资源损失。'],
  'opposed to change': ['Conservative estimates indicate that global temperatures could rise by as much as four degrees Celsius by the end of this century.', '保守估计表明，到本世纪末全球温度可能上升多达四摄氏度。'],
  'notably large': ['Considerable investment in renewable energy infrastructure is required if nations are to meet their Paris Agreement commitments.', '如果各国要履行其巴黎协定承诺，就需要对可再生能源基础设施进行大量投资。'],
  'unchanging': ['Consistent application of evidence-based teaching practices has been shown to improve learning outcomes across diverse educational settings.', '持续应用循证教学实践已被证明可以改善不同教育环境中的学习成果。'],
  'to be part of': ['Mental health disorders constitute one of the leading causes of disability among working-age adults globally.', '心理健康障碍是全球劳动年龄成年人残疾的主要原因之一。'],
  'to build': ['The ability to construct logically coherent arguments is indispensable for success in academic research and professional practice.', '构建逻辑连贯论点的能力对于学术研究和职业实践中的成功不可或缺。'],
  'an expert advisor': ['The consultancy firm was engaged to provide expert guidance on the organisation\'s transition to sustainable business practices.', '该咨询公司被聘请就组织向可持续商业实践的过渡提供专家指导。'],
  'to use up': ['The relentless growth of consumer culture has fundamentally altered patterns of resource consumption across the globe.', '消费文化的持续增长从根本上改变了全球资源消费模式。'],
  'occurring at the same time': ['The challenge of reconciling economic growth with environmental stewardship remains one of the defining issues of contemporary politics.', '协调经济增长与环境管理的挑战仍然是当代政治的标志性问题之一。'],
  'the circumstances': ['Understanding the context in which historical events occurred is essential for developing nuanced interpretations of the past.', '理解历史事件发生的背景对于形成对过去的细致解读至关重要。'],
  'a difference between things': ['The stark contrast in healthcare outcomes between affluent and disadvantaged communities underscores persistent structural inequalities.', '富裕社区和弱势社区之间医疗成果的鲜明对比凸显了持续存在的结构性不平等。'],
  'to help bring about': ['Individual lifestyle modifications collectively contribute to the broader objective of reducing national greenhouse gas emissions.', '个人生活方式的改变共同有助于减少国家温室气体排放这一更广泛目标的实现。'],
  'giving rise to disagreement': ['The implementation of mandatory vaccination programmes remains highly controversial in many democratic societies worldwide.', '在世界许多民主社会中，实施强制性疫苗接种计划仍然极具争议。'],
};

// Process each word
let updated = 0;
let fallbackCount = 0;

for (const w of words) {
  const me = (w.meaningEn || '').toLowerCase();
  let found = false;
  
  // Try to find a matching context
  for (const [key, [example, translation]] of Object.entries(contextMap)) {
    if (me.includes(key.toLowerCase()) || w.meaning.includes(key)) {
      // Replace the placeholder with the actual word
      w.example = example;
      w.exampleTranslation = translation;
      found = true;
      updated++;
      break;
    }
  }
  
  if (!found) {
    // Fallback: generate a decent sentence based on word type
    const isVerb = w.meaning.startsWith('v.') || w.meaning.includes(' v.');
    const isNoun = w.meaning.startsWith('n.') || w.meaning.includes(' n.');
    const isAdj = w.meaning.startsWith('adj.') || w.meaning.startsWith('adv.');
    
    const mainMeaning = w.meaning.replace(/^[a-z]+\.\s*/, '').split('；')[0];
    
    if (isVerb) {
      w.example = 'The government has decided to ' + w.word + ' the relevant policy following extensive deliberation and consultation with key stakeholders.';
      w.exampleTranslation = '政府在广泛审议和与关键利益相关者协商后决定' + mainMeaning + '相关政策。';
    } else if (isNoun) {
      w.example = 'The ' + w.word + ' is widely regarded as a critical factor influencing outcomes in contemporary academic and professional contexts.';
      w.exampleTranslation = mainMeaning + '被广泛认为是影响当代学术和职业环境成果的关键因素。';
    } else if (isAdj) {
      w.example = 'The ' + w.word + ' nature of this issue has significant implications for policy development and public discourse.';
      w.exampleTranslation = '该问题的' + mainMeaning + '性质对政策制定和公共讨论具有重要意义。';
    } else {
      w.example = 'A thorough understanding of ' + w.word + ' is essential for developing comprehensive knowledge in this field.';
      w.exampleTranslation = '全面理解' + mainMeaning + '对于在这个领域发展综合知识至关重要。';
    }
    fallbackCount++;
    updated++;
  }
}

console.log('Updated: ' + updated + ' (matched: ' + (updated - fallbackCount) + ', fallback: ' + fallbackCount + ')');

// Write the updated file
function escapeForTS(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function serializeWord(w) {
  const parts = [];
  parts.push('id: "' + w.id + '"');
  parts.push('word: "' + w.word + '"');
  parts.push('phonetic: "' + w.phonetic + '"');
  parts.push('meaning: "' + escapeForTS(w.meaning) + '"');
  if (w.meaningEn) parts.push('meaningEn: "' + escapeForTS(w.meaningEn) + '"');
  parts.push('example: "' + escapeForTS(w.example) + '"');
  if (w.exampleTranslation) parts.push('exampleTranslation: "' + escapeForTS(w.exampleTranslation) + '"');
  if (w.roots) parts.push('roots: "' + escapeForTS(w.roots) + '"');
  if (w.association) parts.push('association: "' + escapeForTS(w.association) + '"');
  parts.push('level: "' + w.level + '" as const');
  if (w.tags) parts.push('tags: ' + JSON.stringify(w.tags));
  return '  { ' + parts.join(', ') + ' }';
}

const header = raw.substring(0, arrayStart);
const footer = '\n];\n';
const body = words.map(w => serializeWord(w)).join(',\n');
const output = header + '[\n' + body + ',' + footer;

fs.writeFileSync(outputPath, output, 'utf-8');
console.log('Written ' + output.length + ' bytes');
console.log('\\nSample improvements:');
for (let i = 0; i < 10; i++) {
  console.log(words[i].word + ': "' + words[i].example.substring(0, 70) + '..."');
}
