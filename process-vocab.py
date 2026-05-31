import csv, re, sys
VOCAB = r'D:\Claude cli\MyApp\yingo\src\data\vocab-sample.ts'
CSV = sys.argv[1] if len(sys.argv) > 1 else r'D:\Claude cli\MyApp\yingo\words-batch1.csv'
with open(VOCAB,'r',encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'\];\s*$', '', c)
ids = re.findall(r'id:\s*"w(\d+)"', c)
cid = max(int(x) for x in ids) if ids else 0
print(f'Current max: w{cid}')
added = 0
with open(CSV,'r',encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        if len(row) < 6: continue
        cid += 1
        word,ph,m,me,ex,et = row[0],row[1],row[2],row[3],row[4],row[5]
        roots = row[6] if len(row) > 6 else ''
        rs = f', roots: "{roots}"' if roots else ''
        c += f'  {{ id: "w{cid:03d}", word: "{word}", phonetic: "{ph}", meaning: "{m}", meaningEn: "{me}", example: "{ex}", exampleTranslation: "{et}"{rs}, level: "core" as const, tags: ["高频"] }},\n'
        added += 1
c += '];\n'
with open(VOCAB,'w',encoding='utf-8') as f:
    f.write(c)
print(f'Added {added} words from {CSV}, total: {cid}')