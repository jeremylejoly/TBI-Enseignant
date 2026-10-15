# Vérification (second lecteur) — FMTTN P5/P6

Fichiers contrôlés : `/home/claude/audit/rapports/FMTTN_inventaire.md` et `/home/claude/audit/rapports/FMTTN_audit.md`.
Sources relues intégralement : `sources/ref_FMTTN.txt` lignes 1775-2010 (5e primaire, pp. 45-50) et 2011-2329 (6e primaire, pp. 51-57), plus pp. 37, 43, 44, 63, 73, 86 et le tableau de progression (p. 21-22 du PDF, lignes 746-760) pour la question « Informations et données ». Items TBI : `programme_TBI_extrait.md` lignes 631-742 (84 items recomptés).

## 1. Verdict global

1. **Inventaire fiable.** Ma lecture indépendante donne exactement 49 attendus P5 (14 S / 24 SF / 11 C) et 58 attendus P6 (18 S / 30 SF / 10 C), mêmes pages, mêmes libellés (limites, listes, « Ex. : », niveaux d'autonomie conservés). Aucun attendu oublié, aucun élément de colonne gauche ou de texte introductif pris pour un attendu. Seules 2 précisions mineures (tableau 2), aucune erreur.
2. **Affirmation structurante confirmée** : le référentiel n'a **aucune** section « Informations et données » en P5 (pp. 46-50 : Habitat, Techniques de culture, Contenus communs, Communication et collaboration, Création de contenus) ni en P6 (pp. 52-57 : Alimentation, Matières et matériaux, Objets technologiques, Contenus communs, Création de contenus, Sécurité). Le champ existe en P3 (p. 37), P4 (p. 43), S1 (p. 63) et S2 (p. 73) — soit exactement les 4 croix du tableau de progression (lignes 757, 1784, 2020) — et la p. 86 (ligne 3594) le confirme : « Rechercher une information au moyen d'un outil de recherche imposé … (C, P3-P4-S2) ». Le CECP P6 lui-même renvoie une recherche documentaire à « FMTTN-P4 » (CECP_P6.txt ligne 27813) et le CECP P5 à « FMTTN-P3 » / « FMTTN-P4 » (CECP_P5.txt lignes 26850, 68891). **Les 4 ANNEE_ERRONEE (#1-4) sont confirmés.**
3. **Audit globalement fiable** : 80 statuts confirmés sur 84 ; 0 HORS_REFERENTIEL / CECP_SEULEMENT à contester ; les 8 FUSION, 15 IMPRECIS et 7 MAL_CLASSE sont tous justifiés par le texte.
4. **4 statuts FIDELE trop indulgents** à passer en IMPRECIS (#36, #53, #58, #60) : trois d'entre eux effacent un niveau d'autonomie (« sous la supervision de l'enseignant », « choisi par l'enseignant »), ce que le brief désigne explicitement comme faute ; #58 est d'autant plus important que « sous la supervision » est la seule différence P5/P6 de tout le bloc Contenus communs (le premier lecteur le dit lui-même en commentaire, sans en tirer le statut).
5. **Section MANQUANTS exacte** (5 P5 + 6 P6 absents, 8 P6 couverts seulement par un item P5) : chaque absence vérifiée par grep dans le TBI, aucun oubli inverse.

## 2. Écarts d'inventaire

| Type d'écart | ID ou page | Détail | Citation |
|---|---|---|---|
| Précision (hors inventaire, tableau « Pour mémoire ») | p. 37 (P3) | Le tableau « Pour mémoire » ne cite que P4 et S2. Or le libellé de l'item TBI #1 est **mot pour mot l'attendu P3** (verbe « Sélectionner »), P4 disant « Déterminer » ; de même l'item #2 reprend la formulation P3 « Rechercher une information… » (P4 : « Rechercher un contenu… »). Ajouter une ligne P3 p. 37 pour tracer la source réelle. | p. 37 : « Sélectionner un ou plusieurs mot(s)-clé(s) pertinent(s) pour effectuer une recherche. » / « Rechercher une information au moyen d'un outil de recherche imposé, en utilisant une bibliothèque appropriée (images, vidéos…) et des mots-clés choisis collectivement. » |
| Convention de découpage (sans incidence) | FMTTN-P5-019 / P6-032 | « Choisir le matériel… Les agencer sur son poste de travail. » est compté comme un seul attendu (deux phrases). C'est le choix le plus naturel (une seule cellule), je l'adopte aussi ; à signaler seulement parce que le total 49/58 en dépend. | p. 48 : « Choisir le matériel* et les consommables* parmi ce qui est mis à disposition . Les agencer sur son poste de travail* . » |

Aucun attendu absent, aucun attendu en trop, aucune page ou année fausse, aucun libellé tronqué. Les « Δ vs P5 » vérifiés sont exacts (P6-034 « en autonomie », P6-038/039 disparition de « parmi ceux proposés par l'enseignant », P6-040 « deux applications/logiciels » en P4 p. 44 ligne 1749, P6-050 contenu sans « simple »).

## 3. Statuts contestés

| # item | Statut 1er lecteur | Statut proposé | Justification (citation) |
|---|---|---|---|
| 36 | FIDELE | IMPRECIS | P6-050 p. 56 : « **Traduire un logigramme** intégrant une boucle et une condition, en langage de programmation, le tester et le déboguer. » Le TBI (« Concevoir, tester et déboguer un programme intégrant boucle et condition ») perd le point de départ obligatoire (le logigramme à traduire) — exactement la perte pour laquelle le premier lecteur a classé #23 (P5-049, même structure) en IMPRECIS. Par cohérence, même statut. Correction : reprendre le libellé officiel. |
| 53 | FIDELE | IMPRECIS | P5-015 p. 47 : « Cultiver, **sous la supervision de l'enseignant**, un végétal **selon un mode de culture défini**, en tenant compte **du lieu** et des conditions de production (substrat, calendrier des semis, température, luminosité, hygrométrie). » Le TBI (« Cultiver un végétal (substrat, calendrier, température, luminosité, hygrométrie) ») efface le niveau d'autonomie et deux contraintes de la compétence. Le premier lecteur a sanctionné la même perte (« sous la supervision ») en #51. |
| 58 | FIDELE | IMPRECIS | P5-021 p. 48 : « Trier, **sous la supervision de l'enseignant**, **dans leur cadre de production**, les déchets recyclables, compostables, récupérables. » vs P6-034 p. 55 : « Trier, **en autonomie***, … ». Le TBI (« Trier les déchets : recyclables, compostables, récupérables ») supprime le niveau d'autonomie, qui est la seule différence P5/P6 de tout le bloc ; sans lui l'item ne peut servir ni pour P5 ni pour P6. Correction : item P5 « Trier, sous la supervision de l'enseignant, dans leur cadre de production, les déchets recyclables, compostables, récupérables » + item P6 avec « en autonomie ». |
| 60 | FIDELE | IMPRECIS | P6-004 p. 52 : « Nommer des aliments constitutifs d'un plat du terroir **ou du patrimoine, choisi par l'enseignant** ; les classer **par famille** : féculents **(sucres lents)**, sucres rapides, matières grasses. » Le TBI perd « choisi par l'enseignant » (niveau d'autonomie) et la précision « (sucres lents) » qui définit la famille ; le premier lecteur liste lui-même ces trois manques dans son commentaire. |

Corrections de commentaire sans changement de statut :

| # item | Statut (inchangé) | Correction du commentaire |
|---|---|---|
| 1 | ANNEE_ERRONEE | Le commentaire dit « Verbe « Déterminer », pas « Sélectionner » ». En réalité le libellé TBI est **exactement l'attendu P3** (p. 37 : « Sélectionner un ou plusieurs mot(s)-clé(s) pertinent(s) pour effectuer une recherche. ») ; P4 (p. 43) reformule avec « Déterminer ». Écrire « attendu P3 (p. 37) / P4 (p. 43) ». |
| 2 | ANNEE_ERRONEE | Le libellé TBI correspond à la formulation P3 (p. 37 : « Rechercher une information au moyen d'un outil de recherche imposé, en utilisant une bibliothèque appropriée (images, vidéos…) et des mots-clés choisis collectivement. ») autant qu'à P4 (« Rechercher un contenu … choisis individuellement »). Même conclusion : P3-P4-S2, rien en P5/P6. |
| 76 | EXACT | « une/des machine(s) simple(s) » ≠ « une ou plusieurs machine(s) simple(s) » (p. 54) : strictement FIDELE plutôt qu'EXACT ; sans conséquence. |
| 41 | EXACT | « de cyberattaque, de cyberharcèlement, de cybermanipulation » (p. 57) : répétition du « de » supprimée ; strictement FIDELE ; sans conséquence. |

Remarques sur des FIDELE conservés (à la limite, mais acceptés) : #19 perd « un extrait ou l'entièreté » (p. 50) ; #24, #37, #38, #50, #67, #68, #69 réduisent un attendu à verbe (« Expliquer les termes… », « Utiliser… le vocabulaire… », « Citer… », « Identifier… le nom… ») à une liste « Vocabulaire : … » — listes complètes, mais l'enseignant gagnerait à rétablir le verbe, surtout pour #24 où « Expliquer » (p. 56) est plus exigeant qu'« Utiliser » ; #56 supprime toute la liste de contextes « en lien avec l'environnement de travail, les consommables, les outils, les ustensiles, les machines et les techniques » (p. 48) alors que #55, qui n'en perd que deux, est IMPRECIS — cohérence discutable, mais l'attendu « Énoncer les équipements de protection requis » reste complet en soi.

## 4. Statuts confirmés

Vérifiés un par un contre le texte (84/84 relus) et confirmés tels quels : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 59, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84 (80 items).

Détail des contrôles spécifiques :
- #1-4 (ANNEE_ERRONEE) : vérifiés dans tout le référentiel (sections P5/P6 intégrales, tableau de progression p. 21-22, p. 86) et par grep dans CECP_P5/P6 (« mots-clés », « outil de recherche », « moteur de recherche », « opérateurs de recherche ») : aucune séquence CECP P5/P6 ne programme ces attendus pour P5/P6 ; les seules occurrences renvoient à FMTTN-P3/P4 ou aux tableaux synoptiques recopiés. Le libellé de #3 (« Déterminer des mots-clés et opérateurs adéquats… ») est bien la colonne *contenu* commune à P3 (p. 37), P4 (p. 43) et S2 (p. 73), et « opérateurs » n'apparaît comme attendu qu'en S2 (« Connaitre les opérateurs de recherche dont *, +, -, « », et, ou » ; « Utiliser un outil de recherche*, en utilisant des options avancées et des opérateurs »). #4 = compétence S2 p. 73 mot pour mot (« en autonomie* », « moteur de recherche pertinent »).
- FUSION #5, 6, 8, 13, 51, 57, 66, 70 : les deux attendus cités existent bien séparément (pp. 47, 48, 49, 50, 53, 54) ; scission justifiée.
- MAL_CLASSE #44, 77-82 : libellés vérifiés EXACT/FIDELE, badges corrects, sous-section erronée ; confirmés.
- IMPRECIS #9, 11, 15, 22, 23, 26, 42, 46, 47, 52, 54, 55, 61, 73, 75 : chaque élément dit perdu est bien dans le texte officiel ; les corrections proposées reprennent le libellé officiel ; confirmés. Pour #26, l'ajout « de manière autonome » est bien absent de P6-038 (p. 56 : « Sélectionner un outil, une application*, un logiciel*, en fonction de l'intention . »).

## 5. Manquants

- **À ajouter** : rien. Les 11 absents (P5-001, 009, 031, 040, 048 ; P6-001, 005, 022, 026, 039, 049) sont confirmés absents par grep dans `programme_TBI_extrait.md` (« quotidiennes ou professionnelles », « organique », « Interagir », « fonctions principales », « Concevoir un logigramme », « pâtisserie », « ustensile », « document technique » : 0 occurrence dans la section FMTTN). Les 8 attendus P6 « couverts seulement par un item P5 » (P6-002, 003, 030-035) sont exacts.
- **À retirer** : rien.
- Conséquence des contestations ci-dessus : si #58 reste tel quel, P6-034 n'est en réalité couvert par **aucun** item (le libellé TBI ne dit ni « sous la supervision » ni « en autonomie ») ; le premier lecteur le signale déjà en 3.3 (« #58 (libellé P5) »).

## 6. Ce que je n'ai pas pu vérifier

- Les codes CECP (FMTT88-138, N42-N91, « déduits » ou non) et les pages/titres de séquences CECP cités dans l'audit (pp. 680-870) : non recontrôlés un à un ; j'ai seulement vérifié par grep que les CECP P5/P6 ne programment pas la recherche d'information en P5/P6.
- Les trois symboles dessinés du logigramme (P5-034, p. 50) : seuls les libellés « Début et fin / Processus / Décision » subsistent dans l'extraction, comme l'indique le premier lecteur.
- Les tableaux synoptiques (`synop_*`) : non utilisés.
- Le découpage « une cellule = un attendu » pour P5-019/P6-032 (deux phrases) : convention partagée, non tranchée par le texte.
