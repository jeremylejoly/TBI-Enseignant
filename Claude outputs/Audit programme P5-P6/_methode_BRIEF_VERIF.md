# Brief — Double lecture indépendante (vérification) d'un audit

Tu es le **second lecteur**. Un premier agent a produit, pour une discipline, (1) un inventaire des attendus
officiels P5/P6 du référentiel FWB et (2) un audit item par item de la checklist TBI. Ton rôle est de
contrôler ce travail **à partir du texte officiel**, pas de le réécrire. Tu dois être critique : on te paie
pour trouver ce qui a été oublié ou mal jugé. Mais tu ne contestes qu'en citant le texte (page + extrait).

Contexte et conventions : lis d'abord /home/claude/audit/BRIEF_AUDIT.md (fichiers, structure des
référentiels, statuts). Fichiers du premier lecteur : /home/claude/audit/rapports/<DISC>_inventaire*.md et
/home/claude/audit/rapports/<DISC>_audit.md.

## Étape A — Contrôle d'exhaustivité de l'inventaire
1. AVANT d'ouvrir l'inventaire du premier lecteur, lis toi-même intégralement les sections 5e PRIMAIRE et
   6e PRIMAIRE de ton référentiel (plages de lignes dans le prompt) et dresse ta propre liste brute des
   attendus (une ligne par phrase d'attendu, avec page). Compte-les par année et par bloc
   (Savoirs / Savoir-faire / Compétences).
2. Ensuite seulement, ouvre l'inventaire du premier lecteur et compare : attendus absents de l'inventaire,
   attendus en trop (texte introductif, contenu de colonne gauche, repère ou recommandation pris pour un
   attendu), libellés tronqués ou déformés (surtout limites chiffrées, listes, exemples « Ex. : »),
   pages fausses, années fausses. Liste chaque écart avec citation.

## Étape B — Contrôle des statuts de l'audit
1. Pour CHAQUE item dont le statut n'est pas EXACT ou FIDELE (IMPRECIS, FUSION, ANNEE_ERRONEE, DOUBLON,
   CECP_SEULEMENT, HORS_REFERENTIEL, MAL_CLASSE) : relis l'item TBI et l'attendu cité ; confirme ou
   conteste le statut et la correction proposée. Pour HORS_REFERENTIEL / CECP_SEULEMENT, refais toi-même un
   grep (3 formulations différentes) dans le référentiel avant de confirmer.
2. Pour les items EXACT / FIDELE : vérifie-les TOUS si la discipline a ≤ 100 items ; sinon vérifie au moins
   un item sur deux (prends les numéros pairs). Cherche en particulier les statuts trop indulgents : un
   « FIDELE » qui perd une limite chiffrée, un exemple obligatoire, un niveau d'autonomie (« avec l'aide de
   l'enseignant », « parmi ceux proposés », « de manière autonome »), ou qui mélange P5 et P6.
3. Vérifie la section MANQUANTS : chaque attendu dit manquant est-il vraiment absent du TBI (cherche par
   mots-clés dans programme_TBI_extrait.md) ? Et inversement, y a-t-il des attendus couverts par aucun item
   que le premier lecteur a oubliés de déclarer manquants ?

## Livrable : /home/claude/audit/rapports/<DISC>_verification.md
1. Verdict global en 5 lignes (inventaire fiable ? audit fiable ? points à corriger).
2. Tableau « Écarts d'inventaire » : | Type d'écart | ID ou page | Détail | Citation |
3. Tableau « Statuts contestés » : | # item | Statut 1er lecteur | Statut proposé | Justification (citation) |
4. Tableau « Statuts confirmés » : liste des # vérifiés et confirmés (juste les numéros).
5. « Manquants » : corrections à la liste des manquants (à ajouter / à retirer).
6. Ce que tu n'as pas pu vérifier.
Message final à l'orchestrateur : 12 lignes max (chemin du fichier, nombre d'écarts d'inventaire, nombre de
statuts contestés / confirmés, les 3 à 5 désaccords les plus importants).

Règles : français ; ne modifie jamais les fichiers du premier lecteur ni les sources ; précision > vitesse.
