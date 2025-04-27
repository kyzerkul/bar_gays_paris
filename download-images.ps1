# Script PowerShell pour télécharger des images libres de droits pour les arrondissements de Paris
# Ce script utilise des images de monuments et lieux emblématiques de chaque arrondissement

$ErrorActionPreference = "Stop"
$destinationFolder = ".\public\images\arrondissements"

# Vérifier si le dossier existe, sinon le créer
if (-not (Test-Path $destinationFolder)) {
    New-Item -ItemType Directory -Path $destinationFolder -Force
}

# Image placeholder pour les quartiers
$placeholderUrl = "https://pixabay.com/get/g3bd8c1ea7f073e2ef9b55db28f14acda31f93f6c0bad78b3c97db71a20edc35b5aef4d0fd9ec18d3a86f6b74aa65b38e9c3b5a2f80c9c0c4bf2efcadd3f2fac6_1280.jpg"
Invoke-WebRequest -Uri $placeholderUrl -OutFile ".\public\images\quartier-placeholder.jpg"
Write-Host "Image placeholder téléchargée avec succès"

# Liste des URLs d'images pour chaque arrondissement
$arrondissementImages = @{
    # 1er arrondissement - Louvre, Palais Royal
    "01" = "https://pixabay.com/get/g76f9bf0f4cc8f953cdadf8a6e2b7e96c0cd2beab88e4be26b24dfb2b7ec2dc54f60fdaf347df1a9b47e293b9cae28e8d_1280.jpg"
    
    # 2ème arrondissement - Bourse
    "02" = "https://pixabay.com/get/gc3f06f7e0fc5ba14c17d214c6e66b4a0c04a78ac63d26e7e5f4c01c63a7cbb4dd9b13cd0a15c42a04bad1d3c39dd00e0_1280.jpg"
    
    # 3ème arrondissement - Marais historique
    "03" = "https://pixabay.com/get/g9a73fe8af08bbb0c0d2ad2c0b6cbff5b4ad43d5e5ceb8df8dfedef33eb7d3a38cbaeda05ee5c8a9a5b0d1bc3ad2a5c86_1280.jpg"
    
    # 4ème arrondissement - Notre Dame, Marais
    "04" = "https://pixabay.com/get/g86f2da6f2f1abe13731f8bb9bcde0eb5147fe9c5c54c4bb0cc7a8bce72de2f38db0b6edd91e59c8290a7ff6c0ae67911_1280.jpg"
    
    # 5ème arrondissement - Quartier Latin
    "05" = "https://pixabay.com/get/g94c4e50c2ecb618dc18df93f9df1de2e8f2ef75cf9dc55b5bf32d9aec682c95d2842b91c9ae16b7c8e47c9cd1a5243f9_1280.jpg"
    
    # 6ème arrondissement - Saint-Germain
    "06" = "https://pixabay.com/get/g0db56b6de0ce02b3e57acbe35e4a0d5de2c36fa0b39e92ed23d594ee36df499c5ddad2c2f01ae2cd00cc06e5b0a8b9be_1280.jpg"
    
    # 7ème arrondissement - Tour Eiffel
    "07" = "https://pixabay.com/get/gaeb50aa25e2e1e24c44747e5fa7ae7f85398b1b3bb73b2c1ecb33f85dfb9dbdb2bbc323abf4cfdba9f0aa1b6cc9b1b19_1280.jpg"
    
    # 8ème arrondissement - Champs-Élysées
    "08" = "https://pixabay.com/get/gad4613e1f29fef42efbb01f53bf87ce0b5c56e29b4a7af7fb25c38a38e4eac47fd8c12089aaa69dd4eca00fa6ba6aeb7_1280.jpg"
    
    # 9ème arrondissement - Opéra
    "09" = "https://pixabay.com/get/g6ff4a1beec9b12fc7df3b75df9a9d07a14a18ec80c1e9fab6ce33fa2b8c86d9ee82f5b48c7473a19e17f5bc7a0df55a1_1280.jpg"
    
    # 10ème arrondissement - Canal Saint-Martin
    "10" = "https://pixabay.com/get/gc3e9ff38d99eafcbb10c65c2b94d64b40a55cb80613d67d8af599f2ed3c6c6a7a2d2f8b43cdca0ccfdebc9badb10af90_1280.jpg"
    
    # 11ème arrondissement - Bastille
    "11" = "https://pixabay.com/get/g9b8fcd9835edc50f0b6e9d0bd5c8764d0e7e52c07f9c09f5b2f3b7d2ca80d8f5aab1a2b4246c48ecb7d9a17cec48d4a4_1280.jpg"
    
    # 12ème arrondissement - Bercy
    "12" = "https://pixabay.com/get/g4df16d4649dc52db8d69d97ab8b647cf19cb5e00bb6fef83b78eecdf70b0cdf1b6f6ba17cdb6a493b7a7bb9e55a50c63_1280.jpg"
    
    # 13ème arrondissement - Bibliothèque Nationale
    "13" = "https://pixabay.com/get/g09e45f2eaf9a58f4ccd2dbe2e5e9b6ef70e00e15a86ded9efd8a61c6abca65a38cc40eda60a622bace0c17b923e57583_1280.jpg"
    
    # 14ème arrondissement - Montparnasse
    "14" = "https://pixabay.com/get/ga47f02a3a4fa9b2da8d7a93b7f851e2c599bc8e3a77d2e2e5eb58c19cf88fe0c9af4a46e39ae4ecddfa6e0f0b37b1de5_1280.jpg"
    
    # 15ème arrondissement - Front de Seine
    "15" = "https://pixabay.com/get/g24fff0b437ddae4a3bc09de6ef91b23f6de37a5af79e8e8b9e92a7a9b2f5eaec6977a55a1d6e21c6f6acaba686c5f96f_1280.jpg"
    
    # 16ème arrondissement - Trocadéro
    "16" = "https://pixabay.com/get/g5ae10fa32195f12e9b6a7a18bae7e07dbfb887cce0daaf6f2a9c14889f1fbcac3d2fd4b0daaab0c71af879bae36e79dc_1280.jpg"
    
    # 17ème arrondissement - Batignolles
    "17" = "https://pixabay.com/get/g71fc32bbe8ab67a4dbadcb9bf18c5f04a0c2f86f3dcc82d52ac3baa1f09a38e5ecf1a91bb14beaa9c6e682c94e20bdd1_1280.jpg"
    
    # 18ème arrondissement - Montmartre
    "18" = "https://pixabay.com/get/g865e55c48fb5ad0bf6a4ddaf0064ddeb6ba41aaa4f6fa42fec6ada6c3be53fdf4c3f456c4f0e6e0d9ee80711ad83aedb_1280.jpg"
    
    # 19ème arrondissement - Parc de la Villette
    "19" = "https://pixabay.com/get/g39c08301abc0b2f9c6c55d42ba1f83d30267d8f38bc2b05a6df37fdce4cbb20c58b6d8f3c12a5c0e64ae1eab36ce2e79_1280.jpg"
    
    # 20ème arrondissement - Père Lachaise
    "20" = "https://pixabay.com/get/g42eff5c1b0a1e0c97c36b9bd8c06ff3e3e6dc2ffe1d2c37ffb02639ae41f53e3bfadfa4b0a9b42ead0af12fa18ff4651_1280.jpg"
}

# Télécharger chaque image d'arrondissement
foreach ($arrondissement in $arrondissementImages.Keys) {
    $url = $arrondissementImages[$arrondissement]
    $outputFile = Join-Path $destinationFolder "$arrondissement.jpg"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $outputFile
        Write-Host "Image téléchargée avec succès pour l'arrondissement $arrondissement"
    }
    catch {
        Write-Host "Erreur lors du téléchargement de l'image pour l'arrondissement $arrondissement : $_"
    }
}

Write-Host "Téléchargement des images terminé !"
