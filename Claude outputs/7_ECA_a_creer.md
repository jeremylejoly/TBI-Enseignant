# Programme P5-P6 — Éducation culturelle et artistique (ECA) — Création complète du domaine

**Fichier à modifier :** `programme_P5_P6.html`
**Source officielle :** Référentiel d'Éducation culturelle et artistique — Tronc commun FWB, sections « 5e primaire » et « 6e primaire »

Ce domaine n'existe pas du tout actuellement dans l'app — c'est une création complète, pas une simple mise à jour. Ce document donne tout le nécessaire : nouveau bouton d'onglet, nouvelle section HTML, nouvelles variables JS, nouveau CSS.

---

## 1. Structure proposée

Le référentiel ECA organise ses attendus par 3 « modes d'expression » (française et corporelle, musicale, plastique) plus une catégorie « repères culturels et artistiques ». J'ai donc créé **4 domaines**, sur le même modèle que les autres matières :

| Domaine (id) | Titre affiché | Icône | Items P5 | Items P6 | Total |
|---|---|---|---|---|---|
| `eca-reperes` | Repères culturels et artistiques | 🗺️ | 12 | 11 | 23 |
| `eca-corporelle` | Expression française et corporelle | 🎭 | 15 | 11 | 26 |
| `eca-musicale` | Expression musicale | 🎵 | 11 | 14 | 25 |
| `eca-plastique` | Expression plastique | 🖌️ | 11 | 13 | 24 |
| **Total ECA** | | | **49** | **49** | **98** |

---

## 2. Nouveau bouton d'onglet

Ajouter après le bouton FMTTN, dans le bloc `<div class="tabs">` :

```html
<div class="tab eca" onclick="showTab('eca')">🎨 ECA</div>
```

## 3. Variables JavaScript à mettre à jour

**`const DOMAINS=[...]`** — ajouter les 4 nouveaux domaines à la fin du tableau :
```js
const DOMAINS=['math-geo','math-grand','math-nb','math-data','fr-conj','fr-gram','fr-ortho','fr-lect','fr-prod','sci-inv','sci-viv','sci-mat','sci-ene','hist-hist','hist-geo','eco-eco','eco-soc','fmttn-info','fmttn-num','fmttn-mtt','eca-reperes','eca-corporelle','eca-musicale','eca-plastique'];
```

**`const SUBJECTS=[...]`** — ajouter `'eca'` :
```js
const SUBJECTS=['math','fr','sci','hist','eco','fmttn','eca'];
```

**Dans `function uncheckSubject(subj){ const labels={...} }`** — ajouter `eca`:
```js
const labels={math:'Mathématiques',fr:'Français',sci:'Sciences',hist:'Histoire & Géo',eco:'Éco & Social',fmttn:'FMTTN',eca:'Éducation culturelle et artistique'};
```

**Dans `const SMETA={...}`** — ajouter une entrée pour le nouvel onglet (utilisée par le panneau de résultats de recherche) :
```js
'tab-eca':{label:'ECA',icon:'🎨'},
```

---

## 4. CSS à ajouter dans le `<style>` de `programme_P5_P6.html`

Le fichier utilise des variables CSS par matière (`--math`, `--fr`, etc.) déclinées en `-pale`/`-mid`/`-text`, plus des règles répétées pour chaque `.tab.X`, `.subject-header.X`, `#tab-X .domain-header`, etc. J'ai choisi une teinte orange (non utilisée ailleurs) pour ECA. Ajoute ces lignes à la suite des déclarations existantes équivalentes (ne remplace rien, ajoute) :

```css
/* Couleur ECA (à ajouter dans le bloc :root existant, à côté de --fmttn) */
:root{--eca:#ea580c;}

/* Palette pastel ECA (à ajouter dans le second bloc :root, à côté de --fmttn-pale/-mid/-text) */
:root{
  --eca-pale:#fff7ed; --eca-mid:#fed7aa; --eca-text:#c2410c;
}

/* Onglet actif */
.tab.eca.active{background:var(--eca-pale);border-color:var(--eca);color:var(--eca-text);}

/* En-tête de matière */
.subject-header.eca{background:var(--eca-pale);color:var(--eca-text);}

/* Barre de mini-progression des domaines */
.eca .mini-prog-bar{background:var(--eca);}

/* Fond et survol des en-têtes de domaine */
#tab-eca .domain-header{background:var(--eca-pale);}
#tab-eca .domain-header:hover{background:var(--eca-mid);}

/* Couleur du titre de domaine */
#tab-eca .domain-title{color:var(--eca-text);}

/* Pastille de sous-section (P5/P6) */
#tab-eca .subsection-title{background:var(--eca-pale); color:var(--eca-text); border-left:3px solid var(--eca);}
```

---

