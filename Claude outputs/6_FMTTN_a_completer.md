# Programme P5-P6 — FMTTN — Spécification de mise à jour (100 % référentiel FWB)

**Fichier à modifier :** `programme_P5_P6.html`
**Domaines concernés :** `domain-fmttn-info`, `domain-fmttn-num`, `domain-fmttn-mtt`
**Source officielle :** Référentiel FMTTN (Formation Manuelle, Technique, Technologique et Numérique) — Tronc commun FWB

## Note technique pour Antigravity

Aucun total codé en dur : insérer les nouveaux `<div class="item">` (gabarit ci-dessous) suffit.
```html
<div class="item" data-year="p5"><input type="checkbox"><label>TEXTE</label><span class="badge p5">P5</span></div>
```

## ⚠️ Décision à prendre avant de traiter ce domaine : `fmttn-info`

Le référentiel officiel FMTTN ne comporte que **2 volets** : Volet 1 (Formation manuelle, technique et technologique) et Volet 2 (Numérique). Le sous-thème « Informations et données » (recherche par mots-clés, opérateurs de recherche) dont relève le domaine `fmttn-info` de l'app existe bien dans le référentiel, mais il est positionné en **P3-P4 et S1-S2** — **pas en P5-P6**. Il n'y a donc aucun attendu officiel P5/P6 auquel rattacher ou compléter ces 4 items.

Deux options, à trancher avant transmission à Antigravity :
- **Option A (recommandée) :** retirer le domaine `fmttn-info` du Programme P5-P6 (ces 4 items resteraient pertinents dans un futur programme P3-P4 s'il existe).
- **Option B :** conserver `fmttn-info`, mais renommer son intitulé pour préciser qu'il s'agit d'un rappel/consolidation d'un acquis de P3-P4, non d'un attendu P5-P6 (ex. « Information (rappel P3-P4) »).

*Dis-moi laquelle tu choisis — je n'ai pas modifié ce domaine dans les items ci-dessous en attendant ta décision.*

---

## 1. Numérique (`domain-fmttn-num`) — 39 → 41 items

### Item existant à corriger (vocabulaire incomplet)

**Avant :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Vocabulaire protection des données : sauvegarde, cookie, hameçonnage, spam, piratage, antivirus, mot de passe</label><span class="badge p6">P6</span></div>
```
**Après :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Vocabulaire protection des données : sauvegarde, mise à jour, cookie, hameçonnage, spam, piratage, cyberattaque, antivirus, mot de passe, authentification</label><span class="badge p6">P6</span></div>
```

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>S'intégrer au sein d'un espace collaboratif numérique, en respectant la cohérence (fond et forme) de l'environnement choisi</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Adopter un comportement responsable face à une situation de cyberattaque, cyberharcèlement, cyberdépendance</label><span class="badge p6">P6</span></div>
```

---

## 2. Manuel / technique / technologique (`domain-fmttn-mtt`) — 31 → 39 items

### Items à ajouter — communs P5/P6 (sécurité)

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Appliquer la posture ergonomique recommandée par l'enseignant</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Adopter, avec l'aide de l'enseignant, une attitude proactive tenant compte des risques et dangers pour soi et pour les autres, lors de la préparation du poste de travail et de l'exécution des gestes techniques, en recourant aux équipements de protection adéquats</label><span class="badge p5">P5</span></div>
```

### Items à ajouter — P5 (Habitat / Techniques de culture)

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Expliquer en quoi les aménagements proposés répondent aux besoins d'amélioration et tiennent compte des contraintes identifiées</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Aménager un lieu de production en vue de rencontrer les conditions de réussite d'un semis ou d'une plantation</label><span class="badge p5">P5</span></div>
```

### Items à ajouter — P6 (Alimentation)

```html
<div class="item" data-year="p6"><input type="checkbox"><label>Énoncer les précautions à prendre pour assurer la sécurité sanitaire des aliments au regard des risques encourus</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Citer des conditions de stockage et de conservation des préparations culinaires réalisées</label><span class="badge p6">P6</span></div>
```

### Items à ajouter — P6 (Matières et matériaux / Objets technologiques)

```html
<div class="item" data-year="p6"><input type="checkbox"><label>Réaliser un ouvrage en sélectionnant et en utilisant les outils, les consommables et les techniques proposés</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Énoncer un ou plusieurs usages courants de matériaux et de matières</label><span class="badge p6">P6</span></div>
```

---

## Récapitulatif

| Domaine | Avant | Ajouts | Après |
|---|---|---|---|
| Information | 4 | *(en attente de ta décision — voir ⚠️ ci-dessus)* | 4 (ou 0) |
| Numérique | 39 | +2 (+1 correction) | 41 |
| Manuel / technique / technologique | 31 | +8 | 39 |
| **Total FMTTN** | **74** | **+10 (hors fmttn-info)** | **84 (ou 80 si option A)** |

Une fois ta décision prise sur `fmttn-info` et les items ci-dessus intégrés, le domaine FMTTN sera conforme à 100 % au référentiel officiel FWB pour P5-P6.
