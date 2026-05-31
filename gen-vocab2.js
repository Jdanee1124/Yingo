const fs = require('fs');
const path = 'D:\\Claude cli\\MyApp\\yingo\\src\\data\\vocab-sample.ts';
let content = fs.readFileSync(path, 'utf8');
// Remove closing bracket
content = content.replace(/\];\s*$/, '');

const words = [
// w101-w200: 经济与社会
['w101','consequence','/ˈkɒnsɪkwəns/','n. 后果','a result of something','Climate change has serious consequences.','气候变化有严重后果。','con-(共同)+sequ(跟随)+ence','','core'],
['w102','considerable','/kənˈsɪdərəbl/','adj. 相当大的','large in size or amount','Considerable progress was made.','取得了相当大的进步。','con-(加强)+sider(思考)+able','','core'],
['w103','consistent','/kənˈsɪstənt/','adj. 一致的','acting in the same way','Be consistent in your approach.','保持方法一致。','con-(共同)+sist(站)+ent','','core'],
['w104','constant','/ˈkɒnstənt/','adj. 持续的','occurring continuously','The noise is constant.','噪音持续不断。','con-(加强)+stant(站)','','core'],
['w105','constitute','/ˈkɒnstɪtjuːt/','v. 构成','to form or make up','Women constitute half the workforce.','女性占劳动力的一半。','con-(加强)+stitute(建立)','','core'],
['w106','construct','/kənˈstrʌkt/','v. 建造','to build or create','They constructed a new building.','他们建造了新建筑。','con-(加强)+struct(建造)','','core'],
['w107','consultant','/kənˈsʌltənt/','n. 顾问','an expert who gives advice','We hired a consultant.','我们雇了顾问。','con-(加强)+sult(召集)+ant','','core'],
['w108','consume','/kənˈsjuːm/','v. 消费','to use up','People consume too much energy.','人们消耗太多能源。','con-(加强)+sume(拿)','','core'],
['w109','contemporary','/kənˈtemprəri/','adj. 当代的','belonging to the present time','Contemporary art is diverse.','当代艺术很多样。','con-(共同)+tempor(时间)+ary','','core'],
['w110','controversy','/ˈkɒntrəvɜːsi/','n. 争论','public disagreement','The policy caused controversy.','政策引起了争论。','contra-(相反)+vers(转)+y','','core'],
['w111','convention','/kənˈvenʃn/','n. 惯例；大会','a traditional practice','Social conventions change over time.','社会习俗随时间变化。','con-(共同)+vent(来)+ion','','core'],
['w112','convince','/kənˈvɪns/','v. 说服','to make someone believe','She convinced him to stay.','她说服他留下。','con-(加强)+vinc(征服)','','core'],
['w113','core','/kɔː/','n. 核心','the most important part','Education is at the core of development.','教育是发展的核心。','','','core'],
['w114','corporate','/ˈkɔːpərət/','adj. 公司的','relating to a corporation','Corporate responsibility matters.','公司责任很重要。','corpor(身体)+ate','','core'],
['w115','correspond','/ˌkɒrɪˈspɒnd/','v. 对应','to match or be equivalent','The data corresponds to our theory.','数据与理论对应。','cor-(共同)+respond(回答)','','core'],
['w116','crucial','/ˈkruːʃl/','adj. 关键的','of great importance','This is a crucial moment.','这是关键时刻。','','','core'],
['w117','currency','/ˈkʌrənsi/','n. 货币；流行','money in use','Digital currency is growing.','数字货币在增长。','curr(流)+ency','','core'],
['w118','curriculum','/kəˈrɪkjələm/','n. 课程','the subjects taught in school','The curriculum needs updating.','课程需要更新。','','','core'],
['w119','debate','/dɪˈbeɪt/','n./v. 辩论','a formal discussion','There was a heated debate.','有一场激烈辩论。','de-(加强)+bate(打)','','core'],
['w120','decline','/dɪˈklaɪn/','v./n. 下降','to decrease or refuse','Population is in decline.','人口在下降。','de-(向下)+cline(倾斜)','','core'],
['w121','dedicate','/ˈdedɪkeɪt/','v. 致力于','to devote to a purpose','She dedicated herself to research.','她致力于研究。','de-(加强)+dic(说)+ate','','core'],
['w122','deficit','/ˈdefɪsɪt/','n. 赤字；不足','a shortage','The budget deficit is growing.','预算赤字在增长。','de-(离开)+fic(做)+it','','core'],
['w123','define','/dɪˈfaɪn/','v. 定义','to explain the meaning','How do you define success?','你怎么定义成功？','de-(加强)+fine(界限)','','core'],
['w124','deliberate','/dɪˈlɪbərət/','adj. 故意的','done on purpose','It was a deliberate decision.','这是故意的决定。','de-(加强)+liber(衡量)+ate','','core'],
['w125','demand','/dɪˈmɑːnd/','n./v. 需求','a strong request','Demand for energy is increasing.','能源需求在增加。','de-(加强)+mand(命令)','','core'],
['w126','democracy','/dɪˈmɒkrəsi/','n. 民主','a system of government','Democracy requires participation.','民主需要参与。','demo(人民)+cracy(统治)','','core'],
['w127','demonstrate','/ˈdemənstreɪt/','v. 证明；演示','to show clearly','The experiment demonstrates the theory.','实验证明了理论。','de-(加强)+monstr(展示)+ate','','core'],
['w128','deny','/dɪˈnaɪ/','v. 否认','to say something is not true','He denied the accusations.','他否认了指控。','','','core'],
['w129','depict','/dɪˈpɪkt/','v. 描述','to show or represent','The painting depicts a landscape.','这幅画描绘了风景。','de-(加强)+pict(画)','','core'],
['w130','deploy','/dɪˈplɔɪ/','v. 部署','to use or position','The army deployed troops.','军队部署了部队。','de-(加强)+ploy(折叠)','','core'],
['w131','derive','/dɪˈraɪv/','v. 源于','to originate from','Many words derive from Latin.','很多词源于拉丁语。','de-(离开)+rive(河流)','','core'],
['w132','design','/dɪˈzaɪn/','v./n. 设计','to plan and create','She designed a new logo.','她设计了新标志。','de-(加强)+sign(标记)','','core'],
['w133','despair','/dɪˈspeə/','n./v. 绝望','loss of hope','Don\'t despair, things will improve.','别绝望，会好起来的。','de-(离开)+spair(希望)','','core'],
['w134','destination','/ˌdestɪˈneɪʃn/','n. 目的地','the place someone is going','Paris is a popular destination.','巴黎是热门目的地。','de-(加强)+stin(站)+ation','','core'],
['w135','determine','/dɪˈtɜːmɪn/','v. 决定','to decide or establish','She determined the cause.','她确定了原因。','de-(加强)+termin(界限)+e','','core'],
['w136','devote','/dɪˈvəʊt/','v. 致力于','to give time or resources','He devoted his life to science.','他献身科学。','de-(加强)+vow(发誓)','','core'],
['w137','dimension','/daɪˈmenʃn/','n. 维度；方面','a measurable aspect','This adds a new dimension.','这增加了新维度。','di-(分开)+mens(测量)+ion','','core'],
['w138','diminish','/dɪˈmɪnɪʃ/','v. 减少','to make smaller','The pain gradually diminished.','疼痛逐渐减轻。','di-(加强)+min(小)+ish','','core'],
['w139','discipline','/ˈdɪsɪplɪn/','n. 纪律；学科','a field of study','Mathematics is a discipline.','数学是一门学科。','discip(学习)+line','','core'],
['w140','discrimination','/dɪˌskrɪmɪˈneɪʃn/','n. 歧视','unfair treatment','Racial discrimination is illegal.','种族歧视是非法的。','dis-(分开)+crim(判断)+ation','','core'],
['w141','displace','/dɪsˈpleɪs/','v. 取代','to take the place of','Machines displace workers.','机器取代工人。','dis-(离开)+place(放置)','','core'],
['w142','dispute','/dɪˈspjuːt/','n./v. 争论','a disagreement','There is a dispute over land.','有土地纠纷。','dis-(分开)+pute(思考)','','core'],
['w143','distinct','/dɪˈstɪŋkt/','adj. 不同的；明显的','clearly different','Two distinct approaches were used.','用了两种不同的方法。','dis-(分开)+tinct(刺)','','core'],
['w144','distinguish','/dɪˈstɪŋɡwɪʃ/','v. 区分','to recognize differences','Can you distinguish between them?','你能区分它们吗？','dis-(分开)+tingu(刺)+ish','','core'],
['w145','distribute','/dɪˈstrɪbjuːt/','v. 分配','to give out to several people','Food was distributed to the poor.','食物分发给了穷人。','dis-(分开)+tribute(给予)','','core'],
['w146','diverse','/daɪˈvɜːs/','adj. 多样的','showing variety','The population is diverse.','人口很多样。','di-(分开)+vers(转)+e','','core'],
['w147','domestic','/dəˈmestɪk/','adj. 国内的；家庭的','relating to one\'s own country','Domestic flights are cheaper.','国内航班更便宜。','dom(家)+estic','','core'],
['w148','dominate','/ˈdɒmɪneɪt/','v. 主导','to have control over','One company dominates the market.','一家公司主导市场。','domin(统治)+ate','','core'],
['w149','dramatic','/drəˈmætɪk/','adj. 戏剧性的','sudden and dramatic','There was a dramatic change.','有戏剧性的变化。','drama(戏剧)+tic','','core'],
['w150','duration','/djuˈreɪʃn/','n. 持续时间','the length of time','The duration of the course is 6 months.','课程持续6个月。','dur(持久)+ation','','core'],
];

for (const w of words) {
  const [id, word, phonetic, meaning, meaningEn, example, exampleTranslation, roots, association, level] = w;
  content += `  { id: "${id}", word: "${word}", phonetic: "${phonetic}", meaning: "${meaning}", meaningEn: "${meaningEn}", example: "${example}", exampleTranslation: "${exampleTranslation}"${roots ? `, roots: "${roots}"` : ''}${association ? `, association: "${association}"` : ''}, level: "${level}" as const, tags: ["高频"] },\n`;
}

content += '];\n';
fs.writeFileSync(path, content, 'utf8');
console.log('Added ' + words.length + ' words (total now: ' + (content.match(/id: /g) || []).length + ')');
