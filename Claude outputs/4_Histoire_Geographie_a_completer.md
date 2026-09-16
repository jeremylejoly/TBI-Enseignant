# Programme P5-P6 — Histoire & Géographie — Spécification de mise à jour (100 % référentiel FWB)

**Fichier à modifier :** `programme_P5_P6.html`
**Domaines concernés :** `domain-hist-hist`, `domain-hist-geo`
**Source officielle :** Référentiel FHGES (Formation historique, géographique, économique et sociale) — parties Formation historique et Formation géographique, Tronc commun FWB

## Note technique pour Antigravity

Aucun total codé en dur : insérer les nouveaux `<div class="item">` (gabarit ci-dessous) suffit.
```html
<div class="item" data-year="p5"><input type="checkbox"><label>TEXTE</label><span class="badge p5">P5</span></div>
```
Insérer chaque nouvel item juste avant la balise `</div>` qui ferme le domaine concerné. Aucune erreur de classement P5/P6 n'a été détectée sur les items existants.

---

## 1. Histoire (`domain-hist-hist`) — 30 → 43 items

### Items à ajouter — P5 (Moment clé « seigneuries et villes » + savoirs culturels + méthode)

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Exemplifier des obligations réciproques entre le seigneur et la communauté villageoise</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Exemplifier des droits acquis par la bourgeoisie (villes médiévales)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Savoir culturel : un∙e acteur∙rice du développement industriel au XIXe s. (ex. : John Cockerill, Antoinette Brepols…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Savoir culturel : patrimoine régional lié aux périodes étudiées (sites archéologiques, villes médiévales, quartiers industriels XIXe-XXe s., Atomium, 1er mai…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Sélectionner l'outil d'information adéquat en fonction de la recherche menée (dictionnaire, atlas, corpus documentaire, moteur de recherche…)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Relever des informations explicites dans une trace du passé ou un document reconstitué, en lien avec un repère temporel</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Identifier l'auteur, la date et le lieu de réalisation d'un document grâce à sa référence</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Justifier la pertinence d'un document donné en lien avec une problématique historique</label><span class="badge p5">P5</span></div>
```

### Items à ajouter — P6 (Moment clé « Après 1945 » + colonisation + méthode)

```html
<div class="item" data-year="p6"><input type="checkbox"><label>Identifier des apports culturels des migrations en Belgique de 1945 à nos jours</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer pourquoi la Belgique a officiellement demandé à d'autres pays de la main-d'œuvre ouvrière de 1945 à 1970</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer une facilité et un obstacle à l'intégration des migrants de 1945 à 1970</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Expliquer un impact des colonisations européennes du XVe au XVIIIe siècle sur les peuples colonisés</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Énoncer des produits de consommation originaires des régions colonisées entre le XVe et le XVIIIe siècle</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Savoir culturel : patrimoine régional — sites archéologiques et industriels, édifices religieux, artéfacts et objets d'art</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Identifier l'auteur, la date et le lieu de réalisation d'un document</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Sélectionner une information en recourant à une table des matières, à un index alphabétique ou à un moteur de recherche</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Justifier la pertinence ou la non-pertinence d'un document donné par rapport à une problématique liée à la multiculturalité</label><span class="badge p6">P6</span></div>
```

---

## 2. Géographie (`domain-hist-geo`) — 32 → 40 items

### Item existant à corriger (repère chiffré incomplet)

**Avant :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Répartition mondiale : ~7,9 milliards ; 60% en Asie, 10% en Europe ; 70% en ville</label><span class="badge p6">P6</span></div>
```
**Après :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Répartition mondiale : ~7,9 milliards ; 60% en Asie, 10% en Europe ; un peu plus de 20% à moins de 30 km des côtes ; 70% en ville</label><span class="badge p6">P6</span></div>
```

### Items à ajouter — P5

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Relever l'altitude d'un point sur une carte, un globe virtuel ou un géoportail</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer les variations d'altitude sur un profil du relief</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Situer une occupation/utilisation du sol en Belgique ou en Europe, en référence aux directions cardinales et à des repères</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Sur la base de représentations de l'espace actuelles et antérieures, identifier des transformations/permanences dans l'occupation du sol en Belgique</label><span class="badge p5">P5</span></div>
```

### Items à ajouter — P6

```html
<div class="item" data-year="p6"><input type="checkbox"><label>Annoter une carte pour mettre en évidence le nom des pays, les principaux parallèles et d'autres repères utiles pour situer un fait ou un phénomène</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Annoter une photographie verticale pour mettre en évidence un changement d'occupation du sol</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Situer en quelques mots des espaces plus ou moins peuplés à l'aide des repères connus ou identifiés sur une carte</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Situer un fait ou un phénomène à l'échelle d'un continent ou du monde, en référence à des repères, à la répartition de la population et aux zones thermiques</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Caractériser dans un espace des activités humaines relevant de la production, des transports ou de la consommation</label><span class="badge p6">P6</span></div>
```

---

## Récapitulatif

| Domaine | Avant | Ajouts | Après |
|---|---|---|---|
| Histoire | 30 | +17 | 47 |
| Géographie | 32 | +9 (+1 correction) | 41 |
| **Total Histoire & Géographie** | **62** | **+26** | **88** |

Après ces modifications, le domaine Histoire & Géographie sera conforme à 100 % au référentiel FHGES officiel pour P5-P6. Les savoirs factuels (dates, ruptures, acteurs, repères spatiaux, climat) étaient déjà très bien couverts ; l'essentiel des ajouts porte sur les compétences documentaires et cartographiques (méthode : identifier auteur/date/document, sélectionner une source, annoter une carte, situer un phénomène à l'échelle mondiale) ainsi que sur le bloc « migrations 1945-1970 » en P6.
