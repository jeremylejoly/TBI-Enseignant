#!/usr/bin/env python3
"""Génère semainier_data.json (données du sélecteur du semainier) à partir des mêmes
sources que programme_P5_P6.html : inventaire.json + <DISC>_items.json.
Usage : python3 gen_semainier_data.py  (dans ce dossier build/)"""
import json, os
B = os.path.dirname(os.path.abspath(__file__))
inv = {r['id']: r for r in json.load(open(f'{B}/inventaire.json', encoding='utf-8'))}
SUBJECTS = [  # key, file, name, icon, color, bg, text
    ('math', 'MATH', 'Mathématiques', '🔢', '#2563eb', '#eff6ff', '#1d4ed8'),
    ('fr', 'FR', 'Français', '📖', '#16a34a', '#f0fdf4', '#15803d'),
    ('sci', 'SC', 'Sciences', '🔬', '#0891b2', '#ecfeff', '#0e7490'),
    ('hist', 'HISTGEO', 'Histoire & Géo', '🌍', '#d97706', '#fffbeb', '#b45309'),
    ('eco', 'ECO', 'Éco & Social', '💰', '#7c3aed', '#f5f3ff', '#6d28d9'),
    ('fmttn', 'FMTTN', 'FMTTN', '💻', '#db2777', '#fdf2f8', '#be185d'),
    ('eca', 'ECA', 'ECA', '🎨', '#9333ea', '#faf5ff', '#7e22ce'),
]
def norm_type(t):
    t = (t or '').upper()
    if t.startswith('SF') or 'SAVOIR-FAIRE' in t: return 'SF'
    if t.startswith('C') or 'COMP' in t: return 'C'
    return 'S'
out = {}; n = 0
for key, disc, name, icon, color, bg, text in SUBJECTS:
    data = json.load(open(f'{B}/{disc}_items.json', encoding='utf-8'))
    items = data['items']; doms = []
    for dom in data['domains']:
        subs = []
        for sub in dom['subsections']:
            its = []
            for iid in sub['items']:
                it = items[iid]; r = inv[iid]; twin = it.get('twin')
                y = 'P5·P6' if twin else iid.split('-')[1]
                pages = (f"P5 p. {r['page']} · P6 p. {inv[twin]['page']}" if twin
                         else f"{y} p. {r['page']}")
                its.append({'id': iid, 'twin': twin or '', 'y': y, 't': norm_type(r.get('type') or it.get('type')),
                            's': it['short'], 'o': r['attendu'], 'p': pages}); n += 1
            subs.append({'title': sub['title'], 'items': its})
        doms.append({'title': dom['title'], 'icon': dom.get('icon', '📁'), 'subsections': subs})
    out[key] = {'id': key, 'name': name, 'icon': icon, 'color': color, 'bg': bg, 'text': text, 'domains': doms}
json.dump(out, open(f'{B}/semainier_data.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('semainier_data.json :', n, 'items')

# Injection dans le semainier (remplace la ligne « const FWB_DATABASE = … »)
SEM = os.path.normpath(os.path.join(B, '..', '..', '..', 'semainier_fwb_prototype.html'))
lines = open(SEM, encoding='utf-8').read().split('\n')
idx = [i for i, l in enumerate(lines) if l.startswith('const FWB_DATABASE = ')]
assert len(idx) == 1, 'ligne FWB_DATABASE introuvable dans le semainier'
lines[idx[0]] = 'const FWB_DATABASE = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';'
open(SEM, 'w', encoding='utf-8').write('\n'.join(lines))
print('semainier mis à jour :', SEM)
