#!/usr/bin/env python3
"""Generate programme_P5_P6.html from the inventory + per-discipline item files."""
import json, html, re, os
from collections import OrderedDict, defaultdict

B = '/home/claude/audit/build'
inv = {r['id']: r for r in json.load(open(f'{B}/inventaire.json', encoding='utf-8'))}
match = json.load(open(f'{B}/cecp_match.json', encoding='utf-8'))
PISTES = match['pistes']; CODES = match['codes']

SUBJECTS = [  # key, file, tab label, icon, h2, subtitle
    ('math', 'MATH', 'Mathématiques', '🔢', 'Mathématiques', 'Référentiel de mathématiques — P5 pp. 78-92 · P6 pp. 93-107'),
    ('fr', 'FR', 'Français', '📖', 'Français', 'Référentiel de français et langues anciennes — P5 pp. 113-131 · P6 pp. 136-153'),
    ('sci', 'SC', 'Sciences', '🔬', 'Sciences', 'Référentiel de sciences — P5 pp. 55-62 · P6 pp. 63-69'),
    ('hist', 'HISTGEO', 'Histoire & Géo', '🌍', 'Histoire & Géographie', 'Référentiel FHGES — Formation historique (P5 pp. 51-54, P6 pp. 55-58) · Formation géographique (P5 pp. 87-89, P6 pp. 90-92)'),
    ('eco', 'ECO', 'Éco & Social', '💰', 'Éco & Social', 'Référentiel FHGES — Formation économique et sociale (P5 pp. 125-126, P6 pp. 127-128)'),
    ('fmttn', 'FMTTN', 'FMTTN', '💻', 'FMTTN', 'Référentiel FMTTN — P5 pp. 45-50 · P6 pp. 51-57'),
    ('eca', 'ECA', 'ECA', '🎨', 'Éducation culturelle et artistique', 'Référentiel ECA — P5 pp. 46-51 · P6 pp. 52-57'),
]
TYPE_LABEL = {'S': 'Savoir', 'SF': 'Savoir-faire', 'C': 'Compétence'}

def esc(s): return html.escape(s or '', quote=True)

def norm_type(t):
    t = (t or '').upper()
    if t.startswith('SF') or 'SAVOIR-FAIRE' in t: return 'SF'
    if t.startswith('C') or 'COMP' in t: return 'C'
    return 'S'

def item_pistes(iid, it):
    twin = it.get('twin')
    raw = list(PISTES.get(iid, [])) + (list(PISTES.get(twin, [])) if twin else [])
    rm = set(it.get('pistes_remove') or [])
    raw = [p for p in raw if f"{p['year']}:{p['code']}" not in rm]
    for a in it.get('pistes_add') or []:
        if a.get('title'):
            raw.append({'year': a['year'], 'code': a['code'], 'title': a['title'], 'page': a.get('page')})
        else:
            c = CODES.get(f"{a['year']}:{a['code']}")
            if c:
                for s in c['seqs']:
                    raw.append({'year': a['year'], 'code': a['code'], 'title': s['title'], 'page': s['page']})
    # special case (coquille CECP P5 ECA216): ECA-P5-036 only "Revisiter un film"
    if iid == 'ECA-P5-036':
        raw = [p for p in raw if 'film' in p['title'].lower()]
    out = OrderedDict()
    for p in raw:
        key = (p['year'], p['title'])
        if key not in out: out[key] = p
    return sorted(out.values(), key=lambda p: (p['year'], p.get('page') or 0))

