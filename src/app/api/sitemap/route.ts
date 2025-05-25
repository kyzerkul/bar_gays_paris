import { createClient } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalider toutes les heures

export async function GET() {
  try {
    // Créer un client Supabase
    const supabase = createClient();
    
    // Récupérer tous les bars
    const { data: bars, error: barsError } = await supabase
      .from('bars')
      .select('slug, updated_at')
      .order('id');
    
    if (barsError) throw barsError;
    
    // Récupérer tous les types
    const { data: types, error: typesError } = await supabase
      .from('types')
      .select('slug')
      .order('id');
    
    if (typesError) throw typesError;
    
    // Récupérer tous les quartiers
    const { data: quartiers, error: quartiersError } = await supabase
      .from('quartiers')
      .select('code')
      .order('id');
    
    if (quartiersError) throw quartiersError;

    // Base URL à partir des headers
    const host = headers().get('host') || 'barsgayparis.com';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    
    // Liste de toutes les URLs statiques
    const staticUrls = [
      '/',
      '/bars',
      '/carte',
      '/types',
      '/quartiers',
      '/guide-couleurs'
    ];
    
    // Générer les URLs de pages dynamiques
    const barUrls = bars.map(bar => `/bars/${bar.slug}`);
    const typeUrls = types.map(type => `/types/${type.slug}`);
    const quartierUrls = quartiers.map(quartier => `/quartiers/${quartier.code}`);
    
    // Combiner toutes les URLs
    const allUrls = [
      ...staticUrls,
      ...barUrls,
      ...typeUrls,
      ...quartierUrls
    ];
    
    // Formater les URLs avec le domaine complet
    const fullUrls = allUrls.map(url => ({
      url: `${baseUrl}${url}`,
      // Dernière mise à jour - utiliser la date du bar si disponible, sinon date actuelle
      lastmod: new Date().toISOString()
    }));
    
    // Réponse JSON
    return NextResponse.json(fullUrls);
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du sitemap' },
      { status: 500 }
    );
  }
}
