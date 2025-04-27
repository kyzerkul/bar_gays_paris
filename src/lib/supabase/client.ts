import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Configuration Supabase avec des valeurs codées en dur pour éviter les problèmes de variables d'environnement
// Note: Dans un environnement de production, ces valeurs devraient provenir des variables d'environnement
const supabaseUrl = 'https://yqesxmxpbuegdixdoalk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZXN4bXhwYnVlZ2RpeGRvYWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NjM1NTYsImV4cCI6MjA2MTIzOTU1Nn0.8xQmYfVu9Mb7zTj5xEyGlWfJd5qeloP7vy2OXkaZSnE';

// Création du client Supabase avec typage fort pour une meilleure expérience de développement
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Fonction pour récupérer tous les bars avec filtres optionnels
export async function getBars({ 
  quartier = '', 
  type = '', 
  limite = 100 
}: { 
  quartier?: string, 
  type?: string, 
  limite?: number 
} = {}) {
  let query = supabase
    .from('bars')
    .select('*')
    .order('name')
    .limit(limite);
  
  if (quartier) {
    // Filtrer par quartier/arrondissement en extrayant du code postal
    query = query.ilike('postal_code', `%${quartier}%`);
  }
  
  if (type) {
    // Filtrer par type d'établissement
    query = query.ilike('subtypes', `%${type}%`);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data;
}

// Fonction pour récupérer un bar spécifique par son slug
export async function getBarBySlug(slug: string) {
  const { data, error } = await supabase
    .from('bars')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  
  return data;
}

// Fonction pour récupérer des bars similaires (même type ou même quartier)
export async function getSimilarBars({ 
  barId, 
  types = [],
  postalCode = '',
  limit = 4
}: { 
  barId: number,
  types?: string[],
  postalCode?: string,
  limit?: number 
}) {
  // S'assurer qu'on n'utilise que les types non vides
  const validTypes = types.filter((t: string) => t && t.trim() !== '');
  
  let query = supabase
    .from('bars')
    .select('*')
    .neq('id', barId) // Exclure le bar actuel
    .limit(limit);
  
  if (validTypes.length > 0) {
    // Construire une condition OR pour tous les types
    const typeConditions = validTypes.map(type => `subtypes.ilike.%${type}%`);
    query = query.or(typeConditions.join(','));
  }
  
  if (postalCode) {
    // Si un code postal est fourni et qu'il n'y a pas de types valides, filtrer par code postal
    // Ou si on a des types, on ajoute cette condition comme un filtre additionnel
    query = validTypes.length > 0 ? 
      query.ilike('postal_code', `%${postalCode}%`) : 
      query.or(`postal_code.ilike.%${postalCode}%`);
  }
  
  // Ajouter un ordre aléatoire pour de la variété
  query = query.order('name');
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  return data || [];
}

// Interface pour les quartiers
export interface Quartier {
  id: string;
  name: string;
  count: number;
}

// Fonction pour récupérer les quartiers pour les filtres
export async function getQuartiers(): Promise<Quartier[]> {
  const { data, error } = await supabase
    .from('bars')
    .select('postal_code')
    .order('postal_code');
  
  if (error) throw error;
  
  // Compter les bars par arrondissement
  const quartiersCount: Record<string, number> = {};
  
  data.forEach(bar => {
    if (bar.postal_code) {
      const arrondissement = bar.postal_code.substring(3, 5);
      if (arrondissement) {
        const key = arrondissement.replace(/^0+/, '');
        quartiersCount[key] = (quartiersCount[key] || 0) + 1;
      }
    }
  });
  
  // Extraction des quartiers uniques (arrondissements)
  const quartiersSet = new Set(Object.keys(quartiersCount));
  
  return Array.from(quartiersSet).map(num => {
    // Formater correctement avec les préfixes pour l'ID et le bon libellé
    if (num === "1") {
      return { 
        id: "75001", 
        name: "1er Arrondissement",
        count: quartiersCount[num] || 0
      };
    }
    return { 
      id: `750${num.padStart(2, '0')}`, 
      name: `${num}ème Arrondissement`,
      count: quartiersCount[num] || 0
    };
  });
}

// Interface pour les types d'établissements
export interface BarType {
  id: string;
  name: string;
  count: number;
}

// Fonction pour récupérer les types d'établissements pour les filtres
export async function getTypes(): Promise<BarType[]> {
  const { data, error } = await supabase
    .from('bars')
    .select('subtypes');
  
  if (error) throw error;
  
  // Comptage des bars par type
  const typesCount: Record<string, number> = {};
  data.forEach(bar => {
    if (bar.subtypes) {
      const typesList = bar.subtypes.split(',').map(t => t.trim());
      typesList.forEach(t => {
        if (t) {
          typesCount[t] = (typesCount[t] || 0) + 1;
        }
      });
    }
  });
  
  // Conversion en tableau
  return Object.entries(typesCount)
    .sort((a, b) => a[0].localeCompare(b[0])) // Tri alphabétique par nom
    .map(([type, count]) => ({ 
      id: type, 
      name: type,
      count: count
    }));
}
