// Logic for Horaire / Semainier FWB Tronc Commun — horaire.js

let scheduleZoom = 1.0;
try {
  let rawZoom = parseFloat(localStorage.getItem('tbi_schedule_zoom'));
  if (!isNaN(rawZoom) && rawZoom >= 0.5 && rawZoom <= 2.0) {
    scheduleZoom = rawZoom;
  }
} catch(e){}

// =========================================================================
// 1. BASE DE DONNÉES COMPLÈTE & OFFICIELLE FWB (P5 - P6)
// =========================================================================
const FWB_DATABASE = {
  "math": {
    "name": "Mathématiques",
    "icon": "📐",
    "color": "#2563eb",
    "bg": "#eff6ff",
    "border": "#3b82f6",
    "text": "#1d4ed8",
    "competencies": [
      {
        "id": "math_geo_rep",
        "name": "1.1 Géométrie — Repérage & déplacements (Plans, quadrillages, repères cardinaux)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Utiliser le vocabulaire des positions absolues et relatives (devant, derrière, droite, gauche, au-dessus, autour de...)"
          },
          {
            "cycle": "P5",
            "text": "Tracer sur un plan élaboré selon un quadrillage codé un itinéraire respectant au moins 4 points de repère"
          },
          {
            "cycle": "P5-P6",
            "text": "Se déplacer dans l'espace 3D en suivant un trajet donné sur un plan"
          },
          {
            "cycle": "P6",
            "text": "Verbaliser la position d'un objet ou un itinéraire en utilisant les 8 repères cardinaux"
          }
        ]
      },
      {
        "id": "math_geo_fig",
        "name": "1.2 Géométrie — Figures planes & Propriétés (Triangles, quadrilatères, cercles, polygones)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Identifier les quadrilatères : carré, rectangle, losange, parallélogramme, trapèze (isocèle, rectangle)"
          },
          {
            "cycle": "P5",
            "text": "Identifier les triangles : acutangle, rectangle, obtusangle, scalène, isocèle, équilatéral"
          },
          {
            "cycle": "P5",
            "text": "Identifier le cercle et ses composantes : centre, rayon, diamètre, corde"
          },
          {
            "cycle": "P5",
            "text": "Identifier angle aigu, droit, obtus et angles isométriques"
          },
          {
            "cycle": "P5",
            "text": "Énoncer les caractéristiques des côtés et angles des quadrilatères et triangles"
          },
          {
            "cycle": "P5",
            "text": "Symbolisme : A (point), a (droite), [AB] (segment), // (parallèles), ⊥ (perpendiculaires)"
          },
          {
            "cycle": "P6",
            "text": "Identifier les polygones réguliers : pentagone, hexagone, octogone, décagone"
          }
        ]
      },
      {
        "id": "math_geo_traces",
        "name": "1.3 Géométrie — Tracés de figures & Constructions (Triangles, quadrilatères, compas, latte/équerre)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Tracer un triangle à la latte et l'équerre (avec et sans contraintes, sur papier tramé et vierge)"
          },
          {
            "cycle": "P5",
            "text": "Tracer un quadrilatère à la latte et l'équerre (avec et sans contraintes, sur papier tramé et vierge)"
          },
          {
            "cycle": "P5",
            "text": "Tracer un losange inscrit dans un rectangle (et un rectangle à partir d'un losange)"
          },
          {
            "cycle": "P5",
            "text": "Tracer des droites perpendiculaires (⊥) et parallèles (//) à la latte et l'équerre"
          },
          {
            "cycle": "P5-P6",
            "text": "Tracer au compas un cercle, un triangle isocèle et un triangle équilatéral"
          },
          {
            "cycle": "P5-P6",
            "text": "Tracer une figure composée de figures travaillées suivant des consignes de construction"
          },
          {
            "cycle": "P5",
            "text": "Construire les polygones travaillés par découpage, pliage et matériel varié"
          },
          {
            "cycle": "P6",
            "text": "Tracer un triangle et un quadrilatère à la latte et l'équerre sur papier vierge"
          },
          {
            "cycle": "P6",
            "text": "Tracer un triangle équilatéral ou un hexagone régulier inscrit dans un cercle"
          }
        ]
      },
      {
        "id": "math_geo_droites",
        "name": "1.4 Géométrie — Droites remarquables (Médianes, diagonales, hauteurs, axes de symétrie)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Identifier hauteur, diagonale, médiane et axe de symétrie dans une figure plane"
          },
          {
            "cycle": "P5",
            "text": "Tracer axes de symétrie, médianes et diagonales d'un quadrilatère"
          },
          {
            "cycle": "P5",
            "text": "Énoncer les propriétés des diagonales et médianes du carré, rectangle, parallélogramme, losange"
          },
          {
            "cycle": "P5",
            "text": "Reconnaitre les quadrilatères pour lesquels les diagonales ou médianes sont axes de symétrie"
          },
          {
            "cycle": "P5",
            "text": "Tracer la hauteur d'un triangle, d'un parallélogramme et d'un trapèze"
          },
          {
            "cycle": "P5",
            "text": "Comparer les caractéristiques (côtés, angles, diagonales, médianes) de deux quadrilatères ou de deux triangles"
          }
        ]
      },
      {
        "id": "math_geo_sol",
        "name": "1.5 Géométrie — Solides & Développements (Polyèdres, prismes, pyramides)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Identifier polyèdre et non-polyèdre, cube, parallélépipède rectangle, cylindre, sphère, cône, pyramide, prisme"
          },
          {
            "cycle": "P5",
            "text": "Identifier les composantes des solides : faces, arêtes, sommets"
          },
          {
            "cycle": "P5",
            "text": "Énoncer les caractéristiques : nombre de faces, faces isométriques, parallèles ou perpendiculaires"
          },
          {
            "cycle": "P5",
            "text": "Construire prismes droits et pyramides avec matériel géométrique varié"
          },
          {
            "cycle": "P5",
            "text": "Tracer et identifier le développement du cube ou du parallélépipède rectangle"
          },
          {
            "cycle": "P5",
            "text": "Associer à un prisme droit un développement correct parmi plusieurs proposés"
          }
        ]
      },
      {
        "id": "math_geo_trans",
        "name": "1.6 Géométrie — Mouvements, Symétries, Frises & Agrandissements",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Identifier les 3 mouvements : glisser (translation), pivoter (rotation), retourner (symétrie axiale)"
          },
          {
            "cycle": "P5",
            "text": "Exécuter un mouvement précis d'un motif figuratif"
          },
          {
            "cycle": "P5",
            "text": "Tracer l'image d'une figure selon un axe de symétrie dans un quadrillage"
          },
          {
            "cycle": "P5",
            "text": "Tracer l'agrandissement (×2) ou la réduction (÷2) d'une figure"
          },
          {
            "cycle": "P5",
            "text": "Réaliser une production artistique géométrique (frises, pavages, rosaces)"
          },
          {
            "cycle": "P6",
            "text": "Tracer un assemblage de figures selon un axe de symétrie"
          }
        ]
      },
      {
        "id": "math_grand_mes",
        "name": "2.1 Grandeurs — Unités de mesure & Conversions (Longueurs, masses, capacités, volumes)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Vocabulaire : longueur, masse, capacité, coût, aire, volume"
          },
          {
            "cycle": "P5",
            "text": "Unités conventionnelles : symboliser et convertir (m, dm, cm, mm, km, kg, g, l, dl, cl, ml)"
          },
          {
            "cycle": "P5",
            "text": "Unités d'aire : m², dm², cm², mm² (symboliser, convertir)"
          },
          {
            "cycle": "P5",
            "text": "Unité de volume : cm³ (mesurer par remplissage ou comptage)"
          },
          {
            "cycle": "P5",
            "text": "Associer dm³, litre et kg pour l'eau (cas particulier)"
          },
          {
            "cycle": "P5",
            "text": "Préfixes : déci, centi, milli, kilo, hecto, déca"
          },
          {
            "cycle": "P6",
            "text": "Unités d'aire agraires : are (a), hectare (ha), centiare (ca)"
          },
          {
            "cycle": "P6",
            "text": "Unités de volume : m³, dm³, cm³, mm³ (symboliser, convertir)"
          }
        ]
      },
      {
        "id": "math_grand_durees",
        "name": "2.2 Grandeurs — Durées & Planification horaire",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Unités de durée : seconde, minute, heure, jour, semaine, mois, année, siècle, millénaire"
          },
          {
            "cycle": "P5",
            "text": "Déterminer et calculer une durée ≤ 1 heure (horloge, chronomètre, ligne du temps)"
          },
          {
            "cycle": "P6",
            "text": "Calculer des durées pouvant dépasser 1 heure (conversions h, min, s)"
          },
          {
            "cycle": "P6",
            "text": "Établir et planifier l'horaire d'une journée ou d'un projet"
          }
        ]
      },
      {
        "id": "math_grand_aire",
        "name": "2.3 Grandeurs — Aires, Périmètres & Volumes (Formules & calculs)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Calculer le périmètre de polygones variés"
          },
          {
            "cycle": "P5",
            "text": "Énoncer et appliquer la formule de l'aire du rectangle et du carré"
          },
          {
            "cycle": "P5",
            "text": "Déterminer et calculer l'aire d'un parallélogramme en lien avec l'aire d'un rectangle"
          },
          {
            "cycle": "P5",
            "text": "Énoncer la formule du volume du cube et parallélépipède rectangle (V = L × l × h)"
          },
          {
            "cycle": "P6",
            "text": "Déterminer et calculer l'aire d'un triangle en lien avec l'aire d'un rectangle (B × H ÷ 2)"
          },
          {
            "cycle": "P6",
            "text": "Déterminer et calculer l'aire d'un losange (D × d ÷ 2) et d'un trapèze ((B + b) × h ÷ 2)"
          },
          {
            "cycle": "P6",
            "text": "Calculer le volume du cube et du parallélépipède rectangle avec formule"
          }
        ]
      },
      {
        "id": "math_grand_frac",
        "name": "2.4 Grandeurs — Fractions & Pourcentages (Sens, calculs, équivalences)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Notions de numérateur et dénominateur (rôles et fractions ≥ 1)"
          },
          {
            "cycle": "P5",
            "text": "Établir l'équivalence et l'ordre entre fractions de même dénominateur ou numérateur"
          },
          {
            "cycle": "P5",
            "text": "Additionner des fractions de même dénominateur et simplifier"
          },
          {
            "cycle": "P5",
            "text": "Multiplier une fraction par un nombre entier et simplifier"
          },
          {
            "cycle": "P5",
            "text": "Calculer 10%, 20%, 25% et 50% d'une quantité"
          },
          {
            "cycle": "P6",
            "text": "Transformer une fraction en fraction équivalente (représentations variées)"
          },
          {
            "cycle": "P6",
            "text": "Calculer tout pourcentage d'une quantité en situation contextualisée"
          }
        ]
      },
      {
        "id": "math_grand_prop",
        "name": "2.5 Grandeurs — Proportionnalité directe, Échelles & Problèmes d'achats",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Reconnaître et compléter un tableau de proportionnalité directe et un graphe fléché"
          },
          {
            "cycle": "P5",
            "text": "Notion d'échelle (1/100, 1/50, 1/20) : calculer des distances réelles"
          },
          {
            "cycle": "P5",
            "text": "Problèmes d'achats : remises %, 1+1 gratuit, deuxième à moitié prix, bénéfice/perte"
          },
          {
            "cycle": "P5",
            "text": "Résoudre des problèmes de proportionnalité directe (vitesse, prix, quantités)"
          },
          {
            "cycle": "P6",
            "text": "Reconnaitre grandeurs proportionnelles depuis situations libellées en français"
          },
          {
            "cycle": "P6",
            "text": "Cartes et plans (1/100 000, 1/250 000) : calculer distances réelles"
          }
        ]
      },
      {
        "id": "math_nb_sens",
        "name": "4.1 Nombres — Numération, Décimaux & Droite numérique",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Nombres naturels jusqu'aux millions : lire, écrire, décomposer par rangs et classes"
          },
          {
            "cycle": "P5",
            "text": "Nombres décimaux jusqu'aux millièmes : lire, écrire, décomposer, comparer, ordonner"
          },
          {
            "cycle": "P5",
            "text": "Expliquer la présence du zéro dans un nombre naturel ou décimal"
          },
          {
            "cycle": "P5",
            "text": "Encadrer un nombre décimal au dixième près et placer sur droite numérique"
          },
          {
            "cycle": "P5",
            "text": "Compter par 0,1 ; 0,2 ; 0,5 ; 0,25 ; 0,125 jusqu'à 2 et compléter des régularités"
          },
          {
            "cycle": "P6",
            "text": "Nombres naturels jusqu'aux milliards : lire, écrire, décomposer"
          },
          {
            "cycle": "P6",
            "text": "Encadrer un nombre décimal au centième ou au millième près"
          }
        ]
      },
      {
        "id": "math_nb_calc_mental",
        "name": "4.2 Nombres — Calcul mental & réfléchi (Procédés, décompositions, tables)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Tables de multiplication jusqu'à 10 — restitution fluide et de mémoire"
          },
          {
            "cycle": "P5",
            "text": "Décompositions de 100 et décompositions de 1 (en dixièmes, termes et facteurs)"
          },
          {
            "cycle": "P5",
            "text": "Propriétés : commutativité et associativité de l'addition et de la multiplication"
          },
          {
            "cycle": "P5",
            "text": "Procédés de calcul mental : décomposition, distributivité, compensation"
          },
          {
            "cycle": "P5",
            "text": "Multiplications spécifiques : ×0,1 ; ×0,5 ; ×0,25 ; ×9 ; ×99 ; ×11 ; ×101 ; ×25"
          },
          {
            "cycle": "P5",
            "text": "Divisions spécifiques : ÷50 ; ÷25"
          },
          {
            "cycle": "P5",
            "text": "Estimer l'ordre de grandeur avant de calculer et vérifier la plausibilité"
          },
          {
            "cycle": "P6",
            "text": "Décompositions de 1 en centièmes et calcul mental : ×250, ÷0,1, ÷0,5, ÷0,25"
          }
        ]
      },
      {
        "id": "math_nb_calc_ecrit",
        "name": "4.3 Nombres — Calcul écrit & Algorithmes posés (Add, Soustr, Mult, Div)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Addition écrite : maximum 3 termes, décimaux jusqu'au millième"
          },
          {
            "cycle": "P5",
            "text": "Soustraction écrite : décimaux jusqu'au millième"
          },
          {
            "cycle": "P5",
            "text": "Multiplication écrite : multiplicateur maximum 2 chiffres (naturels)"
          },
          {
            "cycle": "P5",
            "text": "Division écrite : diviseur maximum 1 chiffre (naturels)"
          },
          {
            "cycle": "P5",
            "text": "Résoudre un problème à étapes (schéma → opérations → résultat → vérification)"
          },
          {
            "cycle": "P5",
            "text": "Rédiger un énoncé de problème à partir de calculs consécutifs"
          },
          {
            "cycle": "P6",
            "text": "Multiplication écrite décimale (produit limité à 2 chiffres après la virgule)"
          },
          {
            "cycle": "P6",
            "text": "Division écrite : diviseur naturel ≤ 20, quotient à 1 chiffre après la virgule"
          }
        ]
      },
      {
        "id": "math_data",
        "name": "3. Traitement des données & Logique déductive (Tableaux, diagrammes, arbres)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Vocabulaire : trier (selon un critère), classer (selon des caractéristiques)"
          },
          {
            "cycle": "P5",
            "text": "Représenter par tableau à double entrée ou ensembles (avec intersection)"
          },
          {
            "cycle": "P5",
            "text": "Représenter par arbre dichotomique ou diagramme à bandes (horizontales/verticales)"
          },
          {
            "cycle": "P5",
            "text": "Lire et interpréter un diagramme circulaire"
          },
          {
            "cycle": "P5",
            "text": "Résoudre des problèmes de logique déductive par tableau à double entrée croisé"
          },
          {
            "cycle": "P6",
            "text": "Représenter des données par arbre multichotomique (≥ 2 branches par nœud)"
          }
        ]
      }
    ]
  },
  "fr": {
    "name": "Français",
    "icon": "📖",
    "color": "#16a34a",
    "bg": "#f0fdf4",
    "border": "#22c55e",
    "text": "#15803d",
    "competencies": [
      {
        "id": "fr_conj_simples",
        "name": "1.1 Conjugaison — Temps simples de l'indicatif (Présent, futur, imparfait, passé simple, conditionnel, impératif)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Conjuguer à l'indicatif présent"
          },
          {
            "cycle": "P5",
            "text": "Conjuguer au futur simple et au futur proche"
          },
          {
            "cycle": "P5",
            "text": "Conjuguer à l'imparfait de l'indicatif"
          },
          {
            "cycle": "P5",
            "text": "Conjuguer au passé simple de l'indicatif"
          },
          {
            "cycle": "P5",
            "text": "Conjuguer au conditionnel présent"
          },
          {
            "cycle": "P5",
            "text": "Conjuguer à l'impératif présent"
          },
          {
            "cycle": "P5",
            "text": "Identifier et utiliser l'infinitif, participe présent et participe passé"
          }
        ]
      },
      {
        "id": "fr_conj_comp",
        "name": "1.2 Conjugaison — Temps composés & Morphologie verbale (PQP, futur ant., subjonctif, groupes)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Conjuguer au passé composé de l'indicatif"
          },
          {
            "cycle": "P5",
            "text": "Distinguer radical et terminaison pour les verbes en -ER (variations), -IR et irréguliers"
          },
          {
            "cycle": "P5",
            "text": "Verbes fréquents : avoir, être, aller, faire, dire, devoir, pouvoir, savoir, voir, vouloir, prendre, mettre, venir"
          },
          {
            "cycle": "P6",
            "text": "Conjuguer au plus-que-parfait de l'indicatif"
          },
          {
            "cycle": "P6",
            "text": "Conjuguer au futur antérieur et au conditionnel passé"
          },
          {
            "cycle": "P6",
            "text": "Repérer le mode subjonctif (le reconnaître en contexte)"
          }
        ]
      },
      {
        "id": "fr_conj_accord_pp",
        "name": "1.3 Conjugaison — Accords du participe passé (Employé seul, être, avoir)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Accorder le participe passé employé sans auxiliaire (accord avec le nom qualifié)"
          },
          {
            "cycle": "P5",
            "text": "Accorder le participe passé avec l'auxiliaire être (accord avec le sujet)"
          },
          {
            "cycle": "P5",
            "text": "Accorder le participe passé avec l'auxiliaire avoir (pas d'accord en règle générale)"
          },
          {
            "cycle": "P6",
            "text": "Consolidation et automatisation des procédures d'accord du participe passé"
          }
        ]
      },
      {
        "id": "fr_gram_phrase",
        "name": "2.1 Grammaire — Constituants & Fonctions dans la phrase (Sujet, prédicat, CC, CDV, CIV, attribut...)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Identifier les 3 constituants de la phrase : groupe sujet, groupe prédicat, groupe CC de phrase"
          },
          {
            "cycle": "P5",
            "text": "Identifier les fonctions : sujet, prédicat"
          },
          {
            "cycle": "P5",
            "text": "Identifier le complément circonstanciel (temps, lieu, manière...)"
          },
          {
            "cycle": "P5",
            "text": "Identifier le complément direct du verbe (CDV) et indirect (CIV)"
          },
          {
            "cycle": "P5",
            "text": "Identifier le complément du nom, l'épithète et l'attribut du sujet"
          },
          {
            "cycle": "P6",
            "text": "Manipulations syntaxiques : déplacement, effacement, remplacement, encadrement"
          }
        ]
      },
      {
        "id": "fr_gram_classes",
        "name": "2.2 Grammaire — Classes de mots & Terminologie grammaticale (Déterminants, pronoms, connecteurs...)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Identifier les déterminants : articles, possessifs, démonstratifs, cardinaux, indéfinis"
          },
          {
            "cycle": "P5",
            "text": "Identifier les pronoms : personnels, démonstratifs, possessifs, numéraux, indéfinis"
          },
          {
            "cycle": "P5",
            "text": "Identifier noms, adjectifs, verbes, adverbes et connecteurs"
          },
          {
            "cycle": "P5",
            "text": "Terminologie : mode, radical, terminaison, auxiliaire, anaphore, substitut, référent"
          }
        ]
      },
      {
        "id": "fr_gram_accords",
        "name": "2.3 Grammaire — Accords, Pluriels/Féminins & Ponctuation",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Accord du verbe avec son sujet (sujet inversé, éloigné, sujet multiple)"
          },
          {
            "cycle": "P5",
            "text": "Accord des déterminants et adjectifs en genre et en nombre dans le groupe nominal"
          },
          {
            "cycle": "P5",
            "text": "Règles particulières et exceptions du pluriel et du féminin des noms et adjectifs"
          },
          {
            "cycle": "P5",
            "text": "Formation régulière et particulière des adverbes en -ment"
          },
          {
            "cycle": "P5",
            "text": "Utiliser une procédure de raisonnement grammatical (-é/-er, a/à, son/sont, on/ont...)"
          },
          {
            "cycle": "P5",
            "text": "Utiliser toutes les marques de ponctuation (. , ; : ? ! « » -) dans une production"
          }
        ]
      },
      {
        "id": "fr_ortho_lex",
        "name": "3. Orthographe lexicale, Vocabulaire & Morphologie des mots",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Familles de mots, racines, préfixes, dérivation et composition"
          },
          {
            "cycle": "P5",
            "text": "Règles de position : c et ç ; g et ge/gu ; s et ss ; m devant m, b, p"
          },
          {
            "cycle": "P5",
            "text": "Constantes orthographiques et lettres muettes déductibles par dérivation"
          },
          {
            "cycle": "P5",
            "text": "Relations sémantiques : synonymes, antonymes, homonymes, champ lexical, substituts"
          },
          {
            "cycle": "P6",
            "text": "Notion de suffixe et analyse des préfixes (in-, en-, re-, dé-)"
          },
          {
            "cycle": "P6",
            "text": "Lexique spécifique à une thématique ou à un champ disciplinaire"
          }
        ]
      },
      {
        "id": "fr_lect_fluence",
        "name": "4.1 Lecture — Fluence & Modalités (Lecture à voix haute, vitesse, expressivité)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Fluence : s'approcher des 120 mots lus correctement par minute"
          },
          {
            "cycle": "P5",
            "text": "Lecture détaillée, de survol, sélective ou intégrale selon l'objectif"
          },
          {
            "cycle": "P5",
            "text": "Principes de lecture à voix haute : respect de la ponctuation, liaisons, intonation, pauses"
          },
          {
            "cycle": "P6",
            "text": "Fluence : s'approcher des 130 mots lus correctement par minute avec expressivité"
          }
        ]
      },
      {
        "id": "fr_lect_comp",
        "name": "4.2 Lecture — Stratégies de compréhension, Inférences & Types de textes",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Se créer une représentation mentale du texte et formuler des hypothèses d'anticipation"
          },
          {
            "cycle": "P5",
            "text": "Prélever des informations explicites et élaborer des inférences (lire entre les lignes)"
          },
          {
            "cycle": "P5",
            "text": "Résumer un texte et percevoir son idée essentielle / sens global"
          },
          {
            "cycle": "P5",
            "text": "Relier le texte et les illustrations / schémas et exécuter un enchaînement de consignes"
          },
          {
            "cycle": "P5",
            "text": "Identifier les structures de textes : narrative, descriptive, explicative, argumentative, dialoguée"
          },
          {
            "cycle": "P6",
            "text": "Distinguer faits et opinions, identifier le point de vue de l'auteur (objectif/subjectif)"
          },
          {
            "cycle": "P6",
            "text": "Mener des recherches documentaires et exploiter un portefeuille de documents multiples"
          }
        ]
      },
      {
        "id": "fr_prod_ecrit",
        "name": "5. Production écrite — Planification, Rédaction & Révision",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Planifier : rassembler ses idées et les organiser par blocs de sens / paragraphes"
          },
          {
            "cycle": "P5",
            "text": "Utiliser des connecteurs logiques, d'opposition, de conséquence et de synthèse"
          },
          {
            "cycle": "P5",
            "text": "Assurer la reprise d'information par substituts lexicaux et grammaticaux"
          },
          {
            "cycle": "P5",
            "text": "Respecter la cohérence temporelle tout au long du texte"
          },
          {
            "cycle": "P5",
            "text": "Réviser et corriger son écrit avec une grille de relecture et des référentiels"
          },
          {
            "cycle": "P6",
            "text": "Produire des écrits autonomes contenant au moins 80% de formes correctes"
          }
        ]
      },
      {
        "id": "fr_oral",
        "name": "6. Expression orale, Écoute active & Culture littéraire",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Prise de parole préparée : se présenter, annoncer le plan, adapter volume, débit et regard"
          },
          {
            "cycle": "P5",
            "text": "Écoute active : respecter les tours de parole, reformuler et questionner"
          },
          {
            "cycle": "P5",
            "text": "Connaître des œuvres du patrimoine (contes, fables, légendes) et de littérature jeunesse"
          },
          {
            "cycle": "P5",
            "text": "Se construire une identité de lecteur (préférences, défis de lecture)"
          },
          {
            "cycle": "P6",
            "text": "Argumenter, débattre et justifier son point de vue dans une discussion réglée"
          }
        ]
      }
    ]
  },
  "sci": {
    "name": "Sciences & Éveil",
    "icon": "🔬",
    "color": "#0891b2",
    "bg": "#ecfeff",
    "border": "#06b6d4",
    "text": "#0e7490",
    "competencies": [
      {
        "id": "sci_demarche",
        "name": "1. Démarche d'investigation scientifique (Questionner, expérimenter, modéliser, valider)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Formuler une question scientifique correspondant au problème posé"
          },
          {
            "cycle": "P5",
            "text": "Émettre une hypothèse testable et la confronter à celles des autres"
          },
          {
            "cycle": "P5",
            "text": "Concevoir un protocole expérimental, choisir le matériel adapté et respecter la sécurité"
          },
          {
            "cycle": "P5",
            "text": "Utiliser l'instrument de mesure approprié et exprimer le résultat avec l'unité correcte"
          },
          {
            "cycle": "P5",
            "text": "Verbaliser, schématiser et interpréter les observations pour valider/invalider l'hypothèse"
          },
          {
            "cycle": "P5",
            "text": "Utiliser une représentation simplifiée (modèle) pour expliquer une réalité"
          },
          {
            "cycle": "P6",
            "text": "Répéter l'expérience, calculer une moyenne et confronter des données de sources variées"
          }
        ]
      },
      {
        "id": "sci_vivant_humain",
        "name": "2.1 Vivants — Corps humain & Reproduction (EVRAS)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Citer les étapes de la vie humaine : fécondation, naissance, croissance, mort"
          },
          {
            "cycle": "P5",
            "text": "Décrire les changements physiques et physiologiques de la puberté"
          },
          {
            "cycle": "P5",
            "text": "Légender les appareils reproducteurs masculin (pénis, testicules) et féminin (utérus, ovaires, vulve...)"
          },
          {
            "cycle": "P5",
            "text": "Identifier les fonctions des organes et expliquer la fécondation (spermatozoïde + ovule)"
          },
          {
            "cycle": "P6",
            "text": "Système respiratoire : situer les organes et décrire le rôle du diaphragme et les échanges gazeux"
          },
          {
            "cycle": "P6",
            "text": "Système digestif : situer les organes et expliquer l'absorption des nutriments dans l'intestin grêle"
          },
          {
            "cycle": "P6",
            "text": "Système circulatoire : rôle du cœur, des vaisseaux sanguins et transport des nutriments/gaz"
          },
          {
            "cycle": "P6",
            "text": "Mesurer le rythme cardiaque et ventilatoire avant et après effort physique"
          }
        ]
      },
      {
        "id": "sci_vivant_biodiv",
        "name": "2.2 Vivants — Reproduction des plantes & Classification phylogénétique",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Reproduction de la plante à fleurs : pollinisation → fécondation → fructification → germination"
          },
          {
            "cycle": "P5",
            "text": "Identifier les acteurs de la pollinisation (insectes, vent) et de la dissémination des graines"
          },
          {
            "cycle": "P5",
            "text": "Impact environnemental de la disparition des insectes pollinisateurs"
          },
          {
            "cycle": "P6",
            "text": "Notion d'espèce (vivants pouvant se reproduire et donner des descendants féconds)"
          },
          {
            "cycle": "P6",
            "text": "Classification phylogénétique : classer des espèces sous forme d'ensembles emboîtés selon attributs partagés"
          }
        ]
      },
      {
        "id": "sci_matiere",
        "name": "3. Matière — Mélanges, États & Transformations (Physiques vs Chimiques)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Distinguer mélanges homogènes et hétérogènes (sel/eau, eau/huile, filtration, dissolution)"
          },
          {
            "cycle": "P5",
            "text": "L'air est un mélange gazeux (diazote, dioxygène, dioxyde de carbone)"
          },
          {
            "cycle": "P5",
            "text": "Masse et volume : des objets de même volume peuvent avoir des masses différentes (1 dm³ d'eau = 1 kg)"
          },
          {
            "cycle": "P6",
            "text": "Phénomène physique : la nature de la matière se conserve (changements d'état de l'eau)"
          },
          {
            "cycle": "P6",
            "text": "Phénomène chimique : la matière se transforme (combustion, cuisson, oxydation)"
          },
          {
            "cycle": "P6",
            "text": "Triangle du feu et sécurité : proposer des moyens d'éteindre un feu"
          }
        ]
      },
      {
        "id": "sci_energie",
        "name": "4. Énergie — Astronomie, Électricité & Énergie thermique",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Système Soleil-Terre-Lune : rotation de la Terre (1 jour/nuit) et révolution autour du Soleil (1 an/saisons)"
          },
          {
            "cycle": "P5",
            "text": "Mouvement de la Lune autour de la Terre et modélisation scientifique"
          },
          {
            "cycle": "P5",
            "text": "Circuit électrique simple : fil, générateur, récepteur, interrupteur, circuit ouvert/fermé"
          },
          {
            "cycle": "P5",
            "text": "Distinguer matériaux isolants et conducteurs électriques"
          },
          {
            "cycle": "P6",
            "text": "Ressources d'énergie renouvelables et non-renouvelables pour se chauffer/se déplacer"
          },
          {
            "cycle": "P6",
            "text": "L'énergie thermique : transferts de chaleur, isolants et conducteurs thermiques"
          },
          {
            "cycle": "P6",
            "text": "Justifier des moyens pour limiter les pertes d'énergie thermique dans l'habitat"
          }
        ]
      }
    ]
  },
  "hist": {
    "name": "Histoire",
    "icon": "📜",
    "color": "#b45309",
    "bg": "#fffbeb",
    "border": "#f59e0b",
    "text": "#b45309",
    "competencies": [
      {
        "id": "hist_rep",
        "name": "1. Histoire — Repères temporels, Périodes & Ruptures majeures",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Nommer et ordonner les 5 périodes conventionnelles sur une frise graduée en siècles"
          },
          {
            "cycle": "P5",
            "text": "5 moments de rupture : Néolithique, Romanisation, Villes médiévales, Industrialisation, Après-Guerre"
          },
          {
            "cycle": "P5",
            "text": "Modes de production et cadre de vie : Paléolithique/Néolithique, villa romaine, seigneuries, usines XIXe"
          },
          {
            "cycle": "P5",
            "text": "Dater les faits marquants P5 : 5000 av. J.-C., 50 av. J.-C., XIe s., 1835 (chemin de fer), 1939-45"
          },
          {
            "cycle": "P6",
            "text": "Nommer ET DATER les transitions : 3500 av. J.-C. (écriture), 476, 1492, 1789, 1945"
          },
          {
            "cycle": "P6",
            "text": "4 ruptures diversité culturelle : Romanisation, Grandes migrations, Colonisations, Après 1945 (immigration)"
          },
          {
            "cycle": "P6",
            "text": "Savoirs culturels P6 : Charlemagne, Christophe Colomb, Catastrophe du Bois-du-Cazier"
          }
        ]
      },
      {
        "id": "hist_dem",
        "name": "2. Histoire — Démarche historique & Analyse de traces du passé",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Compléter une frise chronologique graduée en siècles (Ier s. av. J.-C. à nos jours)"
          },
          {
            "cycle": "P5",
            "text": "Lire une carte historique avec sa légende et identifier l'intention de l'auteur"
          },
          {
            "cycle": "P5",
            "text": "Comparer une réalité d'aujourd'hui avec une réalité du passé (continuités et changements)"
          },
          {
            "cycle": "P6",
            "text": "Compléter une frise graduée en millénaires (IVe millénaire av. J.-C. à aujourd'hui)"
          },
          {
            "cycle": "P6",
            "text": "Comparer deux documents iconographiques/textuels historiques pour relever ressemblances et différences"
          },
          {
            "cycle": "P6",
            "text": "Distinguer ce qu'on lit explicitement d'un document de ce qu'on peut en inférer"
          }
        ]
      }
    ]
  },
  "geo": {
    "name": "Géographie",
    "icon": "🗺️",
    "color": "#059669",
    "bg": "#ecfdf5",
    "border": "#10b981",
    "text": "#047857",
    "competencies": [
      {
        "id": "geo_bel",
        "name": "1. Géographie — Belgique & Europe (Repères spatiaux, provinces, relief, hydrographie)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Les 8 directions cardinales sur la rose des vents"
          },
          {
            "cycle": "P5",
            "text": "Situer 3 Régions belges, 3 Communautés, la frontière linguistique et les 10 provinces"
          },
          {
            "cycle": "P5",
            "text": "Situer les 4 pays limitrophes de la Belgique, la Mer du Nord et le Royaume-Uni"
          },
          {
            "cycle": "P5",
            "text": "Reliefs européens (Alpes, Pyrénées, Caucase) et hydrographie (fleuve, rivière, affluent, confluent...)"
          },
          {
            "cycle": "P5",
            "text": "Répartition de la population en Belgique (Sillon Sambre-et-Meuse, triangle Bruxelles-Gand-Anvers)"
          },
          {
            "cycle": "P5",
            "text": "Annoter un paysage (vue au sol vs vue aérienne) et calculer des distances réelles avec l'échelle graphique"
          }
        ]
      },
      {
        "id": "geo_monde",
        "name": "2. Géographie — Monde, Zones climatiques & Réchauffement climatique",
        "attendus": [
          {
            "cycle": "P6",
            "text": "Localiser les 6 continents et 5 océans sur un planisphère ou un globe terrestre"
          },
          {
            "cycle": "P6",
            "text": "Identifier l'équateur, les tropiques, les cercles polaires, les hémisphères et les pôles"
          },
          {
            "cycle": "P6",
            "text": "3 grandes zones thermiques mondiales (chaude, tempérée, polaire) et types de climats"
          },
          {
            "cycle": "P6",
            "text": "Répartition mondiale de la population et densité (influence du relief, climat et ressources)"
          },
          {
            "cycle": "P6",
            "text": "Réchauffement climatique : causes (activités humaines, gaz à effet de serre), conséquences et solutions"
          }
        ]
      }
    ]
  },
  "eco_soc": {
    "name": "Éco & Social",
    "icon": "💰",
    "color": "#7c3aed",
    "bg": "#f5f3ff",
    "border": "#8b5cf6",
    "text": "#6d28d9",
    "competencies": [
      {
        "id": "eco_ent",
        "name": "1. Économie — Besoins, Entreprises, Circuit économique & Budget",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Distinguer besoins fondamentaux/secondaires et biens/services marchands/non marchands"
          },
          {
            "cycle": "P5",
            "text": "Distinguer entreprise à but lucratif et sans but lucratif et identifier les facteurs de production"
          },
          {
            "cycle": "P5",
            "text": "Identifier les acteurs économiques (travailleurs, employeurs, usagers, État) et leurs intérêts"
          },
          {
            "cycle": "P5",
            "text": "Construire collectivement le schéma d'un premier circuit économique"
          },
          {
            "cycle": "P6",
            "text": "Consommation responsable : commerce équitable, circuits courts, seconde main, réparation, recyclage"
          },
          {
            "cycle": "P6",
            "text": "Gérer un budget : distinguer épargne, dépenses, crédit, moyens de paiement et rôle des banques"
          }
        ]
      },
      {
        "id": "soc_cit",
        "name": "2. Social — Travail, Citoyenneté & Interdépendance",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Illustrer les 3 formes de travail : rémunéré, domestique, bénévole"
          },
          {
            "cycle": "P5",
            "text": "Notions d'égalité / inégalité et de reconnaissance dans le monde du travail"
          },
          {
            "cycle": "P6",
            "text": "Comprendre que les choix individuels de consommation ont une influence sur autrui et sur la planète"
          },
          {
            "cycle": "P6",
            "text": "Notion d'interdépendance entre acteurs économiques et sociaux à l'échelle mondiale"
          }
        ]
      }
    ]
  },
  "fmttn": {
    "name": "FMTTN",
    "icon": "💻",
    "color": "#db2777",
    "bg": "#fdf2f8",
    "border": "#ec4899",
    "text": "#be185d",
    "competencies": [
      {
        "id": "fmttn_rech",
        "name": "1. FMTTN — Informations & Recherche documentaire en ligne",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Sélectionner des mots-clés pertinents pour effectuer une recherche documentaire"
          },
          {
            "cycle": "P6",
            "text": "Utiliser des opérateurs de recherche et évaluer la pertinence et fiabilité d'un site web"
          }
        ]
      },
      {
        "id": "fmttn_num",
        "name": "2. FMTTN — Création numérique, Communication & Sécurité",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Communication : utiliser un ENT, messagerie (destinataire, objet, corps, pièce jointe) et respecter la nétiquette"
          },
          {
            "cycle": "P5",
            "text": "Création : traitement de texte, tableur (encoder données et réaliser un graphique), son/vidéo"
          },
          {
            "cycle": "P5",
            "text": "Culture numérique : avatar, pseudonyme, e-réputation"
          },
          {
            "cycle": "P6",
            "text": "Concevoir un diaporama multimédia structuré pour soutenir un exposé oral"
          },
          {
            "cycle": "P6",
            "text": "Sécurité : créer un mot de passe robuste, reconnaître hameçonnage, spam, cyberharcèlement"
          }
        ]
      },
      {
        "id": "fmttn_algo",
        "name": "3. FMTTN — Algorithmique & Programmation (Logigrammes, blocs, boucles)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Lire et écrire un logigramme séquentiel de déplacement (début/fin, processus, décision)"
          },
          {
            "cycle": "P5",
            "text": "Programmer une suite d'instructions séquentielles par blocs (Scratch, robot)"
          },
          {
            "cycle": "P6",
            "text": "Identifier une suite d'opérations pouvant être remplacée par une boucle"
          },
          {
            "cycle": "P6",
            "text": "Programmer avec boucles et conditions (Si... Alors... Sinon)"
          }
        ]
      },
      {
        "id": "fmttn_technique",
        "name": "4. FMTTN — Manuel, Technique, Habitat, Culture & Alimentation",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Habitat : identifier les éléments apparents d'un espace scolaire et lire un plan d'architecte"
          },
          {
            "cycle": "P5",
            "text": "Techniques horticoles : substrat, semis, bouturage, tuteurage, calendrier cultural"
          },
          {
            "cycle": "P5",
            "text": "Sécurité au travail : risques liés aux outils et équipements de protection requis"
          },
          {
            "cycle": "P6",
            "text": "Alimentation : équilibre alimentaire, labels officiels (AB, AOC, AOP, IGP) et allergènes"
          },
          {
            "cycle": "P6",
            "text": "Machines simples (levier, roue, poulie, engrenage) : concevoir et fabriquer un objet technologique"
          }
        ]
      }
    ]
  },
  "eca": {
    "name": "Éducation culturelle & artistique (ECA)",
    "icon": "🎨",
    "color": "#9333ea",
    "bg": "#faf5ff",
    "border": "#a855f7",
    "text": "#7e22ce",
    "competencies": [
      {
        "id": "eca_arts",
        "name": "1. ECA — Arts plastiques & Visuels (Pratiques, techniques, œuvres)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Expérimenter différentes techniques plastiques : dessin, peinture, collage, modelage, assemblage"
          },
          {
            "cycle": "P5",
            "text": "Distinguer et combiner formes, matières, couleurs, contrastes et textures"
          },
          {
            "cycle": "P6",
            "text": "Réaliser un projet artistique personnel ou collectif exprimant une émotion ou une intention"
          },
          {
            "cycle": "P6",
            "text": "Analyser et commenter une œuvre d'art plastique en utilisant un vocabulaire descriptif approprié"
          }
        ]
      },
      {
        "id": "eca_musique",
        "name": "2. ECA — Éducation musicale & Pratique vocale",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Pratique vocale : chanter en chœur avec justesse, rythme et écoute des autres"
          },
          {
            "cycle": "P5",
            "text": "Écoute musicale : identifier tempo, nuances, timbres d'instruments et structures musicales"
          },
          {
            "cycle": "P6",
            "text": "Interpréter des chants contemporains ou traditionnels du patrimoine culturel belge et mondial"
          },
          {
            "cycle": "P6",
            "text": "Créer de courtes phrases rythmiques ou sonores avec instruments ou percussions corporelles"
          }
        ]
      }
    ]
  },
  "other": {
    "name": "Autres disciplines scolaires",
    "icon": "🏃",
    "color": "#475569",
    "bg": "#f8fafc",
    "border": "#94a3b8",
    "text": "#334155",
    "competencies": [
      {
        "id": "other_eps",
        "name": "Éducation physique & Motricité (GYM / Natation)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Développer l'endurance cardiovasculaire, l'équilibre et la coordination générale"
          },
          {
            "cycle": "P5",
            "text": "Respecter les règles du jeu collectif et coopérer sportivement avec ses pairs"
          },
          {
            "cycle": "P6",
            "text": "Pratiquer des activités gymniques, athlétiques et d'opposition avec fair-play et sécurité"
          }
        ]
      },
      {
        "id": "other_lang",
        "name": "Langues modernes (Allemand / Néerlandais / Anglais)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Comprendre et utiliser des expressions familières et les consignes courantes de classe"
          },
          {
            "cycle": "P5",
            "text": "Poser des questions simples et répondre sur des sujets familiers (se présenter, famille, météo...)"
          },
          {
            "cycle": "P6",
            "text": "Produire un message oral ou écrit simple et continu sur des activités quotidiennes"
          }
        ]
      },
      {
        "id": "other_cpc",
        "name": "Éducation à la philosophie et à la citoyenneté (EPC / CPC / Religion / Morale)",
        "attendus": [
          {
            "cycle": "P5",
            "text": "Questionner le vivre-ensemble, la liberté, la justice, les droits humains et la solidarité"
          },
          {
            "cycle": "P5",
            "text": "Identifier et respecter différentes traditions, croyances et visions du monde"
          },
          {
            "cycle": "P6",
            "text": "Participer activement à une discussion ou débat à visée philosophique et démocratique"
          }
        ]
      }
    ]
  }
};

