import re
VOCAB = r'D:\Claude cli\MyApp\yingo\src\data\vocab-sample.ts'
with open(VOCAB,'r',encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'];\s*$', '', c)
ids = re.findall(r'id:\s*"w(\d+)"', c)
cid = max(int(x) for x in ids) if ids else 0
print(f'Current: w{cid}')
d = [
('demography','/diːˈmɒɡrəfi/','n. 人口统计学','study of population','Demography shows aging trends.','人口统计显示老龄化趋势。','demo(人民)+graphy'),
('migration','/maɪˈɡreɪʃn/','n. 迁移','movement of people','Mass migration reshapes cities.','大规模迁移重塑城市。','migr(迁移)+ation'),
('urbanization','/ˌɜːbənaɪˈzeɪʃn/','n. 城市化','growth of cities','Rapid urbanization challenges planners.','快速城市化挑战规划者。','urban(城市)+ization'),
('inequality','/ˌɪnɪˈkwɒləti/','n. 不平等','lack of equality','Income inequality is growing.','收入不平等在加剧。','in+equality'),
('discrimination','/dɪˌskrɪmɪˈneɪʃn/','n. 歧视','unfair treatment','Racial discrimination is illegal.','种族歧视是非法的。','dis+crim(判断)+ination'),
('poverty','/ˈpɒvəti/','n. 贫困','extreme poor','Poverty affects millions.','贫困影响数百万人。','pover(贫穷)+ty'),
('welfare','/ˈwelfeə/','n. 福利','government aid','Social welfare programs help.','社会福利项目有帮助。','well+fare(过)'),
('citizenship','/ˈsɪtɪzənʃɪp/','n. 公民身份','legal status','Dual citizenship is allowed.','允许双重国籍。','citizen+ship'),
('bureaucracy','/bjʊˈrɒkrəsi/','n. 官僚体制','complex administration','Bureaucracy slows reform.','官僚体制减缓改革。','bureau(办公室)+cracy(统治)'),
('corruption','/kəˈrʌpʃn/','n. 腐败','dishonest conduct','Corruption undermines trust.','腐败破坏信任。','cor+rupt(破)+ion'),
('sovereignty','/ˈsɒvrənti/','n. 主权','supreme authority','National sovereignty is sacred.','国家主权神圣不可侵犯。','sovereign(至高)+ty'),
('legislation','/ˌledʒɪsˈleɪʃn/','n. 立法','making laws','New legislation was passed.','新法律被通过了。','legis(法律)+lation'),
('jurisdiction','/ˌdʒʊərɪsˈdɪkʃn/','n. 司法权','legal authority','Outside our jurisdiction.','超出我们的司法管辖。','juris(法律)+dict(说)+ion'),
('litigation','/ˌlɪtɪˈɡeɪʃn/','n. 诉讼','legal action','Civil litigation is costly.','民事诉讼费用很高。','litig(争论)+ation'),
('prosecution','/ˌprɒsɪˈkjuːʃn/','n. 起诉','legal proceeding','Criminal prosecution followed.','随后进行了刑事起诉。','pro+secut(跟随)+ion'),
('verdict','/ˈvɜːdɪkt/','n. 裁决','jury decision','The verdict was unanimous.','裁决是一致的。','ver(真实)+dict(说)'),
('testimony','/ˈtestɪməni/','n. 证词','sworn statement','Witness testimony was crucial.','证人证词很关键。','test(证据)+imony'),
('defendant','/dɪˈfendənt/','n. 被告','accused person','The defendant pleaded not guilty.','被告不认罪。','de+fend(打击)+ant'),
('plaintiff','/ˈpleɪntɪf/','n. 原告','person suing','The plaintiff filed a lawsuit.','原告提起了诉讼。'),
('acquit','/əˈkwɪt/','v. 宣判无罪','to declare not guilty','The jury acquitted him.','陪审团宣判他无罪。','ac+quit(释放)'),
('convict','/kənˈvɪkt/','v. 定罪','to find guilty','He was convicted of fraud.','他被判犯有欺诈罪。','con+vict(征服)'),
('amend','/əˈmend/','v. 修正','to change a law','Amend the constitution.','修正宪法。','a+mend(改正)'),
('repeal','/rɪˈpiːl/','v. 废除','to revoke a law','Repeal outdated regulations.','废除过时的规定。'),
('enact','/ɪˈnækt/','v. 颁布','to make into law','Enact new policies.','颁布新政策。','en+act(法令)'),
('stipulate','/ˈstɪpjuleɪt/','v. 规定','to specify conditions','The contract stipulates deadlines.','合同规定了截止日期。'),
('comply','/kəmˈplaɪ/','v. 遵守','to obey rules','Comply with regulations.','遵守规定。','com+ply(填满)'),
('sanction','/ˈsæŋkʃn/','n. 制裁','penalty or approval','Economic sanctions imposed.','实施了经济制裁。','sanct(神圣)+ion'),
('ratify','/ˈrætɪfaɪ/','v. 批准','to formally approve','Ratify the treaty.','批准条约。','rat(确定)+ify'),
('inflation','/ɪnˈfleɪʃn/','n. 通货膨胀','rising prices','Inflation erodes purchasing power.','通胀侵蚀购买力。','in+flat(吹)+ion'),
('recession','/rɪˈseʃn/','n. 衰退','economic decline','The economy entered recession.','经济进入衰退。','re+cess(走)+ion'),
('GDP','/ˌdʒiːdiːˈpiː/','n. 国内生产总值','gross domestic product','GDP growth slowed.','GDP增长放缓。'),
('subsidy','/ˈsʌbsɪdi/','n. 补贴','government funding','Agricultural subsidies support farmers.','农业补贴支持农民。','sub+sid(坐)+y'),
('tariff','/ˈtærɪf/','n. 关税','import tax','Tariffs affect trade.','关税影响贸易。'),
('deficit','/ˈdefɪsɪt/','n. 赤字','shortage','Budget deficit grows.','预算赤字增长。','de+fic(做)+it'),
('surplus','/ˈsɜːpləs/','n. 盈余','excess','Trade surplus benefits economy.','贸易顺差有利于经济。','sur+plus(多)'),
('commodity','/kəˈmɒdəti/','n. 商品','tradeable goods','Commodity prices fluctuate.','商品价格波动。','com+mod(适当)+ity'),
('entrepreneur','/ˌɒntrəprəˈnɜː/','n. 企业家','business founder','Young entrepreneurs innovate.','年轻企业家创新。'),
('monopoly','/məˈnɒpəli/','n. 垄断','exclusive control','Break up the monopoly.','打破垄断。','mono(单一)+poly(卖)'),
('dividend','/ˈdɪvɪdend/','n. 股息','profit share','Annual dividend payment.','年度股息支付。','divid(分)+end'),
('mortgage','/ˈmɔːɡɪdʒ/','n. 抵押贷款','home loan','Take out a mortgage.','办理抵押贷款。','mort(死)+gage(抵押)'),
('portfolio','/pɔːtˈfəʊliəʊ/','n. 投资组合','investment collection','Diversified portfolio.','多元化投资组合。','port+folio'),
('audit','/ˈɔːdɪt/','n. 审计','financial review','Annual audit required.','需要年度审计。','audit(听)'),
('invoice','/ˈɪnvɔɪs/','n. 发票','payment request','Send the invoice.','发送发票。'),
('procurement','/prəˈkjʊəmənt/','n. 采购','purchasing process','Government procurement is transparent.','政府采购是透明的。','pro+cure(关心)+ment'),
('leverage','/ˈlevərɪdʒ/','n. 杠杆;影响力','power to influence','Use market leverage.','利用市场杠杆。'),
('acquisition','/ˌækwɪˈzɪʃn/','n. 收购','buying a company','The acquisition was approved.','收购被批准了。','ac+quisit(寻求)+ion'),
('merger','/ˈmɜːdʒə/','n. 合并','combining companies','The merger created a giant.','合并创造了一个巨头。'),
('stakeholder','/ˈsteɪkhəʊldə/','n. 利益相关者','person with interest','Stakeholders were consulted.','咨询了利益相关者。'),
('revenue','/ˈrevənjuː/','n. 收入','income','Annual revenue increased.','年收入增加了。','re+venue(来)'),
('expenditure','/ɪkˈspendɪtʃə/','n. 支出','spending','Government expenditure rises.','政府支出增加。','ex+pend(花费)+iture'),
('budget','/ˈbʌdʒɪt/','n. 预算','financial plan','Annual budget approved.','年度预算被批准了。'),
('asset','/ˈæset/','n. 资产','valuable resource','Total assets exceed liabilities.','总资产超过负债。'),
('liability','/ˌlaɪəˈbɪləti/','n. 负债;责任','financial obligation','Limited liability company.','有限责任公司。'),
('equity','/ˈekwəti/','n. 股权;公平','ownership or fairness','Private equity investment.','私募股权投资。','equi(相等)+ty'),
('collateral','/kəˈlætərəl/','n. 抵押品','security for loan','Property as collateral.','房产作为抵押品。'),
('depreciation','/dɪˌpriːʃiˈeɪʃn/','n. 贬值','loss of value','Currency depreciation hurts imports.','货币贬值伤害进口。','de+preci(价值)+ation'),
('speculation','/ˌspekjuˈleɪʃn/','n. 投机','risky investment','Speculation drives volatility.','投机驱动波动性。','specul(看)+ation'),
('conglomerate','/kənˈɡlɒmərət/','n. 企业集团','large corporation','Media conglomerate dominates.','媒体集团占主导。','con+glomer(聚集)+ate'),
('franchise','/ˈfræntʃaɪz/','n. 特许经营权','business license','Fast food franchise.','快餐特许经营权。'),
('logistics','/ləˈdʒɪstɪks/','n. 物流','supply chain management','Logistics optimization saves money.','物流优化省钱。'),
('inventory','/ˈɪnvəntri/','n. 库存','stock of goods','Manage inventory levels.','管理库存水平。'),
('compliance','/kəmˈplaɪəns/','n. 合规','following rules','Regulatory compliance is mandatory.','监管合规是强制的。'),
('benchmark','/ˈbentʃmɑːk/','n. 基准','standard of comparison','Industry benchmark for quality.','行业质量基准。'),
('scalability','/ˌskeɪləˈbɪləti/','n. 可扩展性','ability to grow','Scalability is key for startups.','可扩展性对初创公司很关键。'),
('downturn','/ˈdaʊntɜːn/','n. 下滑','economic decline','Economic downturn affects jobs.','经济下滑影响就业。'),
('upturn','/ˈʌptɜːn/','n. 好转','improvement','An upturn in the economy.','经济好转。'),
('volatility','/ˌvɒləˈtɪləti/','n. 波动性','unpredictability','Market volatility increases.','市场波动性增加。'),
('aggregate','/ˈæɡrɪɡət/','v./adj. 总计','total amount','Aggregate demand rises.','总需求上升。','ag+greg(群)+ate'),
('disparity','/dɪˈspærəti/','n. 差距','great difference','Wealth disparity grows.','财富差距扩大。'),
('fiscal','/ˈfɪskl/','adj. 财政的','relating to government finance','Fiscal policy shapes economy.','财政政策塑造经济。'),
('monetary','/ˈmʌnɪtəri/','adj. 货币的','relating to money','Monetary policy controls inflation.','货币政策控制通胀。','monet(钱)+ary'),
('bilateral','/ˌbaɪˈlætərəl/','adj. 双边的','between two parties','Bilateral trade agreement.','双边贸易协定。','bi+lateral(侧)'),
('multilateral','/ˌmʌltɪˈlætərəl/','adj. 多边的','involving many parties','Multilateral negotiations.','多边谈判。','multi+lateral'),
('protocol','/ˈprəʊtəkɒl/','n. 协议;规程','formal rules','Follow the safety protocol.','遵循安全规程。','proto(第一)+col(胶)'),
('autonomous','/ɔːˈtɒnəməs/','adj. 自主的','self-governing','Autonomous region.','自治区。','auto(自己)+nom(法则)+ous'),
('ideology','/ˌaɪdiˈɒlədʒi/','n. 意识形态','system of ideas','Political ideology shapes views.','政治意识形态塑造观点。','ideo(思想)+logy'),
('paradigm','/ˈpærədaɪm/','n. 范式','model or framework','A paradigm shift occurred.','发生了范式转变。','para(旁边)+digm(显示)'),
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