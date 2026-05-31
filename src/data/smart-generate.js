const fs = require('fs');
const path = require('path');
const dataDir = __dirname;
const backupPath = path.join(dataDir, 'vocab-sample.bak.ts');
const outputPath = path.join(dataDir, 'vocab-sample.ts');
const examplesDir = path.join(dataDir, 'examples');

const raw = fs.readFileSync(backupPath, 'utf-8');
const clean = raw.replace(/ as const/g, '');
const words = eval(clean.substring(clean.indexOf('['), clean.lastIndexOf(']') + 1));

const allExamples = {};
if (fs.existsSync(examplesDir)) {
  for (const file of fs.readdirSync(examplesDir).filter(f => f.endsWith('.json')).sort()) {
    Object.assign(allExamples, JSON.parse(fs.readFileSync(path.join(examplesDir, file), 'utf-8')));
  }
}
console.log('Loaded ' + Object.keys(allExamples).length + ' hand-crafted examples');

function detectField(w) {
  const m = (w.meaning + ' ' + (w.meaningEn || '')).toLowerCase();
  if (/教育|school|student|learn|teach|educat|curriculum|academic/.test(m)) return 'edu';
  if (/环境|environ|climate|ecolog|nature|forest|pollut|sustain|energy/.test(m)) return 'env';
  if (/健康|health|disease|medic|hospital|patient|physical/.test(m)) return 'health';
  if (/技术|technolog|digital|comput|automat|artificial|machine/.test(m)) return 'tech';
  if (/经济|econom|financ|market|trade|business|invest/.test(m)) return 'econ';
  if (/社会|social|communit|culture|divers|equal|poverty/.test(m)) return 'soc';
  if (/法律|law|legal|regulat|legislat|enforce|justice/.test(m)) return 'law';
  if (/科学|research|scientif|experiment|evidence/.test(m)) return 'sci';
  if (/心理|cognit|behavio|emotion|psycholog|stress/.test(m)) return 'psy';
  if (/政治|govern|democrac|parliament|authorit/.test(m)) return 'pol';
  return 'gen';
}