// Fast lookup maps
const COMP_MAP = {};
Object.keys(FWB_DATABASE).forEach(subKey => {
  const sub = FWB_DATABASE[subKey];
  sub.competencies.forEach(comp => {
    COMP_MAP[comp.id] = {
      ...comp,
      subjectKey: subKey,
      subjectName: sub.name,
      subjectIcon: sub.icon,
      subjectBg: sub.bg,
      subjectBorder: sub.border,
      subjectText: sub.text
    };
  });
});

// =========================================================================
// 2. CONFIGURATION DE LA GRILLE & PÉRIODES
// =========================================================================
const DAYS = [
  { key: "lundi", label: "Lundi" },
  { key: "mardi", label: "Mardi" },
  { key: "mercredi", label: "Mercredi" },
  { key: "jeudi", label: "Jeudi" },
  { key: "vendredi", label: "Vendredi" }
];

const TIME_SLOTS = [
  { type: "course", label: "P1", time: "08h30 - 09h20" },
  { type: "course", label: "P2", time: "09h20 - 10h10" },
  { type: "recreation", label: "RÉCRÉATION", time: "10h10 - 10h25" },
  { type: "course", label: "P3", time: "10h25 - 11h15" },
  { type: "course", label: "P4", time: "11h15 - 12h05" },
  { type: "midi", label: "MIDI / REPAS", time: "12h05 - 13h20" },
  { type: "course", label: "P5", time: "13h20 - 14h10" },
  { type: "course", label: "P6", time: "14h10 - 15h00" },
  { type: "course", label: "P7", time: "15h00 - 15h25" }
];

