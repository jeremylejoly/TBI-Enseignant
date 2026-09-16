# Programme P5-P6 — Mathématiques — Spécification de mise à jour (100 % référentiel FWB)

**Fichier à modifier :** `programme_P5_P6.html`
**Domaines concernés :** `domain-math-geo`, `domain-math-grand`, `domain-math-nb`, `domain-math-data`
**Source officielle :** Référentiel de Mathématiques — Tronc commun FWB, sections « 5e primaire » et « 6e primaire »

## Note technique importante pour Antigravity

Les compteurs affichés dans l'app (`0/479`, `0/122`, barres de progression, `Tout réinitialiser`, `Tout décocher`, moteur de recherche…) sont **calculés dynamiquement en JavaScript** via `document.querySelectorAll('.item')` — il n'y a **aucun total codé en dur** à mettre à jour ailleurs dans le fichier. Il suffit d'insérer/modifier les `<div class="item">` listés ci-dessous ; tout le reste (compteurs, filtres P5/P6, recherche) se met à jour automatiquement.

Chaque nouvel item doit suivre exactement ce gabarit HTML (déjà utilisé partout dans le fichier) :
```html
<div class="item" data-year="p5"><input type="checkbox"><label>TEXTE DE L'ATTENDU</label><span class="badge p5">P5</span></div>
```
(remplacer `p5`/`P5` par `p6`/`P6` selon l'année). Insérer chaque nouvel item **juste avant la balise `</div>` qui ferme le domaine concerné** (à la fin de la liste d'items existante de ce domaine), sauf indication contraire.

---

## 1. Géométrie (`domain-math-geo`) — 33 → 37 items

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Utiliser le vocabulaire exprimant des positions ordinales : premier, deuxième, troisième… dernier ; au début, à la fin, avant, après</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier les éléments du plan : droite, segment de droite</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Reconnaitre les figures possibles correspondant aux faces d'un assemblage de maximum 3 cubes</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Reconnaitre les figures possibles correspondant aux faces d'un assemblage de maximum 5 cubes</label><span class="badge p6">P6</span></div>
```

### Bug à corriger (libellé dupliqué)

Le dernier item du domaine contient un préfixe « [P6] » en trop dans le texte du libellé (visible deux fois : dans le badge ET dans le label). À corriger :

**Avant :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>[P6] Tracer un assemblage de figures selon un axe de symétrie</label><span class="badge p6">P6</span></div>
```
**Après :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Tracer un assemblage de figures selon un axe de symétrie</label><span class="badge p6">P6</span></div>
```

---

## 2. Grandeurs (`domain-math-grand`) — 46 → 50 items

### Item existant à corriger (formule incomplète)

Le référentiel précise que la formule d'aire à énoncer en P5 couvre aussi le parallélogramme (l'app ne cite que rectangle/carré) :

**Avant :**
```html
<div class="item" data-year="p5"><input type="checkbox"><label>Énoncer la formule de l'aire du rectangle, du carré</label><span class="badge p5">P5</span></div>
```
**Après :**
```html
<div class="item" data-year="p5"><input type="checkbox"><label>Énoncer la formule de l'aire du rectangle, du carré et du parallélogramme</label><span class="badge p5">P5</span></div>
```

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Distinguer dans l'expression d'une grandeur mesurée : la grandeur, la mesure et l'unité de mesure</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Reconnaitre la grandeur « durée » dans des expressions courantes (ex : garantie, délai de livraison, période de soldes, date de péremption…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Énoncer les relations entre certaines unités conventionnelles de durées (ex : 1 seconde = 10 dixièmes de seconde = 100 centièmes de seconde)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Utiliser les relations entre les unités conventionnelles de durées</label><span class="badge p6">P6</span></div>
```

---

## 3. Nombres & calcul (`domain-math-nb`) — 34 → 37 items

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Décomposer et recomposer des nombres de trois à six chiffres en lien avec la numération décimale (valeur de position)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Décomposer un nombre en sa partie entière et sa partie non entière</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Reconnaitre les parenthèses comme symbole intervenant dans des procédures de calcul</label><span class="badge p5">P5</span></div>
```

---

## 4. Traitement des données (`domain-math-data`) — 9 items, inchangé

Aucun ajout : les 9 items couvrent déjà 100 % des attendus officiels P5 et P6 (vocabulaire, tableau double entrée, ensembles, arbres dichotomique/multichotomique, diagrammes, logique déductive).

---

## Récapitulatif

| Domaine | Avant | Ajouts | Après |
|---|---|---|---|
| Géométrie | 33 | +4 | 37 |
| Grandeurs | 46 | +4 (+1 correction) | 50 |
| Nombres & calcul | 34 | +3 | 37 |
| Traitement des données | 9 | +0 | 9 |
| **Total Mathématiques** | **122** | **+11** | **133** |

Après ces modifications, le domaine Mathématiques du Programme P5-P6 sera conforme à 100 % au référentiel officiel FWB (aucun attendu officiel P5/P6 restant non couvert, aucune erreur de classement, un bug d'affichage corrigé).
