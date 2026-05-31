import csv, re, sys, os

VOCAB = r'D:\Claude cli\MyApp\yingo\src\data\vocab-sample.ts'

with open(VOCAB,'r',encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'];\s*$', '', c)
ids = re.findall(r'id:\s*"w(\d+)"', c)
cid = max(int(x) for x in ids) if ids else 0

for csv_file in sys.argv[1:]:
    added = 0
    with open(csv_file,'r',encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 6: continue
            cid += 1
            word,ph,m,me,ex,et = row[0],row[1],row[2],row[3],row[4],row[5]
            roots = row[6] if len(row) > 6 else ''
            rs = f', roots: "{roots}"' if roots else ''
            c += f'  {{ id: "w{cid:03d}", word: "{word}", phonetic: "{ph}", meaning: "{m}", meaningEn: "{me}", example: "{ex}", exampleTranslation: "{et}"{rs}, level: "core" as const, tags: ["高频"] }},\n'
            added += 1
    print(f'Added {added} from {os.path.basename(csv_file)}, total: w{cid}')

c += '];\n'
with open(VOCAB,'w',encoding='utf-8') as f:
    f.write(c)
print(f'Final total: {cid} words')