// Global state
let tbiWeeks = [];
let activeWeekId = null;
let currentCycleFilter = "all";
let activeCellTarget = null; // { rIdx, cIdx, cellElement, textareaElement, isPreset }

function getStorageKey() {
  return "tbi_fwb_semainier_v8";
}

function createBlankGrid() {
  const grid = {};
  TIME_SLOTS.forEach((slot, rIdx) => {
    grid[rIdx] = {};
    DAYS.forEach((day, cIdx) => {
      if (slot.type === "course") {
        if (cIdx === 2 && rIdx >= 6) {
          // Mercredi après-midi libre
          grid[rIdx][cIdx] = { type: "disabled" };
        } else {
          grid[rIdx][cIdx] = {
            type: "course",
            activity: "",
            compId: "",
            attenduText: "",
            bg: "",
            textColor: ""
          };
        }
      } else {
        grid[rIdx][cIdx] = { type: slot.type };
      }
    });
  });
  return grid;
}

function loadWeeks() {
  const raw = localStorage.getItem(getStorageKey());
  if (raw) {
    try {
      tbiWeeks = JSON.parse(raw);
    } catch (e) {
      tbiWeeks = [];
    }
  }
  
  // Assurer la présence du modèle permanent
  let templateWeek = tbiWeeks.find(w => w.isTemplate);
  if (!templateWeek) {
    templateWeek = {
      id: "template_model",
      isTemplate: true,
      title: "Grille Modèle (Canevas de base)",
      created: new Date().toISOString(),
      grid: createBlankGrid()
    };
    tbiWeeks.unshift(templateWeek);
  }

  if (tbiWeeks.length === 1) {
    // Créer une première semaine de cours basée sur le modèle
    const firstWeek = {
      id: "week_" + Date.now(),
      isTemplate: false,
      title: "Semaine 1",
      created: new Date().toISOString(),
      grid: JSON.parse(JSON.stringify(templateWeek.grid))
    };
    tbiWeeks.push(firstWeek);
    activeWeekId = templateWeek.id;
    saveWeeks();
  } else {
    const savedActive = localStorage.getItem("tbi_active_week_id");
    if (savedActive && tbiWeeks.some(w => w.id === savedActive)) {
      activeWeekId = savedActive;
    } else {
      activeWeekId = tbiWeeks[0].id;
    }
  }
}