const ctx = {
  edu: {
    v: ['Educational researchers have demonstrated that institutions which {W} inclusive pedagogy achieve significantly better learning outcomes.', 'Many universities have begun to {W} innovative assessment strategies that better reflect students genuine intellectual capabilities.', 'Studies suggest that educators who {W} differentiated instruction methods see marked improvements in student engagement and achievement.', 'The capacity to {W} complex academic information is essential for students pursuing advanced qualifications in higher education.', 'Evidence indicates that schools which {W} evidence-based teaching practices produce measurably superior educational outcomes.'],
    n: ['The role of {w} in shaping educational outcomes has been extensively studied across diverse academic contexts.', 'Effective {w} requires a comprehensive understanding of both theoretical foundations and evidence-based practice in education.', 'Understanding the complexities of {w} is crucial for developing effective strategies to improve teaching quality and student learning.', 'Research into {w} has yielded important insights into the factors that drive academic achievement and student development.', 'The significance of {w} in promoting equitable access to quality education is increasingly recognised by policymakers worldwide.'],
    a: ['The {w} nature of contemporary educational challenges demands innovative and evidence-based policy responses from all stakeholders.', 'The {w} impact of early childhood education on long-term cognitive and social development is well documented.', 'The {w} relationship between teaching quality and student outcomes underscores the critical need for sustained professional development.', 'The {w} effects of socioeconomic disadvantage on educational achievement have been confirmed by numerous longitudinal studies.', 'The {w} importance of inclusive education in promoting social equity and cohesion cannot be overstated.']
  },
  env: {
    v: ['Environmental scientists urge governments to {W} immediate protective measures to safeguard vulnerable ecosystems from further degradation.', 'The international community must {W} collaborative strategies to address the escalating global environmental crisis effectively.', 'Research demonstrates that communities which {W} sustainable resource management experience significantly lower rates of environmental degradation.', 'Many conservation organisations {W} the preservation of biodiversity as fundamental to maintaining the ecological balance of natural systems.', 'Experts recommend that nations {W} comprehensive environmental protection frameworks to ensure long-term ecological sustainability.'],
    n: ['The {w} of natural ecosystems is fundamental to maintaining the ecological balance upon which human civilisation depends.', 'Effective management of {w} requires collaboration between scientists, policymakers, and local communities across all levels of governance.', 'The impact of {w} on global food security and public health cannot be underestimated in the context of climate change.', 'Understanding the relationship between {w} and climate change is essential for developing effective and sustainable environmental solutions.', 'Investment in {w} has been shown to yield significant returns in terms of both environmental protection and economic resilience.'],
    a: ['The {w} consequences of environmental degradation extend far beyond immediate ecological damage to affect human health and well-being.', 'The {w} increase in global average temperatures demands urgent and coordinated international policy responses across all sectors.', 'The {w} effects of industrial pollution on aquatic ecosystems have been extensively documented in environmental research.', 'The {w} impact of deforestation on local and global climate patterns underscores the urgent need for conservation action.', 'The {w} relationship between environmental quality and human well-being is increasingly recognised by governments worldwide.']
  },
  health: {
    v: ['Healthcare professionals recommend that individuals {W} regular physical activity to significantly reduce the risk of chronic diseases.', 'Public health authorities urge communities to {W} preventive health measures to combat the spread of infectious diseases.', 'Research indicates that patients who {W} healthy lifestyle modifications experience significantly better long-term treatment outcomes.', 'Medical experts advocate that healthcare systems {W} integrated approaches to addressing both physical and mental health needs.', 'Studies consistently demonstrate that early intervention can {W} the severity and progression of many chronic health conditions.'],
    n: ['The impact of {w} on individual well-being and societal productivity is a major area of ongoing public health research.', 'Access to quality {w} remains a fundamental challenge in many developing countries and underserved urban communities.', 'Understanding the relationship between {w} and lifestyle factors is essential for developing effective prevention and treatment strategies.', 'The role of {w} in promoting population health has gained increasing recognition among policymakers and healthcare providers.', 'Investment in {w} infrastructure is critical for building resilient healthcare systems capable of responding to emerging health crises.'],
    a: ['The {w} consequences of air pollution on respiratory health have been extensively documented in medical and epidemiological literature.', 'The {w} relationship between nutrition and chronic disease risk is well established across multiple clinical research studies.', 'The {w} impact of mental health disorders on quality of life demands comprehensive and accessible treatment services.', 'The {w} effects of sleep deprivation on cognitive function and physical health are increasingly recognised by medical professionals.', 'The {w} importance of preventive healthcare in reducing long-term treatment costs and improving population health is well documented.']
  },
  tech: {
    v: ['Technology companies continue to {W} increasingly sophisticated systems that have the potential to transform multiple industries.', 'Organisations must {W} digital transformation strategies to remain competitive in an increasingly technology-driven global marketplace.', 'Researchers are developing new frameworks to {W} the ethical implications of widespread artificial intelligence deployment.', 'The ability to {W} emerging technologies effectively is becoming essential for professional success in the modern economy.', 'Industry leaders recommend that organisations {W} robust cybersecurity measures to protect against increasingly sophisticated digital threats.'],
    n: ['The rapid evolution of {w} has created both unprecedented opportunities and significant ethical challenges for modern society.', 'Understanding the implications of {w} is essential for policymakers seeking to regulate emerging technologies responsibly.', 'The relationship between {w} and changing employment patterns is a subject of growing academic and public interest.', 'Investment in {w} research and development is critical for maintaining national economic competitiveness in the global market.', 'The transformative impact of {w} on communication, education, and social interaction has been profound and far-reaching.'],
    a: ['The {w} pace of technological change presents both exciting opportunities and significant challenges for the modern workforce.', 'The {w} advancement of artificial intelligence has prompted urgent and wide-ranging debates about the future of human employment.', 'The {w} influence of digital platforms on information consumption and public discourse is a growing area of concern.', 'The {w} transformation of traditional industries through automation and digitisation has significant implications for employment.', 'The {w} impact of emerging technologies on privacy rights and civil liberties demands careful regulatory consideration.']
  },
  econ: {
    v: ['Economists argue that governments should {W} fiscal policies that promote sustainable, inclusive, and equitable economic growth.', 'Financial experts recommend that individuals {W} diversified investment strategies to effectively mitigate economic uncertainty.', 'The ability to {W} complex financial information is increasingly valued in the modern professional environment.', 'Central banks often {W} monetary policy adjustments to stabilise national economies during periods of significant volatility.', 'Organisations that {W} responsible business practices tend to enjoy greater long-term profitability and enhanced stakeholder trust.'],
    n: ['The relationship between {w} and social inequality is one of the most pressing issues facing modern economies worldwide.', 'Understanding the dynamics of {w} is essential for developing effective economic policy and promoting sustainable prosperity.', 'The impact of {w} on employment levels, wage growth, and social mobility has been the subject of extensive research.', 'Effective management of {w} requires careful consideration of both immediate economic needs and long-term sustainability goals.', 'The role of {w} in driving innovation, employment, and economic development is well established in the academic literature.'],
    a: ['The {w} consequences of economic recession extend well beyond financial markets to affect the most vulnerable members of society.', 'The {w} relationship between economic growth and income distribution is a central concern of modern development economics.', 'The {w} impact of globalisation on local and national economies has been the subject of extensive academic and public debate.', 'The {w} importance of financial literacy education in promoting individual and national economic well-being is increasingly recognised.', 'The {w} effects of inflation and rising living costs on household purchasing power have significant social welfare implications.']
  },
  soc: {
    v: ['Social scientists recommend that communities {W} inclusive practices to promote social cohesion and cross-cultural understanding.', 'Governments should {W} policies that directly address the root causes of social inequality and marginalisation.', 'Researchers have found that societies which {W} diversity and tolerance tend to demonstrate greater resilience and innovation.', 'The ability to {W} complex social dynamics is essential for effective community leadership and participatory governance.', 'Advocates urge institutions to {W} equitable practices that ensure fair treatment for all members of diverse societies.'],
    n: ['The role of {w} in shaping community well-being and social cohesion is a fundamental area of sociological research.', 'Understanding the dynamics of {w} is essential for developing policies that promote inclusive and equitable societies.', 'The impact of {w} on individual life chances and opportunities for social mobility is well documented in the literature.', 'Effective engagement with {w} requires empathy, cultural awareness, and a genuine commitment to social justice principles.', 'The relationship between {w} and public health outcomes has gained increasing attention from researchers and policymakers alike.'],
    a: ['The {w} nature of contemporary social challenges demands collaborative and multi-sectoral policy responses from all levels of government.', 'The {w} impact of cultural diversity on community resilience, innovation, and social vitality is increasingly recognised.', 'The {w} effects of social media use on interpersonal relationships and adolescent mental health are a growing concern.', 'The {w} importance of social inclusion and community participation in promoting collective well-being cannot be overstated.', 'The {w} relationship between social disadvantage and poor health outcomes underscores the need for targeted interventions.']
  },
  law: {
    v: ['Legal experts argue that governments should {W} legislation that adequately protects the fundamental rights of vulnerable populations.', 'International organisations urge nations to {W} legal frameworks that ensure accountability, transparency, and the rule of law.', 'The ability to {W} legal principles effectively is essential for maintaining justice and upholding democratic governance.', 'Courts regularly {W} interpretations of existing legislation to address emerging social, technological, and environmental challenges.', 'Advocates recommend that legal systems {W} restorative justice approaches to complement traditional punitive sentencing measures.'],
    n: ['The application of {w} in contemporary societies requires careful consideration of competing rights, interests, and obligations.', 'Understanding the principles of {w} is fundamental to maintaining democratic governance and protecting individual freedoms.', 'The role of {w} in regulating emerging technologies and digital commerce is a subject of growing public debate.', 'Effective enforcement of {w} is essential for maintaining public confidence in the justice system and legal institutions.', 'The relationship between {w} and social justice remains a central and enduring theme in legal and political philosophy.'],
    a: ['The {w} implications of proposed legislative reforms require careful scrutiny by legal experts and parliamentary committees.', 'The {w} framework governing data protection and digital privacy has become increasingly complex in the modern era.', 'The {w} status of emerging technologies raises important questions about liability, accountability, and consumer protection.', 'The {w} basis for environmental regulation varies significantly across different national and international jurisdictions.', 'The {w} profession faces significant challenges in adapting to the rapid pace of technological and social transformation.']
  },
  sci: {
    v: ['Researchers continue to {W} new methodologies that enhance the rigour, reliability, and reproducibility of scientific investigation.', 'The scientific community urges policymakers to {W} evidence-based approaches to addressing complex global challenges.', 'Studies demonstrate that laboratories which {W} rigorous experimental protocols produce more reliable and replicable results.', 'Scientists recommend that research institutions {W} open-access publication practices to maximise knowledge dissemination.', 'The ability to {W} data accurately, interpret findings critically, and communicate results clearly is fundamental to scientific progress.'],
    n: ['The significance of {w} in advancing our understanding of the natural world and human health cannot be overstated.', 'Understanding the methodology of {w} is essential for evaluating the validity and reliability of research claims.', 'The role of {w} in informing evidence-based policy has gained increasing recognition among governments and institutions.', 'Advances in {w} have the potential to revolutionise our approach to solving complex environmental and medical problems.', 'The relationship between {w} and technological innovation is well established and mutually reinforcing.'],
    a: ['The {w} method provides a systematic and rigorous framework for investigating phenomena and testing hypotheses.', 'The {w} evidence supporting the theory of anthropogenic climate change is overwhelming and virtually conclusive.', 'The {w} rigour of the study was significantly enhanced through the use of double-blind experimental design and peer review.', 'The {w} community has reached broad consensus on the significance and implications of these research findings.', 'The {w} basis for these conclusions has been independently validated through multiple replication studies across different laboratories.']
  },
  psy: {
    v: ['Psychologists recommend that individuals {W} mindfulness and meditation techniques to effectively manage stress and improve well-being.', 'Research demonstrates that people who {W} cognitive reframing strategies experience significant and sustained reductions in anxiety.', 'Mental health professionals urge communities to {W} supportive environments that actively promote psychological resilience.', 'Studies suggest that early therapeutic intervention can {W} the likelihood and severity of chronic mental health disorders.', 'Therapists encourage patients to {W} evidence-based coping strategies for managing difficult emotions and maladaptive behaviours.'],
    n: ['The impact of {w} on individual well-being, relationships, and social functioning is a major area of psychological research.', 'Understanding the underlying mechanisms of {w} is essential for developing effective and evidence-based therapeutic interventions.', 'The relationship between {w} and environmental factors such as poverty, trauma, and social isolation is well established.', 'The role of {w} in shaping human behaviour, decision-making, and interpersonal relationships has profound implications.', 'Research into {w} has revealed important insights into the psychological factors that promote resilience and recovery.'],
    a: ['The {w} effects of chronic stress on cognitive function, physical health, and immune response are well documented.', 'The {w} relationship between adverse childhood experiences and adult mental health outcomes is a key research area.', 'The {w} importance of secure early attachment in shaping lifelong emotional development and relationship patterns cannot be overstated.', 'The {w} impact of prolonged social isolation on mental health demands urgent and coordinated attention from healthcare providers.', 'The {w} effects of psychological trauma on brain development and neuroplasticity have been confirmed by neuroimaging studies.']
  },
  pol: {
    v: ['Political analysts argue that governments should {W} transparent governance practices to maintain and strengthen public trust.', 'International organisations urge nations to {W} peaceful diplomatic solutions before resorting to economic sanctions or military action.', 'The ability to {W} political challenges through constructive dialogue is essential for maintaining stable democratic governance.', 'Citizens expect their elected representatives to {W} policies that genuinely reflect the interests and values of the electorate.', 'Democratic societies must {W} robust institutional mechanisms that ensure accountability and prevent the concentration of power.'],
    n: ['The role of {w} in shaping national policy agendas and international relations is a fundamental area of political study.', 'Understanding the dynamics of {w} is essential for citizens seeking to engage meaningfully in democratic processes and civic life.', 'The impact of {w} on economic development, social welfare, and individual rights varies significantly across different political systems.', 'Effective {w} requires a delicate balance between competing interests and an unwavering commitment to the common good.', 'The relationship between {w} and media influence has profound implications for public opinion formation and policy outcomes.'],
    a: ['The {w} implications of the proposed constitutional reforms require careful consideration by all branches of government.', 'The {w} landscape of the region has been fundamentally transformed by recent democratic elections and political realignments.', 'The {w} consequences of policy decisions on fiscal austerity extend far beyond their immediate economic effects.', 'The {w} importance of maintaining strong democratic institutions and the rule of law during times of crisis cannot be overstated.', 'The {w} relationship between governance quality, institutional strength, and long-term economic development is well established.']
  },
  gen: {
    v: ['Experts recommend that individuals {W} informed decisions based on comprehensive evidence, careful analysis, and sound judgement.', 'Research demonstrates that organisations which {W} proactive and adaptive strategies achieve significantly better long-term outcomes.', 'The capacity to {W} complex tasks effectively under pressure is increasingly valued in professional and academic contexts.', 'Studies suggest that communities which {W} collaborative approaches to problem-solving experience greater social cohesion and trust.', 'Professionals who {W} continuous learning and personal development tend to be more successful in rapidly evolving work environments.'],
    n: ['The significance of {w} in contemporary society has been the subject of extensive academic inquiry and public discussion.', 'Understanding the multifaceted nature of {w} is essential for developing effective strategies to address complex modern challenges.', 'The impact of {w} on individual and community well-being is a growing area of research, policy, and public interest.', 'Effective engagement with {w} requires critical thinking, intellectual humility, and a willingness to consider diverse perspectives.', 'The relationship between {w} and broader social, economic, and environmental trends is well documented in the academic literature.'],
    a: ['The {w} nature of contemporary global challenges demands innovative, collaborative, and evidence-based approaches to solutions.', 'The {w} impact of globalisation on local communities and national economies demands careful consideration in policy development.', 'The {w} effects of rapid technological change on employment patterns and social structures are a subject of growing concern.', 'The {w} importance of fostering inclusive, resilient, and sustainable communities is increasingly recognised by policymakers worldwide.', 'The {w} relationship between individual choices and collective outcomes underscores the shared responsibility for societal well-being.']
  }
};

