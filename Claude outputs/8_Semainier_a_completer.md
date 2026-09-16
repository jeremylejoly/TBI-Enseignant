# Semainier (`semainier_fwb_prototype.html`) — Mise à niveau vers 100 % référentiel FWB

**Fichier à modifier :** `semainier_fwb_prototype.html`
**Objet concerné :** la constante JavaScript `const FWB_DATABASE = {...}` qui alimente la fenêtre « Référentiel FWB — Compétences & Attendus P5-P6 » du Semainier (bouton « ✓ Choisir »).

## Contexte

Ce fichier est **indépendant** de `programme_P5_P6.html` (onglet « Programme P5-P6 ») : il contient sa propre copie des attendus, dans un objet JS (et non des `<div class="item">` HTML). Les rapports 1 à 5 et 7 déjà transmis à Antigravity ont mis à jour uniquement `programme_P5_P6.html` (désormais complet à 663 items, vérifié). Ce rapport fait le même travail pour la base `FWB_DATABASE` du Semainier, en la comparant directement au contenu maintenant complet de `programme_P5_P6.html`, qui sert ici de référence.

**Hors périmètre de ce rapport, sur décision de l'enseignant :**
- FMTTN (clé `"fmttn"`) : non traité, comme pour le Programme P5-P6.
- Éducation physique & motricité (`"eps"`), Langues modernes (`"lang"`), Éducation à la philosophie & citoyenneté (`"cpc"`) : ces 3 matières existent déjà dans `FWB_DATABASE` mais aucun référentiel officiel correspondant n'est disponible pour les vérifier. Non traitées pour l'instant.

## Note technique pour Antigravity

Format d'un item : `{"year": "P5", "text": "..."}`. Structure : `FWB_DATABASE[matière].domains[i].subsections[j].items[k]`. Pour les **ajouts**, insérer l'objet JSON dans la sous-section existante la plus proche du thème et de l'année (P5 ou P6) ; à défaut, créer une nouvelle sous-section. Aucun total n'est codé en dur ailleurs : les compteurs affichés dans le sélecteur (ex. « Français 118 ») sont recalculés dynamiquement depuis `FWB_DATABASE`.

## 1. Mathématiques (clé `"math"`)

*Domaine(s) `math-data` : déjà complet, aucun changement.*