function saveWeeks() {
  localStorage.setItem(getStorageKey(), JSON.stringify(tbiWeeks));
  localStorage.setItem("tbi_active_week_id", activeWeekId);
}

function getActiveWeek() {
  return tbiWeeks.find(w => w.id === activeWeekId) || tbiWeeks[0];
}

function getTemplateWeek() {
  return tbiWeeks.find(w => w.isTemplate) || tbiWeeks[0];
}

function getNextMondayString() {
  let latestMonday = null;
  
  tbiWeeks.forEach(w => {
    if (!w.isTemplate && w.title && w.title.startsWith("Semaine du ")) {
      const dateStr = w.title.substring("Semaine du ".length).trim();
      const parts = dateStr.split('/');
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        let year = parseInt(parts[2], 10);
        if (year < 100) year += 2000;
        
        const monday = new Date(year, month, day);
        if (!isNaN(monday.getTime())) {
          if (!latestMonday || monday > latestMonday) {
            latestMonday = monday;
          }
        }
      }
    }
  });

  let newMonday;
  if (latestMonday) {
    newMonday = new Date(latestMonday);
    newMonday.setDate(latestMonday.getDate() + 7);
  } else {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilNextMonday = (8 - dayOfWeek) % 7 || 7;
    newMonday = new Date(today);
    newMonday.setDate(today.getDate() + daysUntilNextMonday);
  }
  
  const day = String(newMonday.getDate()).padStart(2, '0');
  const month = String(newMonday.getMonth() + 1).padStart(2, '0');
  const year = String(newMonday.getFullYear()).slice(-2);
  return `Semaine du ${day}/${month}/${year}`;
}

