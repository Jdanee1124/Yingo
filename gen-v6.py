import re
VOCAB = r'D:\Claude cli\MyApp\yingo\src\data\vocab-sample.ts'
with open(VOCAB,'r',encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'];\s*$', '', c)
ids = re.findall(r'id:\s*"w(\d+)"', c)
cid = max(int(x) for x in ids) if ids else 0
print(f'Current: w{cid}')
d = [
('curriculum','/krɪˈkjʊləm/','n. 课程','set of courses','The curriculum was revised.','课程被修订了。','curr(跑)+icul+um'),
('pedagogy','/ˈpedəɡɒdʒi/','n. 教育学','method of teaching','Pedagogy has evolved.','教育学已发展。','ped(儿童)+agog(引导)'),
('syllabus','/ˈsɪləbəs/','n. 教学大纲','course outline','Check the syllabus.','查看教学大纲。','syl(共同)+labus'),
('diploma','/dɪˈpləʊmə/','n. 文凭','certificate','She earned her diploma.','她拿到了文凭。','dipl(双折)+oma'),
('tuition','/tjuːˈɪʃn/','n. 学费','instruction fees','Tuition is expensive.','学费很贵。','tuit(教导)+ion'),
('literacy','/ˈlɪtərəsi/','n. 读写能力','reading ability','Digital literacy is key.','数字素养是关键。','liter(文字)+acy'),
('discipline','/ˈdɪsɪplɪn/','n. 学科','field of study','Math is a discipline.','数学是一门学科。','discip(学习)+ine'),
('lecture','/ˈlektʃər/','n. 讲座','educational talk','The lecture was insightful.','讲座很有启发。','lect(读)+ure'),
('assignment','/əˈsaɪnmənt/','n. 作业','task','Submit the assignment.','提交作业。','assign+ment'),
('dissertation','/ˌdɪsəˈteɪʃn/','n. 学位论文','long essay','Her dissertation won praise.','论文获奖。','dis+sert+ation'),
('thesis','/ˈθiːsɪs/','n. 论文','argument','Defend your thesis.','答辩论文。','thes(放置)+is'),
('cognitive','/ˈkɒɡnətɪv/','adj. 认知的','mental processes','Cognitive skills matter.','认知能力重要。','cogn(知道)+itive'),
('methodology','/ˌmeθəˈdɒlədʒi/','n. 方法论','system of methods','Methodology is crucial.','方法论关键。','method+ology'),
('empirical','/ɪmˈpɪrɪkl/','adj. 实证的','based on evidence','Empirical data needed.','需要实证数据。','em+pir(尝试)+ical'),
('hypothesis','/haɪˈpɒθəsɪs/','n. 假设','proposed explanation','Test the hypothesis.','检验假设。','hypo+thesis'),
('enrollment','/ɪnˈrəʊlmənt/','n. 注册','registration','Enrollment increased.','入学增加。','en+roll+ment'),
('scholarship','/ˈskɒləʃɪp/','n. 奖学金','financial aid','She won a scholarship.','获奖学金。','scholar+ship'),
('semester','/sɪˈmestə/','n. 学期','academic term','Fall semester starts soon.','秋季学期快开始。','seme(六)+ster'),
('academy','/əˈkædəmi/','n. 学院','educational institution','Royal Academy.','皇家学院。','academ(学园)+y'),
('tutor','/ˈtjuːtə/','n. 导师','private teacher','Hire a tutor.','请家教。','tuit(看管)+or'),
('mentor','/ˈmentɔː/','n. 导师','advisor','He is my mentor.','他是我导师。','ment(心智)+or'),
('certify','/ˈsɜːtɪfaɪ/','v. 认证','confirm officially','The program is certified.','项目被认证。','cert(确定)+ify'),
('qualification','/ˌkwɒlɪfɪˈkeɪʃn/','n. 资格','official ability','Qualifications needed.','需要资格。','quali+fic+ation'),
('competence','/ˈkɒmpɪtəns/','n. 能力','ability','Language competence is key.','语言能力关键。','com+pet+ence'),
('proficiency','/prəˈfɪʃnsi/','n. 熟练','skill level','English proficiency required.','要求英语熟练。','pro+fic+iency'),
('aptitude','/ˈæptɪtjuːd/','n. 天赋','natural ability','Mathematical aptitude.','数学天赋。','apt+itude'),
('vocation','/vəʊˈkeɪʃn/','n. 职业','career calling','Teaching is her vocation.','教学是天职。','voc+ation'),
('alumni','/əˈlʌmnaɪ/','n. 校友','graduates','Alumni network.','校友网络。',''),
('faculty','/ˈfækəlti/','n. 教员','teaching staff','Faculty approved it.','教员批准了。','facul+ty'),
('seminar','/ˈsemɪnɑː/','n. 研讨会','discussion group','Research seminar.','研究研讨会。','semin(种子)+ar'),
('tutorial','/tjuːˈtɔːriəl/','n. 辅导课','small group','Online tutorial.','在线辅导。','tutor+ial'),
('plagiarism','/ˈpleɪdʒərɪzəm/','n. 剽窃','copying work','Plagiarism is forbidden.','严禁剽窃。','plagi+arism'),
('citation','/saɪˈteɪʃn/','n. 引用','source reference','Proper citation needed.','需要正确引用。','cit+ation'),
('annotation','/ˌænəˈteɪʃn/','n. 注释','explanatory note','Add annotations.','添加注释。','an+not+ation'),
('portfolio','/pɔːtˈfəʊliəʊ/','n. 作品集','work collection','Submit portfolio.','提交作品集。','port+folio'),
('assessment','/əˈsesmənt/','n. 评估','evaluation','Continuous assessment.','持续评估。','as+sess+ment'),
('examination','/ɪɡˌzæmɪˈneɪʃn/','n. 考试','formal test','Final examination.','期末考试。','ex+amin+ation'),
('feedback','/ˈfiːdbæk/','n. 反馈','response','Constructive feedback helps.','建设性反馈有帮助。','feed+back'),
('comprehension','/ˌkɒmprɪˈhenʃn/','n. 理解力','understanding','Reading comprehension.','阅读理解。','com+prehend+ion'),
('retention','/rɪˈtenʃn/','n. 记忆保持','ability to retain','Knowledge retention.','知识保持。','re+tent+ion'),
('dormitory','/ˈdɔːmɪtəri/','n. 宿舍','student housing','Campus dormitory.','校园宿舍。','dorm(睡)+itory'),
('laboratory','/ləˈbɒrətəri/','n. 实验室','research lab','Science laboratory.','科学实验室。','labor+atory'),
('auditorium','/ˌɔːdɪˈtɔːriəm/','n. 礼堂','assembly hall','Main auditorium.','主礼堂。','audit+orium'),
('commencement','/kəˈmensmənt/','n. 毕业典礼','graduation','Commencement speech.','毕业演讲。','commence+ment'),
('tenure','/ˈtenjə/','n. 终身教职','permanent position','Academic tenure.','终身教职。','ten+ure'),
('prerequisite','/priːˈrekwɪzɪt/','n. 先决条件','required prior','Math is prerequisite.','数学是先决条件。','pre+requisite'),
('elective','/ɪˈlektɪv/','n. 选修课','optional course','Choose electives.','选选修课。','elect+ive'),
('compulsory','/kəmˈpʌlsəri/','adj. 必修的','required','Compulsory subjects.','必修科目。','com+puls+ory'),
('nurture','/ˈnɜːtʃə/','v. 培育','to develop','Nurture talent.','培育人才。',''),
('foster','/ˈfɒstə/','v. 培养','to encourage','Foster creativity.','培养创造力。',''),
('innovate','/ˈɪnəveɪt/','v. 创新','to introduce new','Innovate or perish.','创新或灭亡。','in+nov+ate'),
('simulate','/ˈsɪmjuleɪt/','v. 模拟','to imitate','Simulate conditions.','模拟条件。','simul+ate'),
('disseminate','/dɪˈsemɪneɪt/','v. 传播','to spread','Disseminate knowledge.','传播知识。','dis+semin+ate'),
('elucidate','/ɪˈluːsɪdeɪt/','v. 阐明','to clarify','Elucidate the theory.','阐明理论。','e+lucid+ate'),
('underpin','/ˌʌndəˈpɪn/','v. 支撑','to support','Evidence underpins theory.','证据支撑理论。',''),
('proliferate','/prəˈlɪfəreɪt/','v. 激增','to increase','Apps have proliferated.','应用程序激增。','proli+fer+ate'),
('taxonomy','/tækˈsɒnəmi/','n. 分类学','classification','Biological taxonomy.','生物分类学。','taxo+nomy'),
('epistemology','/ɪˌpɪstɪˈmɒlədʒi/','n. 认识论','theory of knowledge','Epistemology studies knowing.','认识论研究认知。','epistemo+logy'),
('metacognition','/ˌmetəkɒɡˈnɪʃn/','n. 元认知','thinking about thinking','Metacognition aids learning.','元认知促进学习。','meta+cognition'),
('constructivism','/kənˈstrʌktɪvɪzəm/','n. 建构主义','learning theory','Constructivism in education.','教育中的建构主义。',''),
('synthesis','/ˈsɪnθəsɪs/','n. 综合','combining ideas','Synthesis of evidence.','证据综合。','syn+thesis'),
('inquiry','/ɪnˈkwaɪəri/','n. 探究','investigation','Inquiry-based learning.','探究式学习。','in+quiry'),
('cohort','/ˈkəʊhɔːt/','n. 同届学生','student group','This cohort excels.','这届学生很优秀。',''),
('acumen','/ˈækjʊmən/','n. 敏锐','keen insight','Business acumen.','商业敏锐度。',''),
('innovation','/ˌɪnəˈveɪʃn/','n. 创新','new idea','Technological innovation.','技术创新。','in+nov+ation'),
('pedagogical','/ˌpedəˈɡɒdʒɪkl/','adj. 教学法的','about teaching','Pedagogical methods.','教学法。',''),
('extracurricular','/ˌekstrəkəˈrɪkjələ/','adj. 课外的','outside class','Extracurricular activities.','课外活动。','extra+curricular'),
('vocational','/vəʊˈkeɪʃənl/','adj. 职业的','career-related','Vocational training.','职业培训。','vocat+ional'),
('interdisciplinary','/ˌɪntəˈdɪsəplɪnəri/','adj. 跨学科的','multiple fields','Interdisciplinary research.','跨学科研究。','inter+disciplinary'),
('remedial','/rɪˈmiːdiəl/','adj. 补习的','corrective','Remedial classes.','补习班。','re+med+ial'),
('didactic','/daɪˈdæktɪk/','adj. 说教的','instructive','Didactic approach.','说教式方法。','didact+ic'),
('erudite','/ˈeruːdaɪt/','adj. 博学的','very learned','Erudite scholar.','博学的学者。','e+rud+ite'),
('formative','/ˈfɔːmətɪv/','adj. 形成性的','developmental','Formative assessment.','形成性评估。','form+ative'),
('summative','/ˈsʌmətɪv/','adj. 总结性的','final evaluation','Summative assessment.','总结性评估。','summ+ative'),
('aesthetic','/iːsˈθetɪk/','adj. 审美的','relating to beauty','Aesthetic education matters.','审美教育重要。','aesthet(感觉)+ic'),
('confer','/kənˈfɜː/','v. 授予','to grant','Confer a degree.','授予学位。','con+fer(带来)'),
('matriculate','/məˈtrɪkjuleɪt/','v. 录取','to enroll','She matriculated.','她被录取了。','matric+ulate'),
('audit','/ˈɔːdɪt/','v. 旁听','to attend as listener','Audit a class.','旁听一门课。','audit(听)'),
('heuristic','/hjʊˈrɪstɪk/','adj. 启发式的','discovery-based','Heuristic approach.','启发式方法。',''),
('scaffolding','/ˈskæfəldɪŋ/','n. 支架式教学','support structure','Scaffolding in teaching.','教学中的支架。',''),
('roster','/ˈrɒstə/','n. 名单','list of names','Class roster.','班级名册。',''),
('conundrum','/kəˈnʌndrəm/','n. 难题','puzzling problem','Ethical conundrum.','伦理难题。',''),
('stagnation','/stæɡˈneɪʃn/','n. 停滞','lack of progress','Economic stagnation.','经济停滞。','stagn+ation'),
]
for w in d:
    cid += 1
    wr,ph,m,me,ex,et = w[0],w[1],w[2],w[3],w[4],w[5]
    r = w[6] if len(w) > 6 else ''
    rs = f', roots: "{r}"' if r else ''
    c += f'  {{ id: "w{cid:03d}", word: "{wr}", phonetic: "{ph}", meaning: "{m}", meaningEn: "{me}", example: "{ex}", exampleTranslation: "{et}"{rs}, level: "core" as const, tags: ["高频"] }},\n'
c += '];\n'
with open(VOCAB,'w',encoding='utf-8') as f:
    f.write(c)
print(f'Added {len(d)} words, total: {cid}')