all_items = []  # in display order, for positional hash
subject_html = []
stats = {}
for key, disc, tab, icon, h2, subtitle in SUBJECTS:
    data = json.load(open(f'{B}/{disc}_items.json', encoding='utf-8'))
    items = data['items']
    n5 = n6 = nboth = 0
    parts = []
    # repères
    rep = data.get('reperes') or []
    if rep:
        parts.append(f'<div class="reperes"><div class="reperes-header" onclick="toggleDomain(this)"><span class="domain-icon">📌</span><span class="domain-title">Repères pour l\'enseignant <span class="rep-count">({len(rep)})</span></span><span class="domain-toggle">▼</span></div><div class="domain-body" style="display:none"><div class="reperes-body">')
        parts.append('<p class="rep-intro">Cadrages, balises et recommandations du référentiel (et quelques points d\'attention du CECP) qui ne sont pas des attendus à évaluer.</p>')
        for r in rep:
            pg = f' <span class="rep-page">p. {esc(str(r["page"]))}</span>' if r.get('page') else ''
            parts.append(f'<div class="rep"><div class="rep-title">{esc(r.get("title"))}{pg}</div><div class="rep-text">{esc(r.get("text"))}</div></div>')
        parts.append('</div></div></div>')
    for dom in data['domains']:
        dkey = f'{key}-{dom["key"]}'
        parts.append(f'<div class="domain {key}" id="domain-{dkey}">')
        parts.append(f'<div class="domain-header" onclick="toggleDomain(this)"><span class="domain-icon">{dom.get("icon","📁")}</span><span class="domain-title">{esc(dom["title"])}</span><span class="domain-progress" id="prog-{dkey}">0/0</span><span class="domain-toggle">▼</span></div>')
        parts.append(f'<div class="mini-prog"><div class="mini-prog-bar" id="bar-{dkey}" style="width:0%"></div></div>')
        parts.append('<div class="domain-body" style="display:none">')
        for sub in dom['subsections']:
            parts.append(f'<div class="subsection"><div class="subsection-title">{esc(sub["title"])}</div>')
            for iid in sub['items']:
                it = items[iid]; r = inv[iid]
                twin = it.get('twin')
                years = ['p5', 'p6'] if twin else [iid.split('-')[1].lower()]
                if twin: nboth += 1
                elif years == ['p5']: n5 += 1
                else: n6 += 1
                typ = norm_type(r.get('type') or it.get('type'))
                pages = []
                if 'p5' in years: pages.append(f"P5 p. {r['page']}" if not twin else f"P5 p. {r['page']}")
                if twin: pages.append(f"P6 p. {inv[twin]['page']}")
                elif years == ['p6']: pages.append(f"P6 p. {r['page']}")
                badges = ''.join(f'<span class="badge {y}">{y.upper()}</span>' for y in years)
                full = r['attendu']
                delta = r.get('delta') if years == ['p6'] else ''
                if delta and delta.strip() in ('—', '-', ''): delta = ''
                pistes = item_pistes(iid, it)
                det = [f'<div class="d-row"><span class="d-k">Attendu officiel</span><span class="d-v">{esc(full)}</span></div>']
                if r.get('contenu'): det.append(f'<div class="d-row"><span class="d-k">Contenu</span><span class="d-v">{esc(r["contenu"])}</span></div>')
                det.append(f'<div class="d-row"><span class="d-k">Type</span><span class="d-v">{TYPE_LABEL[typ]} · {esc(r.get("champ",""))}</span></div>')
                det.append(f'<div class="d-row"><span class="d-k">Référentiel</span><span class="d-v">{esc(" · ".join(pages))}{" · " + esc(iid) if True else ""}</span></div>')
                if delta: det.append(f'<div class="d-row"><span class="d-k">Nouveau en P6</span><span class="d-v">{esc(delta)}</span></div>')
                if pistes:
                    li = ''.join(f'<li><span class="pl-year">CECP {p["year"]}</span> {esc(p["title"])}{(" <span class=pl-page>p. " + str(p["page"]) + "</span>") if p.get("page") else ""}</li>' for p in pistes)
                    det.append(f'<div class="d-row"><span class="d-k">Pistes CECP</span><span class="d-v"><ul class="pistes">{li}</ul></span></div>')
                else:
                    det.append('<div class="d-row"><span class="d-k">Pistes CECP</span><span class="d-v muted">aucune séquence CECP P5/P6 ne vise cet attendu</span></div>')
                search = (it['short'] + ' ' + full).replace('"', '&quot;')
                all_items.append(iid)
                parts.append(
                    f'<div class="item" data-id="{iid}" data-years="{" ".join(years)}" data-type="{typ}">'
                    f'<input type="checkbox"><label>{esc(it["short"])}</label>'
                    f'<span class="tchip t-{typ.lower()}" title="{TYPE_LABEL[typ]}">{typ}</span>{badges}'
                    f'<button class="det-btn" title="Texte officiel et pistes" onclick="event.stopPropagation();toggleDetail(this)">ⓘ</button>'
                    f'<div class="detail" style="display:none">{"".join(det)}</div></div>')
            parts.append('</div>')
        parts.append('</div></div>')
    stats[key] = (n5, n6, nboth)
    subject_html.append((key, tab, icon, h2, subtitle, '\n'.join(parts), [f'{key}-{d["key"]}' for d in data['domains']]))

total = len(all_items)
DOMAINS = [d for s in subject_html for d in s[6]]

# ---------- TIPS (pistes d'activité maths héritées de l'ancienne version) ----------
old = open('/home/claude/audit/build/old_programme.html', encoding='utf-8').read()
tips_src = re.search(r'const TIPS=\{.*?\n\};', old, re.S).group(0)