// =========================================================================
// 3. PALETTE DE COULEURS FLOTTANTE (SYSTÈME ÉPROUVÉ DE L'ANCIEN SEMAINIER)
// =========================================================================
function showCellFormatToolbar(cellElement, rIdx, cIdx, textareaElement, isPreset) {
  activeCellTarget = { rIdx, cIdx, cellElement, textareaElement, isPreset };
  
  const container = document.querySelector('.horaire-container') || document.getElementById('screen-horaire');
  if (!container) return;

  let toolbar = document.getElementById('horaire-format-toolbar');
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.id = 'horaire-format-toolbar';
    toolbar.className = 'absolute bg-white border-2 border-neutral-900 p-2.5 rounded-2xl shadow-[4px_4px_0_rgba(0,0,0,1)] z-50 flex flex-col gap-2 no-print';
    container.appendChild(toolbar);
  }

  toolbar.innerHTML = `
    <div class="flex flex-col gap-1 select-none">
      <div class="flex items-center justify-between">
        <span class="text-[9px] font-display font-black text-neutral-500 uppercase tracking-wider text-left">Couleur de fond</span>
        <button class="text-neutral-400 hover:text-neutral-900 text-xs font-bold px-1" onclick="hideCellFormatToolbar()" title="Fermer">✕</button>
      </div>
      <div class="flex gap-1.5 flex-wrap">
        <button data-bg="" class="w-6 h-6 rounded-full border border-neutral-300 bg-white flex items-center justify-center text-[10px] font-bold text-neutral-500 hover:scale-110 active:scale-95 transition cursor-pointer" title="Blanc / Défaut">✕</button>
        <button data-bg="#E0E7FF" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #E0E7FF" title="Bleu pastel"></button>
        <button data-bg="#D1FAE5" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #D1FAE5" title="Vert pastel"></button>
        <button data-bg="#FEF3C7" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #FEF3C7" title="Jaune pastel"></button>
        <button data-bg="#FFE4E6" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #FFE4E6" title="Rouge/Rose pastel"></button>
        <button data-bg="#F5F3FF" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #F5F3FF" title="Violet pastel"></button>
        <button data-bg="#CFFAFE" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #CFFAFE" title="Cyan pastel"></button>
        <button data-bg="#FFEDD5" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition cursor-pointer" style="background-color: #FFEDD5" title="Orange pastel"></button>
      </div>
    </div>
    <div class="flex flex-col gap-1 select-none border-t border-neutral-200 pt-1.5">
      <span class="text-[9px] font-display font-black text-neutral-500 uppercase tracking-wider text-left">Couleur du texte ("Ce que je fais")</span>
      <div class="flex gap-1.5 flex-wrap">
        <button data-color="#1E293B" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition flex items-center justify-center bg-[#1E293B] cursor-pointer" title="Noir / Défaut"></button>
        <button data-color="#1D4ED8" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#1D4ED8] cursor-pointer" title="Bleu"></button>
        <button data-color="#15803D" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#15803D] cursor-pointer" title="Vert"></button>
        <button data-color="#B45309" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#B45309] cursor-pointer" title="Orange/Marron"></button>
        <button data-color="#BE123C" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#BE123C] cursor-pointer" title="Rouge"></button>
        <button data-color="#6D28D9" class="w-6 h-6 rounded-full border-2 border-neutral-900 hover:scale-110 active:scale-95 transition bg-[#6D28D9] cursor-pointer" title="Violet"></button>
        <button data-color="" class="w-6 h-6 rounded-full border border-neutral-300 hover:scale-110 active:scale-95 transition bg-white flex items-center justify-center cursor-pointer text-[10px] text-neutral-500 font-bold" title="Réinitialiser">↺</button>
      </div>
    </div>
  `;

  // Événements boutons de fond
  toolbar.querySelectorAll('button[data-bg]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyCellBg(btn.dataset.bg);
    });
  });

  // Événements boutons de couleur texte
  toolbar.querySelectorAll('button[data-color]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyCellTextColor(btn.dataset.color);
    });
  });

  // Affichage et mesure
  toolbar.style.display = 'flex';

  const rect = cellElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const toolbarHeight = toolbar.offsetHeight || 135;
  const toolbarWidth = toolbar.offsetWidth || 235;

  let top = rect.top - containerRect.top + container.scrollTop - toolbarHeight - 8;
  let left = rect.left - containerRect.left + container.scrollLeft + (rect.width - toolbarWidth) / 2;

  // Si ça dépasse en haut, afficher en dessous de la cellule
  if (rect.top - containerRect.top - toolbarHeight - 8 < 0) {
    top = rect.bottom - containerRect.top + container.scrollTop + 8;
  }

  // Limites de débordement
  if (left < 10) left = 10;
  if (left + toolbarWidth > container.scrollWidth - 10) {
    left = Math.max(10, container.scrollWidth - toolbarWidth - 10);
  }

  toolbar.style.top = `${Math.round(top)}px`;
  toolbar.style.left = `${Math.round(left)}px`;
  toolbar.style.position = 'absolute';
}

