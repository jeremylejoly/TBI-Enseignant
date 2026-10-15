#!/usr/bin/env python3
"""Parse CECP P5/P6 text extractions into an index of séquences didactiques with the codes they cite."""
import re, json, sys, unicodedata

def norm(s):
    s = unicodedata.normalize('NFKC', s)
    s = s.replace('\t', ' ')
    s = re.sub(r'[  ]+', ' ', s)
    return s.strip()

CODE_RE = re.compile(r'^([A-Z]{1,5}\d{1,4})\s*(.*)$')
DISC_RE = re.compile(r'^(?:P[456]\s+)?([A-ZÉÈÀÇ ,\'’]+?)\s+I\s+SÉQUENCES DIDACTIQUES')

def parse(path, year):
    text = open(path, encoding='utf-8', errors='replace').read()
    pages = re.split(r'\n===== PAGE (\d+) =====\n', text)
    # pages: [pre, num1, txt1, num2, txt2...]
    seqs = []
    cur = None
    collecting = False
    i = 1
    while i < len(pages):
        pno = int(pages[i]); body = pages[i+1]; i += 2
        lines = [norm(l) for l in body.split('\n')]
        disc = None; champ = None; disc_idx = None
        for k, l in enumerate(lines):
            if 'LE DISPOSITIF AMÈNE LES ÉLÈVES À' in l:
                for j in range(k-1, -1, -1):
                    m = DISC_RE.match(lines[j])
                    if m:
                        disc = m.group(1).strip(); disc_idx = j; break
                if disc_idx is not None and disc_idx < k:
                    hdr = [x for x in lines[disc_idx+1:k] if x]
                else:
                    hdr = [x for x in lines[:k] if x][-3:]
                champ = hdr[0].rstrip(' I').strip() if hdr else None
                title = ' '.join(hdr[1:]).strip() if len(hdr) > 1 else (hdr[0] if hdr else None)
                title = title.replace('  ', ' ')
                cur = {'year': year, 'disc': disc, 'champ': champ, 'title': title, 'page': pno, 'codes': []}
                seqs.append(cur)
                collecting = True
                lines = lines[k+1:]
                break
        if cur is None or not collecting:
            continue
        # collect codes on this page (after title if same page)
        buf_code = None; buf_txt = []
        def flush():
            if buf_code:
                cur['codes'].append({'code': buf_code, 'text': norm(' '.join(buf_txt))})
        for l in lines:
            if 'LECTURES ASSOCIÉES' in l:
                flush(); buf_code=None; buf_txt=[]; collecting = False
                break
            m = CODE_RE.match(l)
            if m and len(m.group(1)) >= 3:
                flush(); buf_code = m.group(1); buf_txt = [m.group(2)]
            elif buf_code is not None:
                if re.match(r'^(Contenus?|Savoirs?|Savoir-faire|Compétences?|AU NIVEAU|PROGRAMME DE|VERSION PROVISOIRE|SOMMAIRE|P[456]$|\d+$)', l) or 'SÉQUENCES DIDACTIQUES' in l or l.endswith(' I'):
                    continue
                buf_txt.append(l)
        if collecting:
            flush()
    # dedupe: same disc+title may appear on a 2-page spread (consecutive pages) and once more in the
    # "clé de lecture" sample at the start of the discipline. Keep the LAST cluster of consecutive pages,
    # its first page, and merge all codes.
    groups = {}
    for s in seqs:
        groups.setdefault((s['disc'], s['title']), []).append(s)
    out = {}
    for key, occ in groups.items():
        occ.sort(key=lambda s: s['page'])
        clusters = [[occ[0]]]
        for s in occ[1:]:
            if s['page'] - clusters[-1][-1]['page'] <= 2: clusters[-1].append(s)
            else: clusters.append([s])
        last = clusters[-1]
        base = dict(last[0]); base['codes'] = []; base['page_end'] = last[-1]['page']
        seen = set()
        for s in last + [x for c in clusters[:-1] for x in c]:
            for c in s['codes']:
                if c['code'] not in seen:
                    base['codes'].append(c); seen.add(c['code'])
        out[key] = base
    return list(out.values())

if __name__ == '__main__':
    res = parse('/home/claude/audit/sources/CECP_P5.txt', 'P5') + parse('/home/claude/audit/sources/CECP_P6.txt', 'P6')
    json.dump(res, open('/home/claude/audit/build/cecp_index.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    from collections import Counter
    print(len(res), 'séquences')
    print(Counter((s['year'], s['disc']) for s in res))
    print('codes total', sum(len(s['codes']) for s in res))
    for s in res[:3]: print(s['year'], s['disc'], '|', s['champ'], '|', s['title'], s['page'], len(s['codes']))
