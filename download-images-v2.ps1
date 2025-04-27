# Script PowerShell pour créer des images placeholder pour les arrondissements de Paris
# Puisque les liens directs ne fonctionnent pas bien, nous allons créer des images simples avec du texte

$ErrorActionPreference = "Stop"
$destinationFolder = ".\public\images\arrondissements"

# Vérifier si le dossier existe, sinon le créer
if (-not (Test-Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder -Force
}

# Créer une image placeholder générique
$placeholderContent = @"
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#131A40"/>
  <text x="400" y="300" font-family="Arial" font-size="48" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">Paris</text>
  <text x="400" y="360" font-family="Arial" font-size="24" fill="#F9FAFF" text-anchor="middle" dominant-baseline="middle">Image quartier</text>
</svg>
"@

# Enregistrer l'image placeholder
$placeholderContent | Out-File -FilePath ".\public\images\quartier-placeholder.svg" -Encoding UTF8
Write-Host "Image placeholder générique créée."

# Pour chaque arrondissement, créer une image SVG avec le numéro de l'arrondissement
for ($i = 1; $i -le 20; $i++) {
    $arrNum = $i.ToString("00")
    $svgContent = @"
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF2A6D;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1A76FF;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)"/>
  <text x="400" y="270" font-family="Arial" font-size="72" fill="#FFD600" text-anchor="middle" dominant-baseline="middle">Paris $arrNum</text>
  <text x="400" y="350" font-family="Arial" font-size="36" fill="#F9FAFF" text-anchor="middle" dominant-baseline="middle">${arrNum}ème Arrondissement</text>
  <text x="400" y="400" font-family="Arial" font-size="18" fill="#F9FAFF" text-anchor="middle" dominant-baseline="middle">Cliquez pour voir les établissements</text>
</svg>
"@
    
    # Correction pour le 1er arrondissement
    if ($arrNum -eq "01") {
        $svgContent = $svgContent -replace "${arrNum}ème Arrondissement", "1er Arrondissement"
    }
    
    $outputFile = Join-Path $destinationFolder "$arrNum.svg"
    $svgContent | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host "Image créée pour l'arrondissement $arrNum"
}

Write-Host "Création des images terminée !"