css = open(f'{B}/style_extra.css', encoding='utf-8').read()
old_css = re.search(r'<style>(.*?)</style>', old, re.S).group(1)

tabs_html = '\n'.join(f'  <div class="tab {k}{" active" if i == 0 else ""}" onclick="showTab(\'{k}\')">{ic} {esc(t)}</div>' for i, (k, t, ic, *_rest) in enumerate(subject_html))

sections = []
for i, (k, tab, ic, h2, subtitle, body, doms) in enumerate(subject_html):
    n5, n6, nboth = stats[k]
    sections.append(f'''<div class="section{" active" if i == 0 else ""}" id="tab-{k}">
<div class="subject-header {k}">
<span style="font-size:26px">{ic}</span>
<div><h2>{esc(h2)}</h2><div class="sub-src">{esc(subtitle)}</div><div class="sub-counts">{n5 + nboth + n6} attendus · {n5} P5 · {n6} P6 · {nboth} communs P5·P6</div></div>
<div class="desc" id="{k}-desc">—</div>
<button class="uncheck-btn subject-uncheck" onclick="uncheckSubject('{k}')">↺ Tout décocher</button>
</div>
<div class="year-filter"><span>Afficher :</span>
<button class="filter-btn all active" onclick="filterYear('{k}','all',this)">Tout</button>
<button class="filter-btn p5f" onclick="filterYear('{k}','p5',this)">5e</button>
<button class="filter-btn p6f" onclick="filterYear('{k}','p6',this)">6e</button>
<span class="sep"></span><span>Type :</span>
<button class="filter-btn tall active" onclick="filterType('{k}','all',this)">Tous</button>
<button class="filter-btn ts" onclick="filterType('{k}','S',this)">Savoirs</button>
<button class="filter-btn tsf" onclick="filterType('{k}','SF',this)">Savoir-faire</button>
<button class="filter-btn tc" onclick="filterType('{k}','C',this)">Compétences</button>
<button class="filter-btn open-all" onclick="openAll('{k}',this)">⊞ Tout déplier</button>
</div>
{body}
</div>''')

page = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Programme 5e & 6e Primaire — Checklist</title>
<style>{old_css}
{css}</style>
</head>
<body>
<div id="tip-panel"><button class="tip-close" onclick="closeTip()">✕</button><div class="tip-header">💡 Piste d'activité</div><div class="tip-body" id="tip-body"></div></div>
<div id="search-panel" onclick="if(event.target===this)clearSearch()"><div id="search-results"><div id="search-results-header">0 résultat</div><div id="search-results-body"></div></div></div>
<header>
  <div><h1>📚 Programme 5e &amp; 6e Primaire</h1><div style="font-size:11px;color:var(--muted)">Référentiels FWB du tronc commun ({total} attendus) · pistes CECP P5 &amp; P6 · version du 15/10/2026</div></div>
  <div class="search-wrap"><span class="si">🔍</span><input type="text" id="search-input" placeholder="Rechercher…" oninput="onSearch(this.value)" autocomplete="off"><button class="clr" id="clear-search" onclick="clearSearch()">✕</button></div>
  <div class="global-progress"><span id="save-indicator">✓ Sauvegardé</span><span id="global-count">0/0</span><div class="prog-bar-wrap"><div class="prog-bar" id="global-bar" style="width:0%"></div></div><button class="reset-btn" onclick="resetAll()">🔄 Tout réinitialiser</button></div>
</header>
<div class="tabs">
{tabs_html}
</div>
<div class="legend"><span class="badge p5">P5</span> attendu de 5e · <span class="badge p6">P6</span> attendu de 6e · <span class="badge p5">P5</span><span class="badge p6">P6</span> attendu identique les deux années · <span class="tchip t-s">S</span> savoir · <span class="tchip t-sf">SF</span> savoir-faire · <span class="tchip t-c">C</span> compétence · <span class="det-btn" style="position:static">ⓘ</span> texte officiel, page du référentiel et pistes CECP</div>
<div class="content">
{chr(10).join(sections)}
</div>
<script>
const VERSION='v5';
const DOMAINS={json.dumps(DOMAINS)};
const SUBJECTS={json.dumps([s[0] for s in subject_html])};
{open(f'{B}/app_extra.js', encoding='utf-8').read()}
{tips_src}
{open(f'{B}/app_tail.js', encoding='utf-8').read()}
</script>
</body>
</html>'''
out = f'{B}/programme_P5_P6.html'
open(out, 'w', encoding='utf-8').write(page)
print('written', out, len(page), 'bytes;', total, 'items;', stats)
