# ECO — Vérification (second lecteur) de l'inventaire et de l'audit « Formation économique et sociale » P5-P6

Sources relues intégralement : `sources/ref_FHGES.txt` lignes 6245-6343 (5e PRIMAIRE, p. 125-126) et 6344-6451 (6e PRIMAIRE, p. 127-128) ; items TBI `programme_TBI_extrait.md` lignes 593-630 (28 items). Fichiers contrôlés : `rapports/ECO_inventaire.md`, `rapports/ECO_audit.md`. Greps de contrôle effectués dans `ref_FHGES.txt`, `CECP_P6.txt` et `CECP_P5.txt`.

## 1. Verdict global

1. **Inventaire fiable** : ma propre liste brute (dressée avant ouverture de l'inventaire) donne 11 attendus P5 (6 Savoirs form. économique + 2 Savoirs form. sociale + 1 Savoir-faire + 2 Compétences) et 10 attendus P6 (5 + 1 + 2 + 2) ; l'inventaire du premier lecteur contient exactement ces 21 attendus, libellés exacts (y compris « sociaux environnementaux » sans « et », les « ex. : », « celui (ou ceux) qui relève(nt) »), pages exactes (126 / 128), années exactes. Aucun écart de fond.
2. **Audit fiable** : les 28 statuts sont confirmés ; aucun EXACT/FIDELE trop indulgent (vérification de tous les items), aucune erreur d'année.
3. L'affirmation « 6 items reprennent le texte introductif Enjeux / Démarche (p. 125/127) » est **exacte** : #14, #16, #17 (pour « alternatifs »), #24, #25, #26 sont tous retrouvés mot pour mot dans le texte introductif p. 127 (l. 6350-6367) et nulle part dans la colonne Attendus de la p. 128. Les deux HORS_REFERENTIEL (#24, #25) sont confirmés par grep (3 formulations chacun, référentiel + CECP P6).
4. La citation du CECP P6 (« la banque en tant qu'acteur du circuit économique ne doit toutefois pas faire l'objet d'une évaluation ») est **exacte et bien située p. 1036** (l. 101371-101372 ; copie p. 1037).
5. Points à corriger (mineurs) : une incohérence de décompte dans la synthèse de l'audit (ECO-P5-007 compté comme couvert par un item EXACT/FIDELE alors que #19 est IMPRECIS, et absent de la table des attendus « à réécrire ») ; un libellé de statut discutable mais non contesté (#9, FIDELE limite : perte de « fournis »).

## 2. Écarts d'inventaire

| Type d'écart | ID ou page | Détail | Citation |
|---|---|---|---|
| Aucun écart d'exhaustivité | p. 126, p. 128 | 21/21 attendus présents, aucun attendu en trop, aucun contenu de colonne gauche ou texte introductif pris pour un attendu. | — |
| Aucun libellé tronqué ou déformé | ECO-P5-001 à ECO-P6-010 | Relecture mot à mot : les 21 libellés sont identiques au référentiel (listes à puces de ECO-P5-009 conservées avec « ; », exemples « ex. : » de ECO-P6-002, 004, 006 conservés). | Ex. ECO-P6-007, p. 128 : « En comparant des impacts économiques, sociaux environnementaux de différents modes de production et de consommation, justifier l'appartenance d'acteurs au commerce équitable » (l. 6423-6426) |
| Précision facultative (rattachement colonne gauche) | ECO-P6-007 / 008 | L'inventaire regroupe « Collecter et/ou extraire… » et « Analyser des informations… » comme contenu commun des deux savoir-faire ; le CECP P6 (p. 1008) rattache « Collecter et/ou extraire » à FES28 (= ECO-P6-007) et « Analyser des informations… » à FES29 (= ECO-P6-008). Sans incidence sur les attendus. | CECP P6 p. 1008 : « FES28 • Collecter et/ou extraire des informations économiques et sociales. • En comparant des impacts… » ; « FES29 • Analyser des informations à l'aide d'outils variés… • Identifier des impacts… » |
| Précision facultative (remarque P6) | ECO-P6-009 | La remarque « aucun attendu repris entre P5 et P6 » est juste ; à noter toutefois que « Formuler un avis argumenté sur une question économique et sociale, en s'appuyant sur les concepts abordés » figure déjà en **3e primaire** (p. 123, l. 6100-6102). Pas une erreur (la colonne Δ ne concerne que P5). | ref_FHGES l. 6100-6102 (section 3e PRIMAIRE, l. 5995-6119) |

## 3. Statuts contestés

| # item | Statut 1er lecteur | Statut proposé | Justification (citation) |
|---|---|---|---|
| — | — | — | Aucun statut contesté. Deux statuts sont confirmés « en limite » (voir § 4) : #9 (FIDELE) et #26 (CECP_SEULEMENT). |

Détail des cas limites (confirmés, mais à connaître) :

- **#9** « Identifier parmi des exemples concrets ceux qui relèvent du commerce équitable » (FIDELE). Le référentiel dit « Parmi un ensemble d'exemples concrets **fournis**, identifier celui (ou ceux) qui relève(nt) **des principes** du commerce équitable » (p. 128, l. 6396-6398). « Fournis » est un indice de niveau d'aide (exemples donnés à l'élève) ; il est implicitement conservé par « parmi des exemples », d'où FIDELE maintenu. Recommander de reprendre le libellé officiel.
- **#26** « Ressources naturelles et énergétiques non infinies et inégalement réparties » (CECP_SEULEMENT). Grep référentiel « ressources naturelles » / « infinies » / « également réparties » : uniquement l. 6350-6351 (texte introductif p. 127) et glossaire géographique p. 103 (l. 5320). Grep CECP P6 : « ressources naturelles et énergétiques » p. 1010 (mise en contexte : « l'utilisation rationnelle des ressources naturelles et énergétiques… », l. 99112) et p. 1030 (« ne pas gaspiller les ressources naturelles », l. 100964-100965) ; « ni infinies » / « également réparties » : 0. Statut conforme à la définition du brief (présent dans le CECP), mais la présence n'est qu'une toile de fond, jamais un attendu visé : la recommandation du premier lecteur (supprimer ou fondre dans #15 = ECO-P6-008) est la bonne.
- **#21** « Notions d'égalité/inégalité dans le monde du travail » (IMPRECIS) : grep « égalité|inégalit » dans la partie P5/P6 : l. 6254 et 6262 (texte introductif p. 125), l. 6312 (colonne Contenu « Égalité/Inégalité . », p. 126) ; aucune occurrence dans la colonne Attendus. Le statut IMPRECIS (contenu sans attendu) est cohérent avec le traitement de #3/#13 (DOUBLON), la différence étant que pour #3/#13 les notions sont mobilisées par des attendus déjà présents dans le TBI, ce qui n'est pas le cas ici. Confirmé.

## 4. Statuts confirmés

Tous les items ont été vérifiés (28 ≤ 100).

- EXACT confirmés : #1, #11, #20.
- FIDELE confirmés : #2, #6, #7, #9 (limite), #10, #18, #23, #27, #28.
- IMPRECIS confirmés : #4, #5, #8, #12, #15, #16, #17, #19, #21, #22.
- DOUBLON confirmés : #3, #13.
- CECP_SEULEMENT confirmés : #14, #26 (limite).
- HORS_REFERENTIEL confirmés : #24, #25.

Contrôles spécifiques demandés :

| Affirmation du 1er lecteur | Résultat du contrôle | Citation |
|---|---|---|
| #14 vient du texte introductif p. 127 ; aucun attendu P6 sur le circuit économique | **Confirmé.** Grep « circuit économique » / « nouvel acteur » / « banque » : dans la partie P6, seulement l. 6352-6354 (intro p. 127), l. 6393 (contenu « différentes formes de banques (missions) ») et l. 6402 (attendu « Citer des missions d'une banque »). Le prochain attendu sur le circuit est en **S2** (p. 134, l. 6708). Séquence CECP P6 « Découvrir un nouvel acteur du circuit économique : la banque » p. 1034-1047 confirmée (titre l. 101256, activité 2 l. 101619 p. 1038). | ref p. 127 : « Le circuit économique élaboré en 5e primaire peut être enrichi en y intégrant ce nouvel acteur . » (l. 6353-6354) |
| CECP P6 p. 1036 : la banque comme acteur du circuit ne doit pas être évaluée | **Confirmé mot pour mot, p. 1036** (et copie p. 1037). | CECP P6 l. 101370-101372 : « Si les liens effectués entre le budget et le circuit économique permettent de donner du sens aux apprentissages, la banque en tant qu'acteur du circuit économique ne doit toutefois pas faire l'objet d'une évaluation. » |
| #16 « texte argumenté » = Démarche disciplinaire p. 127 | **Confirmé.** Grep « texte argumenté » dans le référentiel : l. 6367 (P6, Démarche), 6498 (S1), 6624 (S2), 6765 (S3) — toujours dans les paragraphes « Démarche disciplinaire », jamais dans une colonne Attendus. Dans CECP P6 : seulement p. 1410-1411 (copie du référentiel en fin de programme). | ref p. 127 : « Il communique ensuite les résultats de ses recherches sous la forme d'un texte argumenté ou d'un autre type de production . » (l. 6366-6368) |
| #17 « alternatifs » vient de l'intro p. 127 | **Confirmé.** Grep « alternatifs » : unique occurrence l. 6353 (intro). L'attendu p. 128 dit « Identifier des modes de financement participatif . » (l. 6405). | ref p. 127 : « …présentation des modes de financement alternatifs et participatifs. » |
| #24 HORS_REFERENTIEL | **Confirmé.** Grep « autrui » / « planète » / « influence sur » : l. 6360 (Enjeux p. 127) ; autres occurrences hors FES P5-P6 (l. 3524, 5401 géographie ; 6996 glossaire ; 7730, 7776 visées transversales p. 155-156). CECP P6 : « influence sur autrui » 0 ; « choix individuels » 0 ; « planète » seulement dans des supports d'élèves (p. 1014, 1026, 1044). | ref p. 127 : « Il prend ainsi conscience que, d'une part, ses choix et ses actions ont une influence sur autrui et sur la planète… » (l. 6359-6361) |
| #25 HORS_REFERENTIEL | **Confirmé.** Grep « interdépendan » / « rapports sociaux » / « dépendance mutuelle » : l. 6357 (Enjeux p. 127), glossaire l. 7034 et 7107, visées transversales l. 7775 ; « Les rapports sociaux » est bien un contenu de **1re secondaire** (p. 130, l. 6531). CECP P6 : occurrences uniquement en sciences (p. 728-729, systèmes digestif/respiratoire) et p. 6-7 (introduction générale). | ref p. 127 : « Enjeux : en suscitant le questionnement sur les rapports sociaux (interdépendance), l'élève est amené à réfléchir… » (l. 6357) |
| #26 CECP_SEULEMENT | Confirmé (limite), voir § 3. | — |
| CECP P5 non vérifiable (extraction arrêtée p. 755, FHGES à partir de p. 787) | **Confirmé.** Dernier marqueur : « ===== PAGE 755 ===== » (l. 69150) ; table des matières l. 133 : « Formation historique, géographique, économique et sociale ……. 787 » ; grep codes FE/FS/FES et mots-clés (« but lucratif », « bénévole », « circuit économique », « services publics ») : 0. | — |

## 5. Manquants

- **À retirer** : rien. La conclusion « aucun attendu strictement manquant » est exacte : les 21 attendus sont chacun visés par au moins un item (P5 : 001→#1, 002→#2, 003→#4, 004→#5, 005→#6, 006→#7, 007→#19, 008→#20, 009→#22, 010→#8, 011→#23 ; P6 : 001→#9, 002→#10, 003→#11, 004→#12, 005→#17, 006→#27, 007→#18, 008→#15, 009→#16, 010→#28).
- **À ajouter** à la table « attendus couverts seulement par un item IMPRECIS, à réécrire » (section 3 de l'audit, P5) : **ECO-P5-007** « Illustrer différentes formes de travail (rémunéré, domestique, bénévole) » (p. 126), couvert uniquement par #19 (IMPRECIS : « les 3 formes »). Corriger en conséquence la synthèse § 1 de l'audit : P5 couverts par EXACT/FIDELE = **6** (001, 002, 005, 006, 008, 011), couverts seulement par IMPRECIS = **5** (003, 004, 007, 009, 010) ; total P5+P6 réécritures nécessaires = 9, non 8.

## 6. Ce que je n'ai pas pu vérifier

- Les séquences CECP **P5** de formation économique et sociale (p. 787-960 du programme) : absentes de l'extraction `CECP_P5.txt` (qui s'arrête p. 755). Les titres « Découvrir les différentes formes de travail et de reconnaissance » et « Organiser les liens entre les différents agents au sein d'un schéma simplifié du circuit économique » sont confirmés uniquement par les renvois du CECP P6 (p. 1010, l. 99106-99107 ; p. 1036, l. 101366-101367), pas par le texte P5 lui-même.
- La mise en page (colonnes gauche/droite) ne peut être vérifiée qu'à partir du texte extrait ; l'attribution « Collecter et/ou extraire » / « Analyser… » à l'un ou l'autre savoir-faire P6 repose sur le CECP P6, pas sur le PDF du référentiel.
