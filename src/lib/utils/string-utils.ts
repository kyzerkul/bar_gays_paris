/**
 * Convertit une chaîne de caractères en slug URL
 * - Supprime les caractères accentués
 * - Convertit en minuscules
 * - Remplace les espaces et caractères spéciaux par des tirets
 * - Supprime les tirets consécutifs
 * 
 * @param text Texte à slugifier
 * @returns Slug URL optimisé pour le SEO
 */
export function slugify(text: string): string {
  // Pour la meilleure compatibilité SEO, on suit ces étapes:
  
  return text
    .toString()                     // Conversion en chaîne
    .normalize('NFD')               // Décomposition des caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Suppression des accents
    .toLowerCase()                  // Conversion en minuscules
    .trim()                         // Suppression des espaces avant/après
    .replace(/\s+/g, '-')           // Remplacement des espaces par des tirets
    .replace(/[^\w\-]+/g, '')       // Suppression des caractères non alphanumériques
    .replace(/\-\-+/g, '-')         // Remplacement des tirets multiples par un seul
    .replace(/^-+/, '')             // Suppression des tirets au début
    .replace(/-+$/, '');            // Suppression des tirets à la fin
}

/**
 * Tronque un texte à une longueur spécifiée en préservant les mots entiers
 * 
 * @param text Texte à tronquer
 * @param maxLength Longueur maximale (par défaut 160 caractères pour les méta descriptions)
 * @param suffix Suffixe à ajouter si le texte est tronqué (par défaut '...')
 * @returns Texte tronqué
 */
export function truncateText(text: string, maxLength: number = 160, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Tronque à la longueur maximale moins la longueur du suffixe
  const truncatedText = text.substring(0, maxLength - suffix.length);
  
  // Trouve le dernier espace pour ne pas couper un mot
  const lastSpace = truncatedText.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncatedText.substring(0, lastSpace) + suffix;
  }
  
  return truncatedText + suffix;
}

/**
 * Extrait l'arrondissement à partir d'un code postal parisien
 * 
 * @param postalCode Code postal (e.g. '75004')
 * @returns Arrondissement formaté (e.g. '4ème')
 */
export function extractArrondissement(postalCode: string): string | null {
  if (!postalCode || !postalCode.startsWith('75')) {
    return null;
  }
  
  const arrondissement = postalCode.substring(3, 5);
  
  // Gestion du premier arrondissement
  if (arrondissement === '01' || arrondissement === '1') {
    return '1er';
  }
  
  // Suppression du zéro initial si présent
  const arrNumber = parseInt(arrondissement, 10);
  
  return `${arrNumber}ème`;
}

/**
 * Génère un titre SEO optimisé pour un bar
 * 
 * @param barName Nom du bar
 * @param barType Type d'établissement (bar, club, etc.)
 * @param arrondissement Arrondissement ou quartier
 * @returns Titre optimisé pour le SEO
 */
export function generateSeoTitle(barName: string, barType: string = 'Bar', arrondissement: string = 'Paris'): string {
  return `${barName} | ${barType} Gay Paris | ${arrondissement}`;
}

/**
 * Génère une meta description SEO optimisée pour un bar
 * 
 * @param barName Nom du bar
 * @param description Description de base
 * @param address Adresse
 * @param type Type d'établissement
 * @returns Description optimisée pour le SEO
 */
export function generateSeoDescription(
  barName: string,
  description: string = '',
  address: string = '',
  type: string = 'bar gay'
): string {
  let seoDesc = `${barName} est un ${type} à Paris`;
  
  if (address) {
    seoDesc += ` situé ${address}`;
  }
  
  if (description) {
    seoDesc += `. ${description}`;
  }
  
  return truncateText(seoDesc, 160);
}
