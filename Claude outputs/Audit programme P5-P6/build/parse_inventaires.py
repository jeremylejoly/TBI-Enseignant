#!/usr/bin/env python3
"""Parse the markdown inventories into one JSON list of official attendus."""
import re, json, glob, os

FILES = ['MATH_inventaire.md', 'FR_inventaire_P5.md', 'FR_inventaire_P6.md', 'SC_inventaire.md',
         'HISTGEO_inventaire.md', 'ECO_inventaire.md', 'FMTTN_inventaire.md', 'ECA_inventaire.md']
ROW_RE = re.compile(r'^\|\s*([A-Z]+-P[56]-\d{3})\s*\|')

def split_row(line):
    # split on | not escaped; strip
    cells = [c.strip() for c in re.split(r'(?<!\\)\|', line.strip())]
    return cells[1:-1]

def canon(h):
    h = h.lower()
    if h.startswith('id'): return 'id'
    if h.startswith('année'): return 'year'
    if 'champ' in h or 'rubrique' in h: return 'champ'
    if h.startswith('type'): return 'type'
    if h.startswith('mode'): return 'mode'
    if h.startswith('contenu'): return 'contenu'
    if h.startswith('attendu') or h.startswith('libellé'): return 'attendu'
    if h.startswith('page'): return 'page'
    if 'δ' in h or 'delta' in h: return 'delta'
    if 'code' in h: return 'code'
    return h

items = {}
for f in FILES:
    header = None
    for line in open(os.path.join('/home/claude/audit/rapports', f), encoding='utf-8'):
        if line.startswith('|') and not ROW_RE.match(line):
            cells = split_row(line)
            if cells and cells[0].lower().startswith('id'):
                header = [canon(c) for c in cells]
            continue
        m = ROW_RE.match(line)
        if m and header:
            cells = split_row(line)
            rec = {}
            for k, v in zip(header, cells):
                rec[k] = v
            rid = rec['id']
            disc = rid.split('-')[0]
            rec['disc'] = disc
            rec['year'] = rid.split('-')[1]
            rec['src'] = f
            # clean markdown bold / escaped pipes
            for k in ('attendu', 'contenu', 'champ', 'delta'):
                if k in rec:
                    rec[k] = rec[k].replace('\\|', '|').replace('**', '').strip()
            if rid in items:
                # keep the richer record (more columns)
                if len(rec) <= len(items[rid]): continue
            items[rid] = rec

out = sorted(items.values(), key=lambda r: r['id'])
json.dump(out, open('/home/claude/audit/build/inventaire.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
from collections import Counter
print(len(out), Counter((r['disc'], r['year']) for r in out))
missing = [r['id'] for r in out if not r.get('attendu') or not r.get('page')]
print('rows without attendu/page:', missing[:10], len(missing))