function genSentence(w) {
  const field = detectField(w);
  const isV = w.meaning.startsWith('v.') || w.meaning.includes(' v.');
  const isN = w.meaning.startsWith('n.') || w.meaning.includes(' n.');
  const type = isV ? 'v' : isN ? 'n' : 'a';
  const templates = (ctx[field] || ctx.gen)[type];
  const idx = parseInt(w.id.replace('w', ''));
  let s = templates[idx % templates.length].replace(/\{W\}/g, w.word).replace(/\{w\}/g, w.word);
  const mainM = w.meaning.replace(/^[a-z]+\.\s*/, '').split('\uFF1B')[0];
  const fieldZh = {edu:'教育',env:'环境',health:'健康',tech:'技术',econ:'经济',soc:'社会',law:'法律',sci:'科学',psy:'心理',pol:'政治',gen:'该领域'};
  const t = '\u5728' + (fieldZh[field]||'该领域') + '\u9886\u57DF\uFF0C' + w.word + '\uFF08' + mainM + '\uFF09\u662F\u4E00\u4E2A\u91CD\u8981\u7684\u6982\u5FF5\uFF0C\u5BF9\u5B66\u672F\u7814\u7A76\u548C\u5B9E\u8DF5\u5E94\u7528\u5177\u6709\u6DF1\u8FDC\u610F\u4E49\u3002';
  return { e: s, t: t };
}

