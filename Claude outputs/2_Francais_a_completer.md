# Programme P5-P6 — Français (FRALA) — Spécification de mise à jour (100 % référentiel FWB)

**Fichier à modifier :** `programme_P5_P6.html`
**Domaines concernés :** `domain-fr-conj`, `domain-fr-gram`, `domain-fr-ortho`, `domain-fr-lect`, `domain-fr-prod`
**Source officielle :** Référentiel de Français et Langues Anciennes (FRALA), partie Français — Tronc commun FWB

## Note technique pour Antigravity

Comme pour les autres matières, aucun total n'est codé en dur : insérer les nouveaux `<div class="item">` (gabarit ci-dessous) suffit, tout le reste (compteurs, filtres, recherche) est calculé dynamiquement.
```html
<div class="item" data-year="p5"><input type="checkbox"><label>TEXTE</label><span class="badge p5">P5</span></div>
```
Insérer chaque nouvel item juste avant la balise `</div>` qui ferme le domaine concerné, sauf indication contraire.

---

## 1. Conjugaison (`domain-fr-conj`) — 27 items, inchangé

Couverture 100 % confirmée : tous les temps, groupes verbaux et règles d'accord du participe passé du référentiel P5/P6 sont déjà présents. Aucun ajout nécessaire.

---

## 2. Grammaire (`domain-fr-gram`) — 23 → 27 items

### Item existant à corriger (terminologie incomplète)

Le référentiel liste une terminologie plus large que ce qui figure dans l'app.

**Avant :**
```html
<div class="item" data-year="p5"><input type="checkbox"><label>Terminologie : mode, radical, terminaison, auxiliaire, anaphore, référent</label><span class="badge p5">P5</span></div>
```
**Après :**
```html
<div class="item" data-year="p5"><input type="checkbox"><label>Terminologie : classe, fonction, accord, genre, nombre, personne, substitut grammatical, anaphore, référent, mode, radical, terminaison, auxiliaire</label><span class="badge p5">P5</span></div>
```

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer et verbaliser les nuances apportées par les marques de la négation</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer et verbaliser les nuances apportées par les marques de l'assertion, de l'interrogation, de l'injonction</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer les structures passives</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer les structures de mise en évidence</label><span class="badge p5">P5</span></div>
```

*(Note : « Classe des mots » — déterminants, pronoms, connecteurs — n'est pas un manque : déjà couvert par les items existants « Déterminants : cardinal, indéfini », « Pronoms : démonstratif, possessif, numéral, indéfini » et « Connecteurs ».)*

---

## 3. Orthographe / lexique (`domain-fr-ortho`) — 18 items, inchangé

Couverture 100 % confirmée : familles de mots, règles de position, préfixes/suffixes et relations lexicales du référentiel P5/P6 sont déjà tous présents.

---

## 4. Lecture (`domain-fr-lect`) — 31 → 36 items

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>Désigner la maison d'édition, la collection, le sommaire ou la table des matières (paratexte)</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Repérer les organisateurs textuels pour construire du sens</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Utiliser les organisateurs textuels pour construire la cohérence</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Utiliser les termes du support de lecture (paratexte) : titres, sous-titres, paragraphes</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Noter des mots-clés du message lu ou entendu</label><span class="badge p6">P6</span></div>
<div class="item" data-year="p6"><input type="checkbox"><label>Organiser ses notes (schéma, ligne du temps, carte mentale…)</label><span class="badge p6">P6</span></div>
```

---

## 5. Production d'écrits / oral (`domain-fr-prod`) — 21 → 32 items

### Items à ajouter

```html
<div class="item" data-year="p5"><input type="checkbox"><label>S'adapter à la diversité des interlocuteurs : connu/inconnu, familier/non familier, un/plusieurs, du même âge/plus jeune/plus âgé, d'ici/d'ailleurs</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Oser proposer des idées nouvelles</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Oser s'exprimer en dépit des maladresses syntaxiques, des répétitions et des hésitations dans les formulations</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Proposer diverses formulations</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Accepter d'utiliser provisoirement un vocabulaire approximatif ou le même mot pour exprimer diverses choses</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Questionner ses interlocuteurs suite à une difficulté de compréhension ou pour en savoir plus sur le sujet</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Répondre à des questions posées à la suite d'une prise de parole préparée</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Clarifier ses propos ou ses réactions en faisant des liens entre ses idées</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Revenir au sujet lorsqu'on s'en éloigne</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Enchainer une prise de parole à la suite de celle d'un autre</label><span class="badge p5">P5</span></div>
<div class="item" data-year="p5"><input type="checkbox"><label>Utiliser à bon escient des expressions types pour respecter les règles de courtoisie</label><span class="badge p5">P5</span></div>
```

### Bug à corriger (libellé dupliqué)

Même bug que celui relevé en Mathématiques — un item contient un préfixe « [P6] » en trop dans le texte du libellé.

**Avant (domaine Conjugaison, `domain-fr-conj`) :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>[P6] Consolidation et automatisation des accords du PP</label><span class="badge p6">P6</span></div>
```
**Après :**
```html
<div class="item" data-year="p6"><input type="checkbox"><label>Consolidation et automatisation des accords du PP</label><span class="badge p6">P6</span></div>
```

---

## Récapitulatif

| Domaine | Avant | Ajouts | Après |
|---|---|---|---|
| Conjugaison | 27 | +0 (1 correction bug) | 27 |
| Grammaire | 23 | +4 (+1 correction) | 27 |
| Orthographe / lexique | 18 | +0 | 18 |
| Lecture | 31 | +6 | 37 |
| Production d'écrits / oral | 21 | +11 | 32 |
| **Total Français** | **120** | **+21** | **141** |

Après ces modifications, le domaine Français sera conforme à 100 % au référentiel FRALA officiel pour P5-P6 (aucun attendu manquant, un bug corrigé). Les manques les plus importants concernaient les compétences orales stratégiques (interaction, prise de parole spontanée) et quelques points fins de grammaire — le contenu déjà présent (conjugaison, orthographe) était déjà exhaustif.