function hideCellFormatToolbar() {
  const toolbar = document.getElementById('horaire-format-toolbar');
  if (toolbar) {
    toolbar.style.display = 'none';
  }
  activeCellTarget = null;
}

function applyCellBg(bg) {
  if (!activeCellTarget) return;
  const currentWeek = getActiveWeek();
  const cell = currentWeek.grid[activeCellTarget.rIdx][activeCellTarget.cIdx];
  cell.bg = bg;
  if (activeCellTarget.cellElement) {
    activeCellTarget.cellElement.style.backgroundColor = bg || '';
  }
  saveWeeks();
}

function applyCellTextColor(textColor) {
  if (!activeCellTarget) return;
  const currentWeek = getActiveWeek();
  const cell = currentWeek.grid[activeCellTarget.rIdx][activeCellTarget.cIdx];
  cell.textColor = textColor;
  if (activeCellTarget.textareaElement) {
    activeCellTarget.textareaElement.style.color = textColor || '';
  } else if (activeCellTarget.cellElement) {
    activeCellTarget.cellElement.style.color = textColor || '';
  }
  saveWeeks();
}

// Clic global pour fermer la barre
document.addEventListener('pointerdown', (e) => {
  const toolbar = document.getElementById('horaire-format-toolbar');
  if (toolbar && toolbar.style.display !== 'none') {
    if (!toolbar.contains(e.target) && !e.target.closest('.color-trigger-btn')) {
      hideCellFormatToolbar();
    }
  }
});

