import { supabase } from './client';

// Fonction pour rechercher des bars par nom, adresse, ou quartier
export async function searchBars(query: string, limit = 5) {
  if (!query || query.trim().length < 2) {
    return { data: [], error: null };
  }

  const searchTerm = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from('bars')
    .select('id, name, address, postal_code, slug, photo')
    .or(`name.ilike.%${searchTerm}%, address.ilike.%${searchTerm}%, postal_code.ilike.%${searchTerm}%`)
    .order('name')
    .limit(limit);

  return { data, error };
}
