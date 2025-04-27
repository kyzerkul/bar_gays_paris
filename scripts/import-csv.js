// Script d'importation CSV pour Supabase
// Configuration directe - pas besoin de dotenv
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Configuration Supabase - valeurs en dur
const supabaseUrl = 'https://yqesxmxpbuegdixdoalk.supabase.co';

// Utilisation de la clé de service (service_role) - permet de contourner les restrictions RLS
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZXN4bXhwYnVlZ2RpeGRvYWxrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTY2MzU1NiwiZXhwIjoyMDYxMjM5NTU2fQ.vGXax5t2RC0HrUlbs0pJwiolVdHsfA77DwbT45UU8jE';

// Vérification de la configuration
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erreur: Variables NEXT_PUBLIC_SUPABASE_URL et/ou NEXT_PUBLIC_SUPABASE_ANON_KEY non définies');
  console.error('Veuillez créer un fichier .env.local avec ces variables');
  process.exit(1);
}

// Création du client Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction améliorée pour convertir une chaîne en slug et garantir un résultat non vide
function slugify(text) {
  if (!text) return `bar-${Math.floor(Math.random() * 10000)}`;
  
  // Convertir en slug standard
  let slug = text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
    
  // Si après tout ce traitement, le slug est vide, générer un slug unique basé sur les premiers caractères du nom
  if (!slug) {
    // Extraire des caractères valides ou utiliser un slug par défaut
    const validChars = text.replace(/[^a-zA-Z0-9]/g, '');
    if (validChars.length > 0) {
      slug = `${validChars.toLowerCase().substring(0, 5)}-${Math.floor(Math.random() * 10000)}`;
    } else {
      slug = `bar-${Math.floor(Math.random() * 10000)}`;
    }
  }
  
  return slug;
}

// Fonction pour générer une description SEO
function generateSeoDescription(data) {
  const barType = data.type?.toLowerCase() || 'établissement';
  const quartier = data.postal_code ? 
    `dans le ${data.postal_code.substring(3, 5)}${data.postal_code.substring(3, 5) === '01' ? 'er' : 'ème'} arrondissement` : 
    'à Paris';
  
  let description = `${data.name} est un ${barType} gay situé ${quartier}`;
  
  if (data.street) {
    description += ` au ${data.street}`;
  }
  
  if (data.subtypes) {
    description += `. ${data.name} propose ${data.subtypes.toLowerCase()}`;
  }
  
  if (data.about) {
    const shortAbout = data.about.length > 100 ? 
      data.about.substring(0, 100) + '...' : 
      data.about;
    description += `. ${shortAbout}`;
  }
  
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
}

// Importation du CSV vers Supabase
async function importCsvToSupabase(filePath) {
  console.log(`🔄 Lecture du fichier CSV: ${filePath}`);
  
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`📊 ${results.length} lignes trouvées dans le CSV`);
          
          // Formatage des données
          let formattedData = results.map(row => {
            // Création du slug à partir du nom
            const slug = slugify(row.name);
            
            // Conversion des types numériques - on traite spécifiquement les nombres
            // En remplaçant les virgules par des points pour les locales françaises
            const latitude = row.latitude ? parseFloat(row.latitude.toString().replace(',', '.')) : null;
            const longitude = row.longitude ? parseFloat(row.longitude.toString().replace(',', '.')) : null;
            const rating = row.rating ? parseFloat(row.rating.toString().replace(',', '.')) : null;
            const reviews = row.reviews ? parseInt(row.reviews, 10) : null;
            const photos_count = row.photos_count ? parseInt(row.photos_count, 10) : null;
            
            // Date actuelle pour created_at et updated_at
            const now = new Date().toISOString();
            
            // Génération de la description SEO
            const seo_description = generateSeoDescription(row);
            
            return {
              ...row,
              slug,
              latitude,
              longitude,
              rating,
              reviews,
              photos_count,
              created_at: now,
              updated_at: now,
              seo_description
            };
          });
          
          // Éliminer les doublons basés sur le slug
          const slugMap = {};
          formattedData = formattedData.filter(item => {
            if (slugMap[item.slug]) {
              console.log(`⚠️ Doublon détecté et filtré: ${item.name} (slug: ${item.slug})`);
              return false;
            }
            slugMap[item.slug] = true;
            return true;
          });
          
          console.log(`📝 Après filtrage des doublons: ${formattedData.length} enregistrements à importer`);
          console.log('🔄 Insertion des données dans Supabase...');
          
          // Insertion par lots plus petits pour éviter les conflits
          const batchSize = 5;
          for (let i = 0; i < formattedData.length; i += batchSize) {
            const batch = formattedData.slice(i, i + batchSize);
            try {
              const { error } = await supabase
                .from('bars')
                .upsert(batch, { 
                  onConflict: 'slug',
                  ignoreDuplicates: true // Changer à true pour ignorer les doublons
                });
              
              if (error) {
                console.error('❌ Erreur lors de l\'insertion dans Supabase:', error);
                
                // Afficher des informations détaillées sur les données qui ont causé l'erreur
                console.error(`Données problématiques de l'élément ${i}:`, 
                  JSON.stringify(batch.map(item => ({
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude
                  })), null, 2)
                );
                
                reject(error);
                return;
              }
            } catch (err) {
              console.error('❌ Exception lors de l\'insertion dans Supabase:', err);
              reject(err);
              return;
            }
            
            console.log(`✅ Lot ${Math.floor(i/batchSize) + 1}/${Math.ceil(formattedData.length/batchSize)} importé avec succès`);
          }
          
          console.log(`✅ ${formattedData.length} enregistrements importés avec succès !`);
          resolve();
        } catch (error) {
          console.error('❌ Erreur lors du traitement des données:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Erreur lors de la lecture du fichier CSV:', error);
        reject(error);
      });
  });
}

// Fonction principale
async function main() {
  const defaultPath = path.join(process.cwd(), 'data', 'bars-gay-paris.csv');
  const csvFilePath = process.argv[2] || defaultPath;
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Erreur: Le fichier ${csvFilePath} n'existe pas.`);
    console.error(`Veuillez placer votre fichier CSV dans le dossier 'data' ou spécifier le chemin complet.`);
    console.error(`Usage: node scripts/import-csv.js [chemin_vers_csv]`);
    process.exit(1);
  }
  
  try {
    console.log(`🚀 Début de l'importation...`);
    await importCsvToSupabase(csvFilePath);
    console.log(`🎉 Importation terminée avec succès !`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'importation:`, error);
    process.exit(1);
  }
}

// Exécution
main();