// =========================================================================
// 4. RENDU DU SEMAINIER (2 SELECTS + COULEURS DE FOND & TEXTE)
// =========================================================================
function renderWeekSelector() {
  const select = document.getElementById("week-select");
  if (!select) return;
  select.innerHTML = "";

  const templateWeek = getTemplateWeek();
  const normalWeeks = tbiWeeks.filter(w => !w.isTemplate);

  // 1. Groupe Modèle permanent
  const grpModel = document.createElement("optgroup");
  grpModel.label = "⭐ Canevas permanent";
  const optModel = document.createElement("option");
  optModel.value = templateWeek.id;
  optModel.textContent = "📋 " + templateWeek.title;
  if (templateWeek.id === activeWeekId) optModel.selected = true;
  grpModel.appendChild(optModel);
  select.appendChild(grpModel);

  // 2. Groupe Semaines normales
  const grpWeeks = document.createElement("optgroup");
  grpWeeks.label = "📅 Mes Semaines de cours (" + normalWeeks.length + ")";
  normalWeeks.forEach(w => {
    const opt = document.createElement("option");
    opt.value = w.id;
    opt.textContent = "🗓️ " + w.title;
    if (w.id === activeWeekId) opt.selected = true;
    grpWeeks.appendChild(opt);
  });
  select.appendChild(grpWeeks);
}

function selectWeek(weekId) {
  activeWeekId = weekId;
  hideCellFormatToolbar();
  saveWeeks();
  renderWeekSelector();
  renderScheduleTable();
}

function setCycleFilter(cycle) {
  currentCycleFilter = cycle;
  const pAll = document.getElementById("pill-all");
  const pP5 = document.getElementById("pill-p5");
  const pP6 = document.getElementById("pill-p6");
  if (pAll) pAll.classList.toggle("active", cycle === "all");
  if (pP5) pP5.classList.toggle("active", cycle === "P5");
  if (pP6) pP6.classList.toggle("active", cycle === "P6");
  renderScheduleTable();
}

function renderScheduleTable() {
  const container = document.getElementById("schedule-table-container");
  if (!container) return;

  const currentWeek = getActiveWeek();
  
  let html = `
    <table class="schedule-table" id="schedule-table">
      <thead>
        <tr>
          <th class="col-time">Heures</th>
          <th>Lundi</th>
          <th>Mardi</th>
          <th>Mercredi</th>
          <th>Jeudi</th>
          <th>Vendredi</th>
        </tr>
      </thead>
      <tbody id="schedule-tbody">
      </tbody>
    </table>
  `;
  container.innerHTML = html;
  
  const tbody = document.getElementById("schedule-tbody");

  TIME_SLOTS.forEach((slot, rIdx) => {
    const tr = document.createElement("tr");
    if (slot.type === "recreation" || slot.type === "midi") {
      tr.className = "row-special";
    }

    // Colonne Heures
    const timeTd = document.createElement("td");
    timeTd.className = `time-header-cell ${slot.type}`;
    if (slot.type === "recreation" || slot.type === "midi") {
      timeTd.innerHTML = `<span class="period-time" style="font-size:10px;">${slot.time}</span>`;
    } else {
      timeTd.innerHTML = `
        <span class="period-idx">${slot.label}</span>
        <span class="period-time">${slot.time}</span>
      `;
    }
    tr.appendChild(timeTd);

    if (slot.type === "recreation" || slot.type === "midi") {
      const specTd = document.createElement("td");
      specTd.colSpan = 5;
      specTd.className = `special-row ${slot.type}`;
      specTd.textContent = slot.label;
      tr.appendChild(specTd);
    } else {
      DAYS.forEach((day, cIdx) => {
        const td = document.createElement("td");
        const cellData = (currentWeek.grid[rIdx] && currentWeek.grid[rIdx][cIdx]) || { 
          type: "course", activity: "", compId: "", attenduText: "", bg: "", textColor: "" 
        };

        if (cellData.type === "disabled") {
          td.className = "disabled-slot";
          td.innerHTML = `<div style="text-align:center; padding:30px 0; color:#94a3b8; font-style:italic; font-size:11px;">Après-midi libre</div>`;
        } else if (cellData.type === "preset") {
          const presetContainer = document.createElement("div");
          presetContainer.className = `preset-block ${cellData.presetType || ''}`;
          if (cellData.bg) presetContainer.style.backgroundColor = cellData.bg;
          if (cellData.textColor) presetContainer.style.color = cellData.textColor;
          presetContainer.style.position = "relative";

          const labelDiv = document.createElement("div");
          labelDiv.textContent = cellData.label || 'Fixe';

          const actionsDiv = document.createElement("div");
          actionsDiv.className = "preset-block-actions";

          const pColorBtn = document.createElement("button");
          pColorBtn.className = "preset-block-btn color-trigger-btn";
          pColorBtn.title = "Changer les couleurs";
          pColorBtn.textContent = "🎨";
          
          pColorBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showCellFormatToolbar(presetContainer, rIdx, cIdx, null, true);
          });

          const pEditBtn = document.createElement("button");
          pEditBtn.className = "preset-block-btn";
          pEditBtn.title = "Convertir en période FWB";
          pEditBtn.textContent = "✏️ Éditer";
          pEditBtn.addEventListener("click", () => {
            convertToCourseSlot(rIdx, cIdx);
          });

          actionsDiv.appendChild(pColorBtn);
          actionsDiv.appendChild(pEditBtn);
          presetContainer.appendChild(actionsDiv);
          presetContainer.appendChild(labelDiv);
          td.appendChild(presetContainer);
        } else {
          td.appendChild(createDirectSelectCellElement(rIdx, cIdx, cellData));
        }

        tr.appendChild(td);
      });
    }

    tbody.appendChild(tr);
  });
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