let hc = 0, gen = 0;
for (const w of words) {
  if (allExamples[w.id]) { w.example = allExamples[w.id].e; w.exampleTranslation = allExamples[w.id].t; hc++; }
  else { const r = genSentence(w); w.example = r.e; w.exampleTranslation = r.t; gen++; }
}
console.log('Hand-crafted: ' + hc + ', Smart-generated: ' + gen);

function esc(s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }
function serWord(w) {
  const p = ['id: "'+w.id+'"','word: "'+w.word+'"','phonetic: "'+w.phonetic+'"','meaning: "'+esc(w.meaning)+'"'];
  if (w.meaningEn) p.push('meaningEn: "'+esc(w.meaningEn)+'"');
  p.push('example: "'+esc(w.example)+'"');
  if (w.exampleTranslation) p.push('exampleTranslation: "'+esc(w.exampleTranslation)+'"');
  if (w.roots) p.push('roots: "'+esc(w.roots)+'"');
  if (w.association) p.push('association: "'+esc(w.association)+'"');
  p.push('level: "'+w.level+'" as const');
  if (w.tags) p.push('tags: '+JSON.stringify(w.tags));
  return '  { '+p.join(', ')+' }';
}

const header = raw.substring(0, raw.indexOf('= [') + 2);
const body = words.map(w => serWord(w)).join(',\n');
const output = header + '[\n' + body + ',\n];\n';
fs.writeFileSync(outputPath, output, 'utf-8');
console.log('Written ' + output.length + ' bytes');
[0,100,300,600,900,1200,1400].forEach(i => { if(i<words.length) console.log(words[i].word+': '+words[i].example.substring(0,80)+'...'); });


