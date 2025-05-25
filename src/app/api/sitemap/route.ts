import { supabase } from '@/lib/supabase/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalider toutes les heures

export async function GET() {
  try {
    // Récupérer tous les bars
    const { data: bars, error: barsError } = await supabase
      .from('bars')
      .select('slug, updated_at, postal_code, subtypes')
      .order('id');
    
    if (barsError) throw barsError;
    
    // Extraire les quartiers uniques
    const quartiersSet = new Set<string>();
    bars.forEach(bar => {
      if (bar.postal_code) {
        const codeQuartier = bar.postal_code.substring(0, 5);
        if (codeQuartier && codeQuartier.startsWith('75')) {
          quartiersSet.add(codeQuartier);
        }
      }
    });
    
    // Extraire les types uniques
    const typesSet = new Set<string>();
    bars.forEach(bar => {
      if (bar.subtypes) {
        const typesList = bar.subtypes.split(',').map((t: string) => t.trim());
        typesList.forEach((type: string) => {
          if (type) typesSet.add(type.toLowerCase());
        });
      }
    });

    // Base URL fixe pour éviter les problèmes avec headers()
    const baseUrl = 'https://barsgayparis.com';
    
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
    const typeUrls = Array.from(typesSet).map(type => `/types/${encodeURIComponent(type)}`);
    const quartierUrls = Array.from(quartiersSet).map(quartier => `/quartiers/${quartier}`);
    
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