function createDirectSelectCellElement(rIdx, cIdx, cellData) {
  const container = document.createElement("div");
  container.className = "period-cell";

  // Apply custom background color if set
  if (cellData.bg) {
    container.style.backgroundColor = cellData.bg;
  }

  // 1. Zone de texte libre (avec couleur de texte personnalisée)
  const textarea = document.createElement("textarea");
  textarea.className = "period-activity-input";
  textarea.placeholder = "Ce que je fais (titre, activités, manuel...)";
  textarea.value = cellData.activity || "";
  if (cellData.textColor) {
    textarea.style.color = cellData.textColor;
  }
  textarea.addEventListener("input", (e) => {
    cellData.activity = e.target.value;
    saveWeeks();
  });
  container.appendChild(textarea);

  // Group des 2 menus déroulants
  const dropdownGroup = document.createElement("div");
  dropdownGroup.className = "dropdown-group";

  // 2. Menu déroulant 1 : Compétence travaillée
  const compSelect = document.createElement("select");
  compSelect.className = "fwb-select comp-select";
  compSelect.title = "Sélectionnez la compétence travaillée";

  const defaultCompOpt = document.createElement("option");
  defaultCompOpt.value = "";
  defaultCompOpt.textContent = "🎯 1. Choisir compétence FWB...";
  compSelect.appendChild(defaultCompOpt);

  Object.keys(FWB_DATABASE).forEach(sKey => {
    const sub = FWB_DATABASE[sKey];
    const group = document.createElement("optgroup");
    group.label = `${sub.icon} ${sub.name}`;

    sub.competencies.forEach(comp => {
      const opt = document.createElement("option");
      opt.value = comp.id;
      opt.textContent = `${sub.icon} ${comp.name}`;
      if (cellData.compId === comp.id) {
        opt.selected = true;
      }
      group.appendChild(opt);
    });

    compSelect.appendChild(group);
  });

  dropdownGroup.appendChild(compSelect);

  // 3. Menu déroulant 2 : Attendu d'apprentissage travaillé
  const attenduSelect = document.createElement("select");
  attenduSelect.className = "fwb-select attendu-select";
  attenduSelect.title = "Sélectionnez l'attendu officiel FWB";

  function populateAttendus(compId, selectedAttenduText) {
    attenduSelect.innerHTML = "";
    const comp = COMP_MAP[compId];

    if (!comp) {
      attenduSelect.disabled = true;
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "— Choisissez d'abord une compétence —";
      attenduSelect.appendChild(opt);
      return;
    }

    attenduSelect.disabled = false;
    const defaultAttOpt = document.createElement("option");
    defaultAttOpt.value = "";
    defaultAttOpt.textContent = "📌 2. Choisir l'attendu d'apprentissage...";
    attenduSelect.appendChild(defaultAttOpt);

    const filtered = comp.attendus.filter(att => {
      if (currentCycleFilter === "all") return true;
      if (currentCycleFilter === "P5") return att.cycle === "P5" || att.cycle === "P5-P6";
      if (currentCycleFilter === "P6") return att.cycle === "P6" || att.cycle === "P5-P6";
      return true;
    });

    filtered.forEach(att => {
      const opt = document.createElement("option");
      opt.value = att.text;
      opt.textContent = `[${att.cycle}] ${att.text}`;
      if (selectedAttenduText === att.text) {
        opt.selected = true;
      }
      attenduSelect.appendChild(opt);
    });
  }

  // Initial population of attendus
  populateAttendus(cellData.compId, cellData.attenduText);

  // Event listener Compétence -> update attendus + auto theme color if default
  compSelect.addEventListener("change", (e) => {
    const selectedCompId = e.target.value;
    cellData.compId = selectedCompId;
    cellData.attenduText = "";

    const compInfo = COMP_MAP[selectedCompId];
    if (compInfo) {
      compSelect.style.borderLeftColor = compInfo.subjectBorder;
      if (!cellData.bg) {
        container.style.backgroundColor = compInfo.subjectBg;
        cellData.bg = compInfo.subjectBg;
      }
    } else {
      compSelect.style.borderLeftColor = "#94a3b8";
    }

    populateAttendus(selectedCompId, "");
    saveWeeks();
  });

  // Event listener Attendu
  attenduSelect.addEventListener("change", (e) => {
    cellData.attenduText = e.target.value;
    saveWeeks();
  });

  dropdownGroup.appendChild(attenduSelect);
  container.appendChild(dropdownGroup);

  // 4. Footer actions de la cellule
  const footer = document.createElement("div");
  footer.className = "cell-footer";

  const actionGroup = document.createElement("div");
  actionGroup.className = "cell-action-group";

  // Bouton Palette Couleurs (Exact comme dans l'ancien semainier)
  const colorBtn = document.createElement("button");
  colorBtn.className = "cell-btn color-trigger-btn";
  colorBtn.title = "Personnaliser la couleur du cadre et de l'écriture";
  colorBtn.innerHTML = "🎨 Couleurs";
  
  colorBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showCellFormatToolbar(container, rIdx, cIdx, textarea, false);
  });
  actionGroup.appendChild(colorBtn);

  // Bouton Bloc Fixe
  const fixBtn = document.createElement("button");
  fixBtn.className = "cell-btn";
  fixBtn.title = "Transformer en cours fixe (Allemand, Gym...)";
  fixBtn.innerHTML = "📌 Fixe";
  fixBtn.addEventListener("click", () => {
    promptSetPreset(rIdx, cIdx);
  });
  actionGroup.appendChild(fixBtn);

  // Bouton Vider
  const clearBtn = document.createElement("button");
  clearBtn.className = "cell-btn clear-btn";
  clearBtn.title = "Vider la période";
  clearBtn.innerHTML = "🗑️";
  clearBtn.addEventListener("click", () => {
    clearCourseCell(rIdx, cIdx);
  });
  actionGroup.appendChild(clearBtn);

  footer.appendChild(actionGroup);
  container.appendChild(footer);

  return container;
}

// =========================================================================
// 5. GESTION DES CELLULES & PRESETS
// =========================================================================
function clearCourseCell(rIdx, cIdx) {
  const currentWeek = getActiveWeek();
  currentWeek.grid[rIdx][cIdx] = {
    type: "course",
    activity: "",
    compId: "",
    attenduText: "",
    bg: "",
    textColor: ""
  };
  saveWeeks();
  renderScheduleTable();
}

function convertToCourseSlot(rIdx, cIdx) {
  clearCourseCell(rIdx, cIdx);
}

function promptSetPreset(rIdx, cIdx) {
  const label = prompt("Intitulé du bloc fixe (ex : Allemand, GYM, Natation, Sortie) :");
  if (label && label.trim()) {
    const currentWeek = getActiveWeek();
    currentWeek.grid[rIdx][cIdx] = {
      type: "preset",
      presetType: "libre",
      label: label.trim(),
      bg: "#F1F5F9",
      textColor: "#334155"
    };
    saveWeeks();
    renderScheduleTable();
  }
}

// =========================================================================
// 6. GESTION DES SEMAINES (Créer depuis Modèle, Dupliquer, Renommer, Supprimer)
// =========================================================================
function handleAddNewWeek() {
  const suggestedTitle = getNextMondayString();
  const title = prompt("Titre de la nouvelle semaine (créée à partir du modèle) :", suggestedTitle);
  if (!title || !title.trim()) return;

  const template = getTemplateWeek();
  const newWeek = {
    id: "week_" + Date.now(),
    isTemplate: false,
    title: title.trim(),
    created: new Date().toISOString(),
    grid: JSON.parse(JSON.stringify(template.grid))
  };

  tbiWeeks.push(newWeek);
  activeWeekId = newWeek.id;
  saveWeeks();
  renderWeekSelector();
  renderScheduleTable();
}

function handleDuplicateWeek() {
  const cur = getActiveWeek();
  const title = prompt("Titre de la copie :", cur.title + " (Copie)");
  if (!title || !title.trim()) return;

  const newWeek = JSON.parse(JSON.stringify(cur));
  newWeek.id = "week_" + Date.now();
  newWeek.isTemplate = false;
  newWeek.title = title.trim();
  newWeek.created = new Date().toISOString();

  tbiWeeks.push(newWeek);
  activeWeekId = newWeek.id;
  saveWeeks();
  renderWeekSelector();
  renderScheduleTable();
}

function handleRenameWeek() {
  const cur = getActiveWeek();
  const title = prompt("Nouveau nom pour cette semaine :", cur.title);
  if (!title || !title.trim()) return;

  cur.title = title.trim();
  saveWeeks();
  renderWeekSelector();
}

function handleDeleteWeek() {
  const cur = getActiveWeek();
  if (cur.isTemplate) {
    alert("⚠️ La Grille Modèle ne peut pas être supprimée car elle sert de canevas de base permanent pour générer toutes vos nouvelles semaines.");
    return;
  }
  
  if (confirm(`Voulez-vous vraiment supprimer "${cur.title}" ?`)) {
    tbiWeeks = tbiWeeks.filter(w => w.id !== activeWeekId);
    activeWeekId = tbiWeeks[0].id;
    saveWeeks();
    renderWeekSelector();
    renderScheduleTable();
  }
}

// =========================================================================
// 7. ZOOM & INITIALISATION
// =========================================================================
function zoomSchedule(delta) {
  if (delta === 0) {
    scheduleZoom = 1.0;
  } else {
    scheduleZoom = Math.round((scheduleZoom + delta) * 10) / 10;
    if (scheduleZoom < 0.6) scheduleZoom = 0.6;
    if (scheduleZoom > 1.6) scheduleZoom = 1.6;
  }
  
  document.documentElement.style.setProperty('--schedule-zoom', scheduleZoom);
  localStorage.setItem('tbi_schedule_zoom', scheduleZoom);
  
  const label = document.getElementById('schedule-zoom-label');
  if (label) {
    label.innerText = Math.round(scheduleZoom * 100) + '%';
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.setProperty('--schedule-zoom', scheduleZoom);
  const label = document.getElementById('schedule-zoom-label');
  if (label) {
    label.innerText = Math.round(scheduleZoom * 100) + '%';
  }
  
  loadWeeks();
  renderWeekSelector();
  renderScheduleTable();
});
