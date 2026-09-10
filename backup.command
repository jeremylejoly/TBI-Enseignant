#!/bin/bash
# Aller dans le dossier du script
cd "$(dirname "$0")"

clear
echo "=========================================================="
echo "   SAUVEGARDE COMPLÈTE DU TABLEAU BLANC INTERACTIF (TBI)"
echo "=========================================================="
echo "📁 Source      : $(pwd)"
echo "☁️ Destination : Google Drive (Dossier 'TBI_Backup')"
echo "🕒 Date        : $(date '+%d/%m/%Y à %H:%M:%S')"
echo "----------------------------------------------------------"
echo "⏳ Synchronisation complète en cours..."
echo ""

DEST_DIR="/Users/jeremy/Library/CloudStorage/GoogleDrive-jeremylejoly@gmail.com/Mon Drive/TBI_Backup"

mkdir -p "$DEST_DIR"

# Lancement de la synchronisation incrémentielle complète avec rsync
rsync -av --delete --exclude='.git' ./ "$DEST_DIR/"

echo ""
echo "----------------------------------------------------------"
echo "✅ Sauvegarde terminée avec succès !"
echo "Le dossier 'TBI_Backup' de votre Google Drive est 100% à jour."
echo "=========================================================="
sleep 3