## 5. Nouvelle section HTML (contenu complet)

Insérer ce bloc entier juste avant la fermeture `</div>` qui suit la dernière section existante (`tab-fmttn`), c'est-à-dire juste avant `</div><!-- fin .content -->` (ou directement après le bloc `<div class="section" id="tab-fmttn">...</div>`). Respecter exactement la structure `section > subject-header + year-filter + domain (×4) > domain-header + domain-body > mini-prog + subsection (×2 : P5, P6) > item`, identique à celle des autres matières.

```html
<div class="section" id="tab-eca">
<div class="subject-header eca"><span style="font-size:24px">🎨</span><div><h2>Éducation culturelle et artistique</h2><div style="font-size:11px;color:#64748b;margin-top:2px">Référentiel FWB — Repères culturels · Expression corporelle · musicale · plastique</div></div><div class="desc" id="eca-desc">—</div><button class="uncheck-btn subject-uncheck" onclick="uncheckSubject('eca')">↺ Tout décocher</button></div>
<div class="year-filter"><span>Afficher :</span><button class="filter-btn all active" onclick="filterYear('eca','all',this)">Tout</button><button class="filter-btn p5f" onclick="filterYear('eca','p5',this)">5e seulement</button><button class="filter-btn p6f" onclick="filterYear('eca','p6',this)">6e seulement</button></div>

<div class="domain eca" id="domain-eca-reperes"><div class="domain-header" onclick="toggleDomain(this)"><span class="domain-icon">🗺️</span><span class="domain-title">Repères culturels et artistiques</span><span class="domain-progress" id="prog-eca-reperes">—</span><span class="domain-toggle">▼</span></div><div class="domain-body"><div class="mini-prog eca"><div class="mini-prog-bar" id="bar-eca-reperes" style="width:0%"></div></div>
<div class="subsection"><div class="subsection-title">Repères culturels — P5</div>
<div class="item" data-year="p5"><input type="checkbox"><label>Sélectionner au moins un exemple par mode d'expression (théâtre/danse, musique — écoute et expression, arts plastiques)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Découvrir une trace du passé (vestiges archéologiques, ruines, site de fouilles…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Découvrir un patrimoine immatériel d'ici ou d'ailleurs (fêtes, traditions, croyances, savoir-faire artisanal…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Découvrir un mythe ou une légende d'ici ou d'ailleurs</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Présenter, suite à des visites in situ, un site archéologique, un élément du patrimoine immatériel ou un mythe/une légende</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Exemplifier le contexte, identifier la signification et formuler son appréciation esthétique d'une œuvre, d'un lieu ou d'un objet culturel</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Observer de façon objective des éléments du patrimoine, un site archéologique</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Enrichir sa collection de traces</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Interroger le sens des recherches et de la conservation des traces du passé</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Établir des liens interdisciplinaires lors de la découverte d'éléments culturels</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Explorer un patrimoine matériel et immatériel d'ici ou d'ailleurs</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Interroger collectivement le sens et l'origine d'une œuvre, d'un lieu, d'un objet culturel</label><span class="badge p5">P5</span></div>
</div>
<div class="subsection"><div class="subsection-title">Repères culturels — P6 (nouvelles)</div>
<div class="item" data-year="p6"><input type="checkbox"><label>Sélectionner au moins un exemple par mode d'expression</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Découvrir un lieu de culture complétant le panel déjà observé</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Découvrir un patrimoine matériel d'ici et d'ailleurs (ex : pyramides, Taj Mahal, Muraille de Chine…)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Compléter son répertoire de lieux culturels et d'objets de cultures, d'époques et de pays différents</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer l'origine d'une œuvre, d'un lieu, d'un objet culturel et confronter sa propre appréciation esthétique à celle des autres</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Différencier les observations subjectives et objectives ; élargir son champ d'observation</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Créer son propre répertoire de traces</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Interroger son appréciation face à un élément culturel ou artistique</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer des liens interdisciplinaires lors de la découverte d'éléments culturels</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Explorer d'autres lieux, œuvres et objets culturels d'ici et d'ailleurs</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Interroger le sens et l'origine d'une œuvre, d'un lieu, d'un objet culturel</label><span class="badge p6">P6</span></div>
</div>
</div></div>

<div class="domain eca" id="domain-eca-corporelle"><div class="domain-header" onclick="toggleDomain(this)"><span class="domain-icon">🎭</span><span class="domain-title">Expression française et corporelle</span><span class="domain-progress" id="prog-eca-corporelle">—</span><span class="domain-toggle">▼</span></div><div class="domain-body"><div class="mini-prog eca"><div class="mini-prog-bar" id="bar-eca-corporelle" style="width:0%"></div></div>
<div class="subsection"><div class="subsection-title">Expression corporelle — P5</div>
<div class="item" data-year="p5"><input type="checkbox"><label>Expliquer le déroulement du temps dans une représentation (chronologie, flash-back, ellipse temporelle…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier différentes techniques vocales et de diction (accent tonique, articulation, intonation, prononciation…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier l'énergie des mouvements : le tonus musculaire (tension/détente, flexion/extension…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Comparer différentes occupations de l'espace et du plateau (regroupement, équilibre/déséquilibre, division des espaces scéniques…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Comparer des genres de jeux (comédie, tragédie, comédie musicale, seul en scène…) et de danses (indiennes, africaines, contemporaines, tango, flamenco…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Pratiquer des exercices d'articulation, vire-langues…</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Lire des extraits de texte avec expressivité</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Occuper différents rôles lors d'une production : principal, secondaire, « spect-acteur »</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Exécuter plusieurs mouvements avec une énergie différente</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Pratiquer différentes occupations de l'espace</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Proposer plusieurs manières d'occuper l'espace et un enchainement de mouvements avec des énergies différentes</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Exercer les différents rôles et fonctions dans une représentation (coulisse, plateau, rôles principaux/secondaires, spect-acteurs)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Expérimenter les fondamentaux rencontrés durant l'année dans une mise en jeu et en espace</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Inventer et mettre en espace une production scénique à partir de combinaisons de moyens corporels et verbaux</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Interpréter des chœurs parlés en résistant aux attirances sonores</label><span class="badge p5">P5</span></div>
</div>
<div class="subsection"><div class="subsection-title">Expression corporelle — P6 (nouvelles)</div>
<div class="item" data-year="p6"><input type="checkbox"><label>Comparer le temps de la représentation et le temps réel (ex : temps de l'intrigue/de la réalité)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Décrire la chorégraphie/structure de la phrase dansée, le jeu masqué, le rôle des partenaires/points de contact, les parties du corps initiatrices du mouvement</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Décrire la mise en scène (musique, bruitages, lumière, costumes, décors) et leur rôle illustratif ou symbolique</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Exemplifier l'ambiance sonore au regard de la mise en scène (illustrative/en contrepoint)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Participer à une mise en scène collective : proposer une phrase dansée, synchroniser mouvement et univers sonore</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Inventer une courte composition scénique ou chorégraphique</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Imaginer sa mise en espace, les costumes, les accessoires, le décor</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Organiser la préparation d'une représentation (répétitions, filages, répétition générale…)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Mettre en œuvre, dans une courte création, les fondamentaux abordés durant l'année</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>S'exprimer corporellement en tenant compte des fondamentaux abordés durant l'année</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>S'exprimer au travers d'un jeu masqué</label><span class="badge p6">P6</span></div>
</div>
</div></div>

<div class="domain eca" id="domain-eca-musicale"><div class="domain-header" onclick="toggleDomain(this)"><span class="domain-icon">🎵</span><span class="domain-title">Expression musicale</span><span class="domain-progress" id="prog-eca-musicale">—</span><span class="domain-toggle">▼</span></div><div class="domain-body"><div class="mini-prog eca"><div class="mini-prog-bar" id="bar-eca-musicale" style="width:0%"></div></div>
<div class="subsection"><div class="subsection-title">Expression musicale — P5</div>
<div class="item" data-year="p5"><input type="checkbox"><label>Différencier la pulsation et le rythme</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Décrire des éléments constitutifs du langage musical (partition, portée, gamme, clé de sol…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Décrire des formes musicales au travers de chansons contemporaines, traditionnelles ou extraits classiques</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Reconnaitre visuellement et auditivement des membranophones et des idiophones d'ici ou d'ailleurs</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Interpréter en chœur ou individuellement des chansons en expérimentant des techniques vocales (échauffement, respiration, posture, pose de la voix, prononciation, justesse mélodique)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Chanter des chansons contemporaines d'ici et d'ailleurs et en aborder les thématiques</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Effectuer un canon à deux voix en parlé/rythmé</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Accompagner vocalement, corporellement ou instrumentalement un extrait sonore</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Interpréter collectivement des accompagnements vocaux, corporels ou instrumentaux à partir d'une chanson</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Réaliser collectivement une production vocale, corporelle ou instrumentale à partir d'un support numérique donné</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Choisir au moins une référence pour l'écoute et une pour l'expression musicale</label><span class="badge p5">P5</span></div>
</div>
<div class="subsection"><div class="subsection-title">Expression musicale — P6 (nouvelles)</div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer la pulsation et le rythme</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Connaitre des symboles du langage musical traditionnel (portée, gamme, clé de sol, notes et silences…)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Prendre conscience des organes mobilisés pour chanter</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer la polyphonie avec ses propres mots</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Décrire des formes musicales (structures) au travers de chansons contemporaines ou extraits classiques, d'ici et d'ailleurs</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Décrire la composition d'ensembles vocaux et instrumentaux (orchestre symphonique, Big Band, groupe rock, chorale…)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Reconnaitre, à l'audition, des instruments issus des 5 familles et différents ensembles vocaux/instrumentaux</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Interpréter, en chœur ou individuellement, des chansons en expérimentant les techniques vocales</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Interpréter des chants polyphoniques simples à deux voix (ex : chansons traditionnelles africaines)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Relier, à l'audition et visuellement, des formes musicales simples à des extraits musicaux (partition codée, musicogramme, canon, ritournelle, ABA…)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Proposer un accompagnement vocal, corporel et instrumental à partir d'un extrait sonore</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Interpréter en petits groupes des accompagnements vocaux, corporels ou instrumentaux</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Résister aux attirances sonores lors de l'interprétation de chansons polyphoniques et de chœurs parlés</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Réaliser en petits groupes des productions vocales, corporelles ou instrumentales à partir d'un support numérique</label><span class="badge p6">P6</span></div>
</div>
</div></div>

<div class="domain eca" id="domain-eca-plastique"><div class="domain-header" onclick="toggleDomain(this)"><span class="domain-icon">🖌️</span><span class="domain-title">Expression plastique</span><span class="domain-progress" id="prog-eca-plastique">—</span><span class="domain-toggle">▼</span></div><div class="domain-body"><div class="mini-prog eca"><div class="mini-prog-bar" id="bar-eca-plastique" style="width:0%"></div></div>
<div class="subsection"><div class="subsection-title">Expression plastique — P5</div>
<div class="item" data-year="p5"><input type="checkbox"><label>Caractériser une image fixe et une image en mouvement</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Distinguer le croquis/dessin, la photographie numérique, les outils graphiques spécialisés (pinceaux, couteaux, spatule, rouleau, brosse, éponge…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Distinguer fond/forme/mise en page/plan/format/échelles/proportions et les volumes simples</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier des valeurs (gradation de nuances) de couleurs, des contrastes de couleurs, les ombres et la lumière dans une œuvre d'art</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Explorer les relations entre les objets et la lumière</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Varier les types de compositions (rapports fond/forme, juxtapositions, oppositions entre couleurs, matières, supports…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Réaliser des croquis, dessins, peinture à l'aide d'outils graphiques spécialisés (y compris numériques)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Exercer le cadrage, y compris photographique</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Réaliser la mise en valeur d'une production individuelle ou collective</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Exemplifier la composition et la lumière dans une production plastique</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Traduire des effets de lumière, d'angles de vue variés dans une production plastique, quel que soit le support</label><span class="badge p5">P5</span></div>
</div>
<div class="subsection"><div class="subsection-title">Expression plastique — P6 (nouvelles)</div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer l'équilibre dans une mise en page</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Aborder des techniques de captures vidéo simples</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Relever les caractéristiques numériques dans une œuvre d'art</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Identifier des points de vue (haut, profil, face…) et des plans (gros plan, plan moyen…)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Identifier dans une œuvre d'art : nuance, valeur, monochromie, polychromie, harmonie…</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Identifier des effets de l'ombre et de la lumière sur des formes volumiques</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expérimenter des effets de lumière à partir de couleurs</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Réaliser des prises de vues diversifiées (fixes ou animées) et les traiter</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Produire une image fixe ou animée à l'aide d'un support choisi</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Mettre des volumes en œuvre</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Mettre en valeur une production individuelle en proposant un dispositif de présentation</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Exemplifier les fondamentaux caractérisant une image fixe ou animée (formes, rythmes, mouvements, lumière…) et les volumes</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Élaborer des images fixes et/ou animées à l'aide d'outils, de supports, de gestes et de techniques variées</label><span class="badge p6">P6</span></div>
</div>
</div></div>

</div>
```

---

## 6. Récapitulatif

| Domaine | Items P5 | Items P6 | Total |
|---|---|---|---|
| Repères culturels et artistiques | 12 | 11 | 23 |
| Expression française et corporelle | 15 | 11 | 26 |
| Expression musicale | 11 | 14 | 25 |
| Expression plastique | 11 | 13 | 24 |
| **Total ECA** | **49** | **49** | **98** |

Une fois ce domaine intégré, l'application couvrira 100 % des 6 matières officielles + ECA. Le total général de l'app passera de 479 items (avant toute mise à jour) à environ 479 + 11 (maths) + 21 (français) + 15 (sciences) + 26 (histoire-géo) + 2 net (éco-social) + 10 (FMTTN, hors décision fmttn-info) + 98 (ECA) ≈ **~660 items**, répartis sur **7 matières officielles du tronc commun FWB**.
