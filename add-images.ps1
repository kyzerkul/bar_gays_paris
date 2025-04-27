# Script PowerShell pour préparer l'intégration des images
# Crée les fichiers nécessaires dans le bon répertoire

$ErrorActionPreference = "Stop"
$destinationFolder = ".\public\images\arrondissements-jpg"

# Vérifier si le dossier existe, sinon le créer
if (-not (Test-Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder -Force
}

# Créer des fichiers vides pour les 5 premiers arrondissements
# Ils seront remplacés manuellement par les vraies images
1..5 | ForEach-Object {
    $fileName = "{0:D2}.jpg" -f $_
    $outputFile = Join-Path $destinationFolder $fileName
    
    # Créer un fichier vide
    $null | Set-Content -Path $outputFile
    
    Write-Host "Fichier vide créé : $outputFile"
}

Write-Host "Préparation terminée. Veuillez remplacer ces fichiers par les images appropriées."
