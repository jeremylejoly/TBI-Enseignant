#!/usr/bin/env python3
"""Match CECP sequence codes to official attendus, and detect P5/P6 identical attendus."""
import json, re, unicodedata
from collections import defaultdict

inv = json.load(open('/home/claude/audit/build/inventaire.json', encoding='utf-8'))
cecp = json.load(open('/home/claude/audit/build/cecp_index.json', encoding='utf-8'))

def normtxt(s):
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c))
    s = s.lower().replace('’', "'").replace('œ', 'oe')
    s = re.sub(r"[^a-z0-9' ]+", ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

STOP = set('de des du la le les l un une et ou a au aux en dans sur par pour avec sans d son sa ses leur leurs ce cet cette ces que qui ne pas plus tout tous toute toutes se s est sont etre ex entre selon lors'.split())
def words(s):
    return [w for w in normtxt(s).split() if w not in STOP and len(w) >= 3]

DISCMAP = {'MATHÉMATIQUES': ['MATH'], 'FRANÇAIS': ['FR'], 'SCIENCES': ['SC'],
           'FORMATION HISTORIQUE, GÉOGRAPHIQUE, ÉCONOMIQUE ET SOCIALE': ['HIST', 'GEO', 'ECO'],
           'FORMATION MANUELLE, TECHNIQUE, TECHNOLOGIQUE ET NUMÉRIQUE': ['FMTTN'],
           'ÉDUCATION CULTURELLE ET ARTISTIQUE': ['ECA']}

by_key = defaultdict(list)
for it in inv:
    it['_w'] = set(words(it['attendu']))
    it['_n'] = normtxt(it['attendu'])
    by_key[(it['disc'], it['year'])].append(it)

# --- P5/P6 identical detection
same = {}
for it in inv:
    if it['year'] != 'P5': continue
    cands = [x for x in by_key[(it['disc'], 'P6')] if x['_n'] == it['_n']]
    if cands:
        # prefer same champ
        c = sorted(cands, key=lambda x: (x.get('champ') != it.get('champ'), x['id']))[0]
        if c['id'] not in same.values():
            same[it['id']] = c['id']
print('P5 attendus with identical P6 twin:', len(same))

# --- code matching
codes = {}
for s in cecp:
    for c in s['codes']:
        key = (s['year'], c['code'])
        codes.setdefault(key, {'year': s['year'], 'code': c['code'], 'disc': s['disc'], 'text': c['text'], 'seqs': []})
        codes[key]['seqs'].append({'title': s['title'], 'page': s['page'], 'champ': s['champ']})
        if len(c['text']) > len(codes[key]['text']): codes[key]['text'] = c['text']
print('distinct (year,code):', len(codes))

matches = []  # (code, item id, score)
unmatched = []
for key, c in codes.items():
    cw = set(words(c['text'])); cn = normtxt(c['text'])
    best = []
    for d in DISCMAP.get(c['disc'], []):
        for it in by_key[(d, c['year'])]:
            if not it['_w']: continue
            # containment of attendu words in code text
            score = len(it['_w'] & cw) / len(it['_w'])
            # bonus if normalized attendu is substring
            if it['_n'][:60] in cn: score = max(score, 0.95)
            if score >= 0.6:
                best.append((score, it['id']))
    best.sort(reverse=True)
    c['matches'] = best[:5]
    if best and best[0][0] >= 0.8:
        top = best[0][0]
        for sc, iid in best:
            if sc >= 0.8 and sc >= top - 1e-9:
                matches.append((key, iid, sc))
    else:
        unmatched.append((key, best[:2]))

print('codes matched:', len({m[0] for m in matches}), 'unmatched:', len(unmatched))
# items with pistes
pistes = defaultdict(list)
for (y, code), iid, sc in matches:
    for s in codes[(y, code)]['seqs']:
        pistes[iid].append({'year': y, 'code': code, 'title': s['title'], 'page': s['page'], 'score': round(sc, 2)})
json.dump({'same': same, 'codes': {f'{k[0]}:{k[1]}': v for k, v in codes.items()}, 'pistes': pistes,
           'unmatched': [[f'{k[0]}:{k[1]}', b] for k, b in unmatched]},
          open('/home/claude/audit/build/cecp_match.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from collections import Counter
print('items with pistes:', len(pistes), Counter(i.split('-')[0] for i in pistes))
print('unmatched sample:')
for k, b in unmatched[:15]:
    print(' ', k, codes[k]['text'][:90], '->', b)
