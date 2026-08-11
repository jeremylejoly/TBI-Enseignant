#!/bin/bash
# Aller dans le dossier du script
cd "$(dirname "$0")"

echo "⏳ Sauvegarde de l'application TBI (Tableau interactif) sur Google Drive..."

# Lancement de la synchronisation incrémentielle avec rsync
rsync -av --delete --exclude='.git' ./ "/Users/jeremy/Library/CloudStorage/GoogleDrive-jeremylejoly@gmail.com/Mon Drive/TBI_Backup/"

echo ""
echo "✅ Sauvegarde terminée avec succès !"
echo "Le dossier 'TBI_Backup' de votre Google Drive est à jour."
sleep 3