### Géométrie (`domain-math-geo`) — 33 → 37 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Utiliser le vocabulaire exprimant des positions ordinales : premier, deuxième, troisième… dernier ; au début, à la fin, avant, après"},
{"year": "P5", "text": "Identifier les éléments du plan : droite, segment de droite"},
{"year": "P5", "text": "Reconnaitre les figures possibles correspondant aux faces d'un assemblage de maximum 3 cubes"},
{"year": "P6", "text": "Reconnaitre les figures possibles correspondant aux faces d'un assemblage de maximum 5 cubes"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *[P6] Tracer un assemblage de figures selon un axe de symétrie*
  Après (P6) : *Tracer un assemblage de figures selon un axe de symétrie*

### Grandeurs (`domain-math-grand`) — 46 → 50 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Distinguer dans l'expression d'une grandeur mesurée : la grandeur, la mesure et l'unité de mesure"},
{"year": "P5", "text": "Reconnaitre la grandeur « durée » dans des expressions courantes (ex : garantie, délai de livraison, période de soldes, date de péremption…)"},
{"year": "P5", "text": "Énoncer les relations entre certaines unités conventionnelles de durées (ex : 1 seconde = 10 dixièmes de seconde = 100 centièmes de seconde)"},
{"year": "P6", "text": "Utiliser les relations entre les unités conventionnelles de durées"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *Énoncer la formule de l'aire du rectangle, du carré*
  Après (P5) : *Énoncer la formule de l'aire du rectangle, du carré et du parallélogramme*

### Nombres & calcul (`domain-math-nb`) — 34 → 37 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Décomposer et recomposer des nombres de trois à six chiffres en lien avec la numération décimale (valeur de position)"},
{"year": "P5", "text": "Décomposer un nombre en sa partie entière et sa partie non entière"},
{"year": "P5", "text": "Reconnaitre les parenthèses comme symbole intervenant dans des procédures de calcul"},
```

---

## 2. Français (clé `"fr"`)

*Domaine(s) `fr-ortho` : déjà complet, aucun changement.*

### Conjugaison (`domain-fr-conj`) — 26 → 27 items

**Items à ajouter :**
```json
{"year": "P6", "text": "Consolidation et automatisation des accords du PP"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *PP employé sans auxiliaire : accord en genre et en nombre avec le nom*
  Après (P5) : *PP employé sans auxiliaire (accord avec le nom)*
- Avant : *PP employé avec être : accord en genre et en nombre avec le sujet*
  Après (P5) : *PP avec être (accord avec le sujet)*
- Avant : *PP employé avec avoir : pas d'accord au niveau primaire (invariabilité du participe)*
  Après (P5) : *PP avec avoir (pas d'accord en général)*

### Grammaire & orthographe grammaticale (`domain-fr-gram`) — 23 → 27 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Repérer et verbaliser les nuances apportées par les marques de la négation"},
{"year": "P5", "text": "Repérer et verbaliser les nuances apportées par les marques de l'assertion, de l'interrogation, de l'injonction"},
{"year": "P5", "text": "Repérer les structures passives"},
{"year": "P5", "text": "Repérer les structures de mise en évidence"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *Terminologie : mode, radical, terminaison, auxiliaire, anaphore, référent*
  Après (P5) : *Terminologie : classe, fonction, accord, genre, nombre, personne, substitut grammatical, anaphore, référent, mode, radical, terminaison, auxiliaire*

### Lecture & compréhension (`domain-fr-lect`) — 30 → 37 items

**Items à ajouter :**
```json
{"year": "P6", "text": "Mener ses premières recherches documentaires autonomes"},
{"year": "P5", "text": "Désigner la maison d'édition, la collection, le sommaire ou la table des matières (paratexte)"},
{"year": "P5", "text": "Repérer les organisateurs textuels pour construire du sens"},
{"year": "P5", "text": "Utiliser les organisateurs textuels pour construire la cohérence"},
{"year": "P5", "text": "Utiliser les termes du support de lecture (paratexte) : titres, sous-titres, paragraphes"},
{"year": "P6", "text": "Noter des mots-clés du message lu ou entendu"},
{"year": "P6", "text": "Organiser ses notes (schéma, ligne du temps, carte mentale…)"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *Identifier la bibliographie, l'auteur, la langue d'origine et la date d'édition d'un document*
  Après (P6) : *Identifier la bibliographie, langue d'origine, date d'édition d'un document*
- Avant : *Exploiter et confronter des informations issues d'un portefeuille de plusieurs documents (sources multiples)*
  Après (P6) : *Exploiter un portefeuille de plusieurs documents (sources multiples)*

### Production écrite & expression orale (`domain-fr-prod`) — 21 → 32 items

**Items à ajouter :**
```json
{"year": "P5", "text": "S'adapter à la diversité des interlocuteurs : connu/inconnu, familier/non familier, un/plusieurs, du même âge/plus jeune/plus âgé, d'ici/d'ailleurs"},
{"year": "P5", "text": "Oser proposer des idées nouvelles"},
{"year": "P5", "text": "Oser s'exprimer en dépit des maladresses syntaxiques, des répétitions et des hésitations dans les formulations"},
{"year": "P5", "text": "Proposer diverses formulations"},
{"year": "P5", "text": "Accepter d'utiliser provisoirement un vocabulaire approximatif ou le même mot pour exprimer diverses choses"},
{"year": "P5", "text": "Questionner ses interlocuteurs suite à une difficulté de compréhension ou pour en savoir plus sur le sujet"},
{"year": "P5", "text": "Répondre à des questions posées à la suite d'une prise de parole préparée"},
{"year": "P5", "text": "Clarifier ses propos ou ses réactions en faisant des liens entre ses idées"},
{"year": "P5", "text": "Revenir au sujet lorsqu'on s'en éloigne"},
{"year": "P5", "text": "Enchainer une prise de parole à la suite de celle d'un autre"},
{"year": "P5", "text": "Utiliser à bon escient des expressions types pour respecter les règles de courtoisie"},
```

---

## 3. Sciences (clé `"sci"`)

### Démarches d'investigation scientifique (`domain-sci-inv`) — 24 → 26 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Proposer des moyens d'investigation"},
{"year": "P5", "text": "Utiliser des symboles pertinents pour représenter une situation expérimentale"},
```

### Vivants (`domain-sci-viv`) — 25 → 32 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Préciser le rôle respectif des deux sexes au cours de la reproduction sexuée (l'homme produit les spermatozoïdes, la femme les ovules)"},
{"year": "P5", "text": "Réaliser une représentation pour illustrer la fécondation (rencontre spermatozoïde/ovule)"},
{"year": "P5", "text": "Identifier l'organe de la plante contenant la/les graine(s) comme étant le fruit provenant de la fleur fécondée"},
{"year": "P5", "text": "Identifier la fécondation chez les plantes comme la rencontre entre un grain de pollen et un ovule présent dans la plante"},
{"year": "P6", "text": "Préciser que l'eau est absorbée au niveau du côlon"},
{"year": "P6", "text": "Préciser que les matières non absorbées sont évacuées au niveau de l'anus"},
{"year": "P6", "text": "Préciser que certains déchets sont évacués dans les urines, d'autres au niveau des poumons (dioxyde de carbone)"},
```

### Matière (`domain-sci-mat`) — 10 → 12 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Préparer des mélanges de deux constituants"},
{"year": "P6", "text": "Préciser que l'énergie chimique stockée dans la matière est transformée en énergie thermique lors de la combustion"},
```

### Énergie (`domain-sci-ene`) — 17 → 21 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Préciser que le Soleil est une source de lumière, tandis que la Lune renvoie la lumière qu'elle reçoit du Soleil"},
{"year": "P5", "text": "Repérer s'il fait jour ou nuit à un endroit donné, en fonction des positions respectives de l'observateur et du Soleil"},
{"year": "P5", "text": "Tester différents matériaux dans un circuit électrique simple, pour distinguer un isolant d'un conducteur"},
{"year": "P6", "text": "Mettre en évidence expérimentalement comment empêcher un objet chaud de se refroidir, et inversement"},
```

---

## 4. Histoire (clé `"hist"`)

### Formation historique (`domain-hist-hist`) — 30 → 47 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Exemplifier des obligations réciproques entre le seigneur et la communauté villageoise"},
{"year": "P5", "text": "Exemplifier des droits acquis par la bourgeoisie (villes médiévales)"},
{"year": "P5", "text": "Savoir culturel : un∙e acteur∙rice du développement industriel au XIXe s. (ex. : John Cockerill, Antoinette Brepols…)"},
{"year": "P5", "text": "Savoir culturel : patrimoine régional lié aux périodes étudiées (sites archéologiques, villes médiévales, quartiers industriels XIXe-XXe s., Atomium, 1er mai…)"},
{"year": "P5", "text": "Sélectionner l'outil d'information adéquat en fonction de la recherche menée (dictionnaire, atlas, corpus documentaire, moteur de recherche…)"},
{"year": "P5", "text": "Relever des informations explicites dans une trace du passé ou un document reconstitué, en lien avec un repère temporel"},
{"year": "P5", "text": "Identifier l'auteur, la date et le lieu de réalisation d'un document grâce à sa référence"},
{"year": "P5", "text": "Justifier la pertinence d'un document donné en lien avec une problématique historique"},
{"year": "P6", "text": "Identifier des apports culturels des migrations en Belgique de 1945 à nos jours"},
{"year": "P6", "text": "Expliquer pourquoi la Belgique a officiellement demandé à d'autres pays de la main-d'œuvre ouvrière de 1945 à 1970"},
{"year": "P6", "text": "Expliquer une facilité et un obstacle à l'intégration des migrants de 1945 à 1970"},
{"year": "P6", "text": "Expliquer un impact des colonisations européennes du XVe au XVIIIe siècle sur les peuples colonisés"},
{"year": "P6", "text": "Énoncer des produits de consommation originaires des régions colonisées entre le XVe et le XVIIIe siècle"},
{"year": "P6", "text": "Savoir culturel : patrimoine régional — sites archéologiques et industriels, édifices religieux, artéfacts et objets d'art"},
{"year": "P6", "text": "Identifier l'auteur, la date et le lieu de réalisation d'un document"},
{"year": "P6", "text": "Sélectionner une information en recourant à une table des matières, à un index alphabétique ou à un moteur de recherche"},
{"year": "P6", "text": "Justifier la pertinence ou la non-pertinence d'un document donné par rapport à une problématique liée à la multiculturalité"},
```

---

## 5. Géographie (clé `"geo"`)

### Formation géographique (`domain-hist-geo`) — 32 → 41 items

**Items à ajouter :**
```json
{"year": "P5", "text": "Relever l'altitude d'un point sur une carte, un globe virtuel ou un géoportail"},
{"year": "P5", "text": "Repérer les variations d'altitude sur un profil du relief"},
{"year": "P5", "text": "Situer une occupation/utilisation du sol en Belgique ou en Europe, en référence aux directions cardinales et à des repères"},
{"year": "P5", "text": "Sur la base de représentations de l'espace actuelles et antérieures, identifier des transformations/permanences dans l'occupation du sol en Belgique"},
{"year": "P6", "text": "Annoter une carte pour mettre en évidence le nom des pays, les principaux parallèles et d'autres repères utiles pour situer un fait ou un phénomène"},
{"year": "P6", "text": "Annoter une photographie verticale pour mettre en évidence un changement d'occupation du sol"},
{"year": "P6", "text": "Situer en quelques mots des espaces plus ou moins peuplés à l'aide des repères connus ou identifiés sur une carte"},
{"year": "P6", "text": "Situer un fait ou un phénomène à l'échelle d'un continent ou du monde, en référence à des repères, à la répartition de la population et aux zones thermiques"},
{"year": "P6", "text": "Caractériser dans un espace des activités humaines relevant de la production, des transports ou de la consommation"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *Répartition mondiale : ~7,9 milliards ; 60% en Asie, 10% en Europe ; 70% en ville*
  Après (P6) : *Répartition mondiale : ~7,9 milliards ; 60% en Asie, 10% en Europe ; un peu plus de 20% à moins de 30 km des côtes ; 70% en ville*

---

## 6. Éco & Social (clé `"eco"`)

### Formation économique (`domain-eco-eco`) — 16 → 18 items

**Item reçu par reclassement depuis `domain-eco-soc`** (voir Formation sociale ci-dessous) : *Modes de financement alternatifs et participatifs* (P6) — inclus dans les ajouts ci-dessous.

**Items à ajouter :**
```json
{"year": "P6", "text": "Modes de financement alternatifs et participatifs"},
{"year": "P6", "text": "En comparant les impacts économiques, sociaux et environnementaux de différents modes de production/consommation, justifier l'appartenance d'acteurs au commerce équitable"},
```

### Formation sociale (`domain-eco-soc`) — 9 → 10 items

**Item à reclasser (déplacer vers `domain-eco-eco`) :** *Modes de financement alternatifs, éthiques et participatifs (microcrédit, coopératives, dons)* → devient dans `domain-eco-eco` : *Modes de financement alternatifs et participatifs* (P6)

**Items à ajouter :**
```json
{"year": "P6", "text": "Ressources naturelles et énergétiques non infinies et inégalement réparties"},
{"year": "P6", "text": "Pour une organisation pratiquant l'économie sociale et solidaire ou circulaire, décrire comment les biens/services sont produits et l'incidence sur l'environnement local (relations producteurs-consommateurs, proximité, savoir-faire local)"},
{"year": "P6", "text": "Notion d'interdépendance entre acteurs économiques et sociaux"},
```

**Items à corriger (texte incomplet ou imprécis) :**
- Avant : *Notions d'égalité et d'inégalité dans le monde du travail*
  Après (P5) : *Notions d'égalité/inégalité dans le monde du travail*
- Avant : *Analyser les tensions entre intérêts individuels et intérêts collectifs, pour les générations actuelles et futures*
  Après (P6) : *Pour un acte de consommation/production donné, formuler des questions sur les tensions entre intérêts individuels et intérêts collectifs des générations actuelles et futures (développement durable)*
- Avant : *Évaluer l'impact des choix de consommation sur l'environnement, l'emploi et la cohésion sociale*
  Après (P6) : *Comprendre que les choix individuels ont une influence sur autrui et sur la planète*

**Items à supprimer :**
- (P6) *Identifier et décrire des initiatives relevant de l'économie sociale, solidaire et circulaire*

---
## 7. Éducation culturelle et artistique — ECA (clé `"eca"`) — restructuration complète : 9 → 98 items

La base du Semainier contient aujourd'hui, pour `"eca"`, seulement 2 domaines très généraux (`domain-eca-art`, 5 items, et `domain-eca-mus`, 4 items — 9 items au total), qui ne reprennent pas la structure officielle du référentiel ECA et ne couvrent qu'une petite partie de la matière.

`programme_P5_P6.html` contient désormais la version complète et vérifiée (98 items, organisés selon les 4 axes du référentiel officiel : Repères culturels, Expression corporelle, Expression musicale, Expression plastique — voir rapport `7_ECA_a_creer.md`).

**Recommandation : remplacer entièrement le tableau `domains` de `"eca"`** par les 4 domaines ci-dessous, pour que le Semainier et le Programme P5-P6 proposent exactement le même contenu ECA. Les 9 items actuels du Semainier n'ont pas d'équivalent officiel précis dans le référentiel sous cette forme ; leur contenu (techniques plastiques de base, pratique vocale) est de toute façon couvert, en plus détaillé et sourcé, dans les nouveaux domaines `domain-eca-plastique` et `domain-eca-musicale` ci-dessous.

Les métadonnées de la matière (`id: "eca"`, `name`, `icon: "🎨"`, `color`, `bg`, `border`, `text`) restent inchangées — seul le tableau `domains` est remplacé.

**Nouveau tableau `domains` pour `"eca"` (à coller tel quel) :**

```json
[
  {
    "id": "domain-eca-reperes",
    "icon": "🗺️",
    "title": "Repères culturels et artistiques",
    "subsections": [
      {
        "title": "Repères culturels — P5",
        "items": [
          {
            "year": "P5",
            "text": "Sélectionner au moins un exemple par mode d'expression (théâtre/danse, musique — écoute et expression, arts plastiques)"
          },
          {
            "year": "P5",
            "text": "Découvrir une trace du passé (vestiges archéologiques, ruines, site de fouilles…)"
          },
          {
            "year": "P5",
            "text": "Découvrir un patrimoine immatériel d'ici ou d'ailleurs (fêtes, traditions, croyances, savoir-faire artisanal…)"
          },
          {
            "year": "P5",
            "text": "Découvrir un mythe ou une légende d'ici ou d'ailleurs"
          },
          {
            "year": "P5",
            "text": "Présenter, suite à des visites in situ, un site archéologique, un élément du patrimoine immatériel ou un mythe/une légende"
          },
          {
            "year": "P5",
            "text": "Exemplifier le contexte, identifier la signification et formuler son appréciation esthétique d'une œuvre, d'un lieu ou d'un objet culturel"
          },
          {
            "year": "P5",
            "text": "Observer de façon objective des éléments du patrimoine, un site archéologique"
          },
          {
            "year": "P5",
            "text": "Enrichir sa collection de traces"
          },
          {
            "year": "P5",
            "text": "Interroger le sens des recherches et de la conservation des traces du passé"
          },
          {
            "year": "P5",
            "text": "Établir des liens interdisciplinaires lors de la découverte d'éléments culturels"
          },
          {
            "year": "P5",
            "text": "Explorer un patrimoine matériel et immatériel d'ici ou d'ailleurs"
          },
          {
            "year": "P5",
            "text": "Interroger collectivement le sens et l'origine d'une œuvre, d'un lieu, d'un objet culturel"
          }
        ]
      },
      {
        "title": "Repères culturels — P6 (nouvelles)",
        "items": [
          {
            "year": "P6",
            "text": "Sélectionner au moins un exemple par mode d'expression"
          },
          {
            "year": "P6",
            "text": "Découvrir un lieu de culture complétant le panel déjà observé"
          },
          {
            "year": "P6",
            "text": "Découvrir un patrimoine matériel d'ici et d'ailleurs (ex : pyramides, Taj Mahal, Muraille de Chine…)"
          },
          {
            "year": "P6",
            "text": "Compléter son répertoire de lieux culturels et d'objets de cultures, d'époques et de pays différents"
          },
          {
            "year": "P6",
            "text": "Expliquer l'origine d'une œuvre, d'un lieu, d'un objet culturel et confronter sa propre appréciation esthétique à celle des autres"
          },
          {
            "year": "P6",
            "text": "Différencier les observations subjectives et objectives ; élargir son champ d'observation"
          },
          {
            "year": "P6",
            "text": "Créer son propre répertoire de traces"
          },
          {
            "year": "P6",
            "text": "Interroger son appréciation face à un élément culturel ou artistique"
          },
          {
            "year": "P6",
            "text": "Expliquer des liens interdisciplinaires lors de la découverte d'éléments culturels"
          },
          {
            "year": "P6",
            "text": "Explorer d'autres lieux, œuvres et objets culturels d'ici et d'ailleurs"
          },
          {
            "year": "P6",
            "text": "Interroger le sens et l'origine d'une œuvre, d'un lieu, d'un objet culturel"
          }
        ]
      }
    ]
  },
  {
    "id": "domain-eca-corporelle",
    "icon": "🎭",
    "title": "Expression française et corporelle",
    "subsections": [
      {
        "title": "Expression corporelle — P5",
        "items": [
          {
            "year": "P5",
            "text": "Expliquer le déroulement du temps dans une représentation (chronologie, flash-back, ellipse temporelle…)"
          },
          {
            "year": "P5",
            "text": "Identifier différentes techniques vocales et de diction (accent tonique, articulation, intonation, prononciation…)"
          },
          {
            "year": "P5",
            "text": "Identifier l'énergie des mouvements : le tonus musculaire (tension/détente, flexion/extension…)"
          },
          {
            "year": "P5",
            "text": "Comparer différentes occupations de l'espace et du plateau (regroupement, équilibre/déséquilibre, division des espaces scéniques…)"
          },
          {
            "year": "P5",
            "text": "Comparer des genres de jeux (comédie, tragédie, comédie musicale, seul en scène…) et de danses (indiennes, africaines, contemporaines, tango, flamenco…)"
          },
          {
            "year": "P5",
            "text": "Pratiquer des exercices d'articulation, vire-langues…"
          },
          {
            "year": "P5",
            "text": "Lire des extraits de texte avec expressivité"
          },
          {
            "year": "P5",
            "text": "Occuper différents rôles lors d'une production : principal, secondaire, « spect-acteur »"
          },
          {
            "year": "P5",
            "text": "Exécuter plusieurs mouvements avec une énergie différente"
          },
          {
            "year": "P5",
            "text": "Pratiquer différentes occupations de l'espace"
          },
          {
            "year": "P5",
            "text": "Proposer plusieurs manières d'occuper l'espace et un enchainement de mouvements avec des énergies différentes"
          },
          {
            "year": "P5",
            "text": "Exercer les différents rôles et fonctions dans une représentation (coulisse, plateau, rôles principaux/secondaires, spect-acteurs)"
          },
          {
            "year": "P5",
            "text": "Expérimenter les fondamentaux rencontrés durant l'année dans une mise en jeu et en espace"
          },
          {
            "year": "P5",
            "text": "Inventer et mettre en espace une production scénique à partir de combinaisons de moyens corporels et verbaux"
          },
          {
            "year": "P5",
            "text": "Interpréter des chœurs parlés en résistant aux attirances sonores"
          }
        ]
      },
      {
        "title": "Expression corporelle — P6 (nouvelles)",
        "items": [
          {
            "year": "P6",
            "text": "Comparer le temps de la représentation et le temps réel (ex : temps de l'intrigue/de la réalité)"
          },
          {
            "year": "P6",
            "text": "Décrire la chorégraphie/structure de la phrase dansée, le jeu masqué, le rôle des partenaires/points de contact, les parties du corps initiatrices du mouvement"
          },
          {
            "year": "P6",
            "text": "Décrire la mise en scène (musique, bruitages, lumière, costumes, décors) et leur rôle illustratif ou symbolique"
          },
          {
            "year": "P6",
            "text": "Exemplifier l'ambiance sonore au regard de la mise en scène (illustrative/en contrepoint)"
          },
          {
            "year": "P6",
            "text": "Participer à une mise en scène collective : proposer une phrase dansée, synchroniser mouvement et univers sonore"
          },
          {
            "year": "P6",
            "text": "Inventer une courte composition scénique ou chorégraphique"
          },
          {
            "year": "P6",
            "text": "Imaginer sa mise en espace, les costumes, les accessoires, le décor"
          },
          {
            "year": "P6",
            "text": "Organiser la préparation d'une représentation (répétitions, filages, répétition générale…)"
          },
          {
            "year": "P6",
            "text": "Mettre en œuvre, dans une courte création, les fondamentaux abordés durant l'année"
          },
          {
            "year": "P6",
            "text": "S'exprimer corporellement en tenant compte des fondamentaux abordés durant l'année"
          },
          {
            "year": "P6",
            "text": "S'exprimer au travers d'un jeu masqué"
          }
        ]
      }
    ]
  },
  {
    "id": "domain-eca-musicale",
    "icon": "🎵",
    "title": "Expression musicale",
    "subsections": [
      {
        "title": "Expression musicale — P5",
        "items": [
          {
            "year": "P5",
            "text": "Différencier la pulsation et le rythme"
          },
          {
            "year": "P5",
            "text": "Décrire des éléments constitutifs du langage musical (partition, portée, gamme, clé de sol…)"
          },
          {
            "year": "P5",
            "text": "Décrire des formes musicales au travers de chansons contemporaines, traditionnelles ou extraits classiques"
          },
          {
            "year": "P5",
            "text": "Reconnaitre visuellement et auditivement des membranophones et des idiophones d'ici ou d'ailleurs"
          },
          {
            "year": "P5",
            "text": "Interpréter en chœur ou individuellement des chansons en expérimentant des techniques vocales (échauffement, respiration, posture, pose de la voix, prononciation, justesse mélodique)"
          },
          {
            "year": "P5",
            "text": "Chanter des chansons contemporaines d'ici et d'ailleurs et en aborder les thématiques"
          },
          {
            "year": "P5",
            "text": "Effectuer un canon à deux voix en parlé/rythmé"
          },
          {
            "year": "P5",
            "text": "Accompagner vocalement, corporellement ou instrumentalement un extrait sonore"
          },
          {
            "year": "P5",
            "text": "Interpréter collectivement des accompagnements vocaux, corporels ou instrumentaux à partir d'une chanson"
          },
          {
            "year": "P5",
            "text": "Réaliser collectivement une production vocale, corporelle ou instrumentale à partir d'un support numérique donné"
          },
          {
            "year": "P5",
            "text": "Choisir au moins une référence pour l'écoute et une pour l'expression musicale"
          }
        ]
      },
      {
        "title": "Expression musicale — P6 (nouvelles)",
        "items": [
          {
            "year": "P6",
            "text": "Expliquer la pulsation et le rythme"
          },
          {
            "year": "P6",
            "text": "Connaitre des symboles du langage musical traditionnel (portée, gamme, clé de sol, notes et silences…)"
          },
          {
            "year": "P6",
            "text": "Prendre conscience des organes mobilisés pour chanter"
          },
          {
            "year": "P6",
            "text": "Expliquer la polyphonie avec ses propres mots"
          },
          {
            "year": "P6",
            "text": "Décrire des formes musicales (structures) au travers de chansons contemporaines ou extraits classiques, d'ici et d'ailleurs"
          },
          {
            "year": "P6",
            "text": "Décrire la composition d'ensembles vocaux et instrumentaux (orchestre symphonique, Big Band, groupe rock, chorale…)"
          },
          {
            "year": "P6",
            "text": "Reconnaitre, à l'audition, des instruments issus des 5 familles et différents ensembles vocaux/instrumentaux"
          },
          {
            "year": "P6",
            "text": "Interpréter, en chœur ou individuellement, des chansons en expérimentant les techniques vocales"
          },
          {
            "year": "P6",
            "text": "Interpréter des chants polyphoniques simples à deux voix (ex : chansons traditionnelles africaines)"
          },
          {
            "year": "P6",
            "text": "Relier, à l'audition et visuellement, des formes musicales simples à des extraits musicaux (partition codée, musicogramme, canon, ritournelle, ABA…)"
          },
          {
            "year": "P6",
            "text": "Proposer un accompagnement vocal, corporel et instrumental à partir d'un extrait sonore"
          },
          {
            "year": "P6",
            "text": "Interpréter en petits groupes des accompagnements vocaux, corporels ou instrumentaux"
          },
          {
            "year": "P6",
            "text": "Résister aux attirances sonores lors de l'interprétation de chansons polyphoniques et de chœurs parlés"
          },
          {
            "year": "P6",
            "text": "Réaliser en petits groupes des productions vocales, corporelles ou instrumentales à partir d'un support numérique"
          }
        ]
      }
    ]
  },
  {
    "id": "domain-eca-plastique",
    "icon": "🖌️",
    "title": "Expression plastique",
    "subsections": [
      {
        "title": "Expression plastique — P5",
        "items": [
          {
            "year": "P5",
            "text": "Caractériser une image fixe et une image en mouvement"
          },
          {
            "year": "P5",
            "text": "Distinguer le croquis/dessin, la photographie numérique, les outils graphiques spécialisés (pinceaux, couteaux, spatule, rouleau, brosse, éponge…)"
          },
          {
            "year": "P5",
            "text": "Distinguer fond/forme/mise en page/plan/format/échelles/proportions et les volumes simples"
          },
          {
            "year": "P5",
            "text": "Identifier des valeurs (gradation de nuances) de couleurs, des contrastes de couleurs, les ombres et la lumière dans une œuvre d'art"
          },
          {
            "year": "P5",
            "text": "Explorer les relations entre les objets et la lumière"
          },
          {
            "year": "P5",
            "text": "Varier les types de compositions (rapports fond/forme, juxtapositions, oppositions entre couleurs, matières, supports…)"
          },
          {
            "year": "P5",
            "text": "Réaliser des croquis, dessins, peinture à l'aide d'outils graphiques spécialisés (y compris numériques)"
          },
          {
            "year": "P5",
            "text": "Exercer le cadrage, y compris photographique"
          },
          {
            "year": "P5",
            "text": "Réaliser la mise en valeur d'une production individuelle ou collective"
          },
          {
            "year": "P5",
            "text": "Exemplifier la composition et la lumière dans une production plastique"
          },
          {
            "year": "P5",
            "text": "Traduire des effets de lumière, d'angles de vue variés dans une production plastique, quel que soit le support"
          }
        ]
      },
      {
        "title": "Expression plastique — P6 (nouvelles)",
        "items": [
          {
            "year": "P6",
            "text": "Expliquer l'équilibre dans une mise en page"
          },
          {
            "year": "P6",
            "text": "Aborder des techniques de captures vidéo simples"
          },
          {
            "year": "P6",
            "text": "Relever les caractéristiques numériques dans une œuvre d'art"
          },
          {
            "year": "P6",
            "text": "Identifier des points de vue (haut, profil, face…) et des plans (gros plan, plan moyen…)"
          },
          {
            "year": "P6",
            "text": "Identifier dans une œuvre d'art : nuance, valeur, monochromie, polychromie, harmonie…"
          },
          {
            "year": "P6",
            "text": "Identifier des effets de l'ombre et de la lumière sur des formes volumiques"
          },
          {
            "year": "P6",
            "text": "Expérimenter des effets de lumière à partir de couleurs"
          },
          {
            "year": "P6",
            "text": "Réaliser des prises de vues diversifiées (fixes ou animées) et les traiter"
          },
          {
            "year": "P6",
            "text": "Produire une image fixe ou animée à l'aide d'un support choisi"
          },
          {
            "year": "P6",
            "text": "Mettre des volumes en œuvre"
          },
          {
            "year": "P6",
            "text": "Mettre en valeur une production individuelle en proposant un dispositif de présentation"
          },
          {
            "year": "P6",
            "text": "Exemplifier les fondamentaux caractérisant une image fixe ou animée (formes, rythmes, mouvements, lumière…) et les volumes"
          },
          {
            "year": "P6",
            "text": "Élaborer des images fixes et/ou animées à l'aide d'outils, de supports, de gestes et de techniques variées"
          }
        ]
      }
    ]
  }
]
```

---

## Récapitulatif

| Matière | Avant (Semainier) | Après | Changement |
|---|---|---|---|
| Mathématiques | 122 | 133 | +11 ajouts, +2 corrections |
| Français | 118 | 141 | +23 ajouts, +6 corrections |
| Sciences | 76 | 91 | +15 ajouts |
| Histoire | 30 | 47 | +17 ajouts |
| Géographie | 32 | 41 | +9 ajouts, +1 correction |
| Éco & Social | 25 | 28 | +4 ajouts, 1 item reclassé (Formation sociale → Formation économique), 1 suppression, 4 corrections |
| ECA | 9 | 98 | restructuration complète (4 domaines officiels) |
| **Total (7 matières traitées)** | **412** | **579** | |

FMTTN (70 items), EPS (4), Langues modernes (4) et EPC/CPC (4) restent inchangés pour l'instant. Une fois ces modifications appliquées, le sélecteur du Semainier proposera exactement les mêmes attendus, à jour du référentiel FWB, que l'onglet Programme P5-P6.
