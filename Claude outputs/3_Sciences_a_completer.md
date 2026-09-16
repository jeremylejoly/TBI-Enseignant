# Programme P5-P6 — Sciences — Spécification de mise à jour (100 % référentiel FWB)

**Fichier à modifier :** `programme_P5_P6.html`
**Domaines concernés :** `domain-sci-inv`, `domain-sci-viv`, `domain-sci-mat`, `domain-sci-ene`
**Source officielle :** Référentiel de Sciences — Tronc commun FWB, sections « 5e primaire » et « 6e primaire »

## Note technique pour Antigravity

Aucun total codé en dur : insérer les nouveaux `<div class="item">` (gabarit ci-dessous) suffit.
```html
<div class="item" data-year="p5"><input type="checkbox"><label>TEXTE</label><span class="badge p5">P5</span></div>
```
Insérer chaque nouvel item juste avant la balise `</div>` qui ferme le domaine concerné.

Confirmation : aucun item existant de Sciences n'est hors-référentiel (le vocabulaire EVRAS et la classification phylogénétique sont bien des attendus officiels de ce référentiel) et aucune erreur d'année P5/P6 n'a été détectée — uniquement des ajouts ci-dessous.

---

## 1. Démarche d'investigation (`domain-sci-inv`) — 24 → 26 items

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Proposer des moyens d'investigation</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Utiliser des symboles pertinents pour représenter une situation expérimentale</label><span class="badge p5">P5</span></div>
```

---

## 2. Le vivant (`domain-sci-viv`) — 25 → 32 items

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Préciser le rôle respectif des deux sexes au cours de la reproduction sexuée (l'homme produit les spermatozoïdes, la femme les ovules)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Réaliser une représentation pour illustrer la fécondation (rencontre spermatozoïde/ovule)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier l'organe de la plante contenant la/les graine(s) comme étant le fruit provenant de la fleur fécondée</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier la fécondation chez les plantes comme la rencontre entre un grain de pollen et un ovule présent dans la plante</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Préciser que l'eau est absorbée au niveau du côlon</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Préciser que les matières non absorbées sont évacuées au niveau de l'anus</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Préciser que certains déchets sont évacués dans les urines, d'autres au niveau des poumons (dioxyde de carbone)</label><span class="badge p6">P6</span></div>
```

*(Note : ces ajouts complètent — sans les remplacer — les items existants sur la digestion et la reproduction, qui restent corrects mais incomplets sur ces points précis.)*

---

## 3. La matière (`domain-sci-mat`) — 10 → 12 items

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Préparer des mélanges de deux constituants</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Préciser que l'énergie chimique stockée dans la matière est transformée en énergie thermique lors de la combustion</label><span class="badge p6">P6</span></div>
```

---

## 4. Énergie (`domain-sci-ene`) — 17 → 21 items

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Préciser que le Soleil est une source de lumière, tandis que la Lune renvoie la lumière qu'elle reçoit du Soleil</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer s'il fait jour ou nuit à un endroit donné, en fonction des positions respectives de l'observateur et du Soleil</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Tester différents matériaux dans un circuit électrique simple, pour distinguer un isolant d'un conducteur</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Mettre en évidence expérimentalement comment empêcher un objet chaud de se refroidir, et inversement</label><span class="badge p6">P6</span></div>
```

---

## Récapitulatif

| Domaine | Avant | Ajouts | Après |
|---|---|---|---|
| Démarche d'investigation | 24 | +2 | 26 |
| Le vivant | 25 | +7 | 32 |
| La matière | 10 | +2 | 12 |
| Énergie | 17 | +4 | 21 |
| **Total Sciences** | **76** | **+15** | **91** |

Après ces modifications, le domaine Sciences sera conforme à 100 % au référentiel officiel FWB pour P5-P6.
