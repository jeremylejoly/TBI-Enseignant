# Brief — Audit du programme P5-P6 du TBI contre les référentiels officiels FWB

## Contexte
Jérémy, instituteur en P5-P6 (enseignement officiel, FWB), a dans son application "TBI" une checklist
`programme_P5_P6.html` (663 attendus, badge P5 ou P6). Elle a été construite à partir des référentiels
du tronc commun FWB et du programme CECP P5. Il veut un audit **rigoureux, item par item, contre le texte
officiel**, avec traçabilité (page du référentiel). Le référentiel est LA référence (programme officiel) ;
les programmes CECP P5/P6 sont des "pistes" (séquences didactiques) qui référencent les attendus du
référentiel par un code (ex. F643, SC…, OEG…, GRV…, N…, ODS…, FMTT…, ECA…, DIS…, AA…, ECO…).

## Fichiers (tous dans /home/claude/audit/)
- `programme_TBI_extrait.md` : la checklist actuelle du TBI, en markdown
  (`## Discipline`, `### Sous-section`, `- [P5] libellé` / `- [P6] libellé`). C'est CE texte qu'on audite.
- `sources/ref_MATH.txt`, `sources/ref_FRANCAIS.txt`, `sources/ref_SCIENCES.txt`, `sources/ref_FHGES.txt`,
  `sources/ref_FMTTN.txt`, `sources/ref_ECA.txt` : texte intégral des référentiels, avec des marqueurs
  `===== PAGE n =====` (n = numéro de page PDF). Le texte extrait contient des tabulations parasites à
  la place d'espaces : ignore-les. Chaque référentiel est organisé par année ("5e PRIMAIRE", "6e PRIMAIRE"),
  puis par champ/section, puis par blocs "Savoirs — Attendus", "Savoir-faire — Attendus",
  "Compétences — Attendus". La colonne de gauche est le *contenu* (ex. "Les figures, leurs composantes…"),
  la colonne de droite les *attendus* (verbes à l'infinitif : Identifier…, Tracer…, Énoncer…).
  Les sections introductives "En 4e année… En 5e année… En 6e année…" sont du contexte, PAS des attendus.
- `sources/CECP_P5.txt`, `sources/CECP_P6.txt` : programmes CECP (très longs, 755 et 1432 pages ; beaucoup
  de pages sont dupliquées dans l'extraction). Les séquences didactiques y comportent un bloc
  "Contenus et attendus visés" listant les codes + libellés d'attendus du référentiel. À utiliser avec `grep`
  (Grep tool) de façon ciblée, pas en lecture intégrale.
- `sources/synop_*.txt` : tableaux synoptiques (colonnes perdues à l'extraction ; peu fiables, usage
  d'appoint seulement).

## Ta mission (pour TA discipline uniquement — voir le prompt)

### Étape 1 — Inventaire officiel exhaustif (fichier `rapports/<DISC>_inventaire.md`)
Lis **intégralement** les sections "5e PRIMAIRE" et "6e PRIMAIRE" de ton référentiel (plages de lignes
données dans le prompt) avec l'outil Read, par tranches. Pour CHAQUE attendu (chaque phrase à l'infinitif
dans la colonne "Attendus"), crée une ligne :

| ID | Année | Champ / section | Type | Contenu (col. gauche) | Attendu (libellé exact) | Page |

- ID = `<DISC>-P5-001`, `<DISC>-P5-002`… puis `<DISC>-P6-001`… dans l'ordre du référentiel.
- Type = Savoir / Savoir-faire / Compétence.
- Libellé **exact** du référentiel (nettoie seulement les tabulations/césures ; garde les listes à puces
  sur une ligne avec " ; " comme séparateur ; garde les exemples "Ex. :" et les limites chiffrées :
  "max 3 termes", "au moins quatre points de repère", etc. — ce sont justement les détails qui font la
  différence).
- Un attendu identique en P5 et en P6 figure deux fois (une par année). Si le libellé P6 diffère
  légèrement du P5, note la différence dans une colonne "Δ vs P5".
- Sois EXHAUSTIF : l'inventaire doit contenir 100 % des attendus. Compte-les à la fin et donne le total
  P5 / P6 / par champ. Vérifie-toi en relisant une seconde fois chaque page.

### Étape 2 — Audit item par item du TBI (fichier `rapports/<DISC>_audit.md`)
Pour CHAQUE item de ta discipline dans `programme_TBI_extrait.md` (reprends-les tous, dans l'ordre, avec
leur sous-section), une ligne :

| # | Sous-section TBI | Badge | Libellé TBI | ID(s) référentiel | Statut | Commentaire / correction proposée |

Statuts possibles (un seul, le plus grave) :
- `EXACT` : libellé fidèle au référentiel, bonne année.
- `FIDELE` : reformulé/abrégé mais sans perte ni déformation de sens, bonne année.
- `IMPRECIS` : la reformulation perd un élément du référentiel (une limite chiffrée, un exemple
  obligatoire, une partie de liste), ou ajoute un élément qui n'y est pas → proposer le libellé corrigé.
- `ANNEE_ERRONEE` : l'attendu existe mais pas pour cette année (ex. badge P5 alors que c'est P6, ou
  attendu P4/S1). Préciser la bonne année.
- `FUSION` : un item TBI couvre plusieurs attendus distincts du référentiel → lister les IDs ; dire
  s'il faut le scinder.
- `DOUBLON` : un autre item TBI couvre déjà exactement le même attendu (donner le #).
- `CECP_SEULEMENT` : introuvable dans le référentiel P5/P6 mais présent dans CECP P5 ou P6 (donne page
  et titre de séquence ; vérifie par grep).
- `HORS_REFERENTIEL` : introuvable dans le référentiel ET dans les CECP → à supprimer ou à justifier.
- `MAL_CLASSE` : n'utilise ce statut QUE si le reste est correct mais l'item est dans une sous-section
  qui ne correspond pas à son champ/thème ou à son année (ex. item P5 dans une sous-section "— P6").
  Sinon, signale le mauvais classement dans le commentaire en plus du statut principal.

Pour trancher, cite le texte officiel (ID + page). Ne te fie jamais à ta mémoire : si tu ne retrouves
pas l'attendu, grep le référentiel avec 2-3 mots-clés avant de conclure HORS_REFERENTIEL.

### Étape 3 — Attendus manquants (dans le même fichier `_audit.md`, section "MANQUANTS")
Liste tous les IDs de l'inventaire qu'AUCUN item TBI ne couvre (même partiellement), avec le libellé et
la page. Classe-les par champ/section et année.

### Étape 4 — Synthèse chiffrée (en tête de `_audit.md`)
- Nombre d'items TBI audités ; répartition par statut.
- Nombre d'attendus officiels P5 / P6 ; nombre couverts / manquants.
- Les 5 à 10 problèmes les plus importants pour l'enseignant (ex. erreurs d'année, seuils chiffrés faux).
- Proposition de structure de sous-sections alignée sur les champs/sections du référentiel.

## Règles
- Travaille en français. Écris les deux fichiers avec l'outil Write (écrase si besoin). Si un fichier
  devient très long, écris-le en plusieurs parties (`_inventaire_P5.md`, `_inventaire_P6.md`) et dis-le.
- Ne modifie JAMAIS `programme_TBI_extrait.md` ni les sources.
- Précision > vitesse. Un attendu oublié dans l'inventaire ou un statut EXACT donné à tort est une faute
  grave ; un doute se signale explicitement ("À VÉRIFIER : …").
- Ton message final (retourné à l'orchestrateur) : 15 lignes max — chemins des fichiers produits, totaux,
  les problèmes majeurs, et tout ce que tu n'as pas pu vérifier.
