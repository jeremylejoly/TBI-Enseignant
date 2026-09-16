# Programme P5-P6 — Éducation économique et sociale — Spécification de mise à jour (100 % référentiel FWB)

**Fichier à modifier :** `programme_P5_P6.html`
**Domaines concernés :** `domain-eco-eco`, `domain-eco-soc`
**Source officielle :** Référentiel FHGES, partie Formation économique et sociale — Tronc commun FWB

## Note technique pour Antigravity

Aucun total codé en dur : insérer les nouveaux `<div class="item">` (gabarit ci-dessous) suffit.
```html
<div class="item" data-year="p5"><input type="checkbox"><label>TEXTE</label><span class="badge p5">P5</span></div>
```

---

## 1. Économie (`domain-eco-eco`) — 16 → 18 items

### Item à déplacer depuis `domain-eco-social` (erreur de classement)

Dans le référentiel officiel, « Identifier des modes de financement participatif » appartient au tableau **Formation économique** (savoir « Budget : moyens de paiement, épargne, crédit, différentes formes de banques »), pas à la Formation sociale. Il faut **déplacer** cet item de `domain-eco-soc` vers `domain-eco-eco` (le contenu du libellé peut rester identique) :

**À retirer de `domain-eco-soc` :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Modes de financement alternatifs et participatifs</label><span class="badge p6">P6</span></div>
```
**À insérer dans `domain-eco-eco` :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Modes de financement alternatifs et participatifs</label><span class="badge p6">P6</span></div>
```

### Item à ajouter

```html
<div class="item" data-year="p6"><input type="checkbox"><label>En comparant les impacts économiques, sociaux et environnementaux de différents modes de production/consommation, justifier l'appartenance d'acteurs au commerce équitable</label><span class="badge p6">P6</span></div>
```

---

## 2. Social (`domain-eco-soc`) — 9 → 11 items (10 après le déplacement ci-dessus)

### Items à ajouter

```html
<div class="item" data-year="p6"><input type="checkbox"><label>Pour une organisation pratiquant l'économie sociale et solidaire ou circulaire, décrire comment les biens/services sont produits et l'incidence sur l'environnement local (relations producteurs-consommateurs, proximité, savoir-faire local)</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Pour un acte de consommation/production donné, formuler des questions sur les tensions entre intérêts individuels et intérêts collectifs des générations actuelles et futures (développement durable)</label><span class="badge p6">P6</span></div>
```

---

## Récapitulatif

| Domaine | Avant | Changement | Après |
|---|---|---|---|
| Économie | 16 | +1 déplacé (eco-soc→eco-eco) +1 ajout | 18 |
| Social | 9 | -1 déplacé (vers eco-eco) +2 ajouts | 10 |
| **Total Éco & Social** | **25** | **net +2, 1 reclassé** | **28** |

Après ces modifications, le domaine Éco & Social sera conforme à 100 % au référentiel FHGES officiel pour P5-P6 et correctement structuré entre Économie et Social.
