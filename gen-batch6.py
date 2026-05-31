import re, sys
VOCAB = r"D:\Claude cli\MyApp\yingo\src\data\vocab-sample.ts"
with open(VOCAB,"r",encoding="utf-8") as f:
    c = f.read()
c = re.sub(r"\];\s*$","",c)
ids = re.findall(r"id:\s*\"w(\d+)\"",c)
cid = max(int(x) for x in ids) if ids else 0
print(f"Current max: w{cid}")
words = [
["curriculum","/kəˈrɪkjələm/","n. 课程","set of courses offered","The university revised its curriculum.","大学修订了课程体系。","curr(跑)+icul+um"],
["pedagogy","/ˈpedəɡɒdʒi/","n. 教育学","method of teaching","Modern pedagogy encourages critical thinking.","现代教育学鼓励批判性思维。","ped(儿童)+agog(引导)"],
["syllabus","/ˈsɪləbəs/","n. 教学大纲","outline of subjects","The syllabus covers ten chapters.","大纲涵盖十个章节。","syl(共同)+labus"],
["diploma","/dɪˈpləʊmə/","n. 文凭","certificate of completion","She earned her diploma.","她拿到了文凭。","dipl(双折)+oma"],
["tuition","/tjuːˈɪʃn/","n. 学费","fees for instruction","Tuition fees have risen.","学费上涨了。","tuit(教导)+ion"]
]
for w in words:
    cid += 1
    nid = f"w{cid:03d}"
    wr,ph,m,me,ex,et,r = w
    rs = f", roots: \"{r}\"" if r else ""
    c += f"  {{ id: \"{nid}\", word: \"{wr}\", phonetic: \"{ph}\", meaning: \"{m}\", meaningEn: \"{me}\", example: \"{ex}\", exampleTranslation: \"{et}\"{rs}, level: \"core\" as const, tags: [\"高频\"] }},\n"
c += "];\n"
with open(VOCAB,"w",encoding="utf-8") as f:
    f.write(c)
print(f"Added {len(words)} words, total: {cid}")
