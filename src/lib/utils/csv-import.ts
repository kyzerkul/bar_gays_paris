import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { supabase } from '@/lib/supabase/client';
import { slugify } from './string-utils';

// Type pour les données CSV brutes
interface RawCsvData {
  name: string;
  site?: string;
  subtypes?: string;
  category?: string;
  type?: string;
  phone?: string;
  full_address?: string;
  street?: string;
  postal_code?: string;
  latitude?: string;
  longitude?: string;
  h3?: string;
  rating?: string;
  reviews?: string;
  reviews_link?: string;
  photos_count?: string;
  photo?: string;
  street_view?: string;
  working_hours?: string;
  other_hours?: string;
  business_status?: string;
  about?: string;
  range?: string;
  logo?: string;
  description?: string;
  reservation_links?: string;
  booking_appointment_link?: string;
  order_links?: string;
  location_link?: string;
  location_reviews_link?: string;
  reviews_id?: string;
  email_1?: string;
  phone_1?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
}

// Type pour les données formatées pour Supabase
interface FormattedBarData {
  name: string;
  slug: string;
  site?: string;
  subtypes?: string;
  category?: string;
  type?: string;
  phone?: string;
  full_address?: string;
  street?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  h3?: string;
  rating?: number;
  reviews?: number;
  reviews_link?: string;
  photos_count?: number;
  photo?: string;
  street_view?: string;
  working_hours?: string;
  other_hours?: string;
  business_status?: string;
  about?: string;
  range?: string;
  logo?: string;
  description?: string;
  reservation_links?: string;
  booking_appointment_link?: string;
  order_links?: string;
  location_link?: string;
  location_reviews_link?: string;
  reviews_id?: string;
  email_1?: string;
  phone_1?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  created_at: string;
  updated_at: string;
  seo_description?: string;
}

/**
 * Fonction pour importer les données CSV dans Supabase
 * @param filePath Chemin vers le fichier CSV
 */
export async function importCsvToSupabase(filePath: string): Promise<void> {
  const results: RawCsvData[] = [];
  
  // Fonction pour générer une description SEO
  const generateSeoDescription = (data: RawCsvData): string => {
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
      // Limiter la longueur pour éviter des descriptions trop longues
      const shortAbout = data.about.length > 100 ? 
        data.about.substring(0, 100) + '...' : 
        data.about;
      description += `. ${shortAbout}`;
    }
    
    // On limite la description SEO à 160 caractères idéalement
    if (description.length > 160) {
      description = description.substring(0, 157) + '...';
    }
    
    return description;
  };
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: RawCsvData) => results.push(data))
      .on('end', async () => {
        try {
          // Formatage des données
          const formattedData: FormattedBarData[] = results.map(row => {
            // Création du slug à partir du nom
            const slug = slugify(row.name);
            
            // Conversion des types numériques
            const latitude = row.latitude ? parseFloat(row.latitude) : undefined;
            const longitude = row.longitude ? parseFloat(row.longitude) : undefined;
            const rating = row.rating ? parseFloat(row.rating) : undefined;
            const reviews = row.reviews ? parseInt(row.reviews, 10) : undefined;
            const photos_count = row.photos_count ? parseInt(row.photos_count, 10) : undefined;
            
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
          
          // Insertion dans Supabase
          const { data, error } = await supabase
            .from('bars')
            .upsert(formattedData, { 
              onConflict: 'slug',  // En cas de conflit, on fait un upsert basé sur le slug
              ignoreDuplicates: false
            });
            
          if (error) {
            console.error('Erreur lors de l\'insertion dans Supabase:', error);
            reject(error);
          } else {
            console.log(`${formattedData.length} enregistrements importés avec succès !`);
            resolve();
          }
        } catch (error) {
          console.error('Erreur lors du traitement des données:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Erreur lors de la lecture du fichier CSV:', error);
        reject(error);
      });
  });
}

/**
 * Fonction pour exécuter l'import depuis un script Node.js
 */
export async function runImport() {
  const csvFilePath = process.env.CSV_FILE_PATH || path.join(process.cwd(), 'data', 'bars-gay-paris.csv');
  
  try {
    console.log(`Début de l'importation depuis ${csvFilePath}...`);
    await importCsvToSupabase(csvFilePath);
    console.log('Importation terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    process.exit(1);
  }
}

// Si ce fichier est exécuté directement (node script.js)
if (require.main === module) {
  runImport();
}
