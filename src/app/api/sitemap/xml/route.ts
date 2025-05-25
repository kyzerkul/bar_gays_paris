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
    const quartiersSet = new Set();
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
    const typeUrls = Array.from(typesSet).map(type => `/types/${encodeURIComponent(String(type))}`);
    const quartierUrls = Array.from(quartiersSet).map(quartier => `/quartiers/${quartier}`);
    
    // Combiner toutes les URLs
    const allUrls = [
      ...staticUrls,
      ...barUrls,
      ...typeUrls,
      ...quartierUrls
    ];
    
    // Générer le XML du sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    allUrls.forEach(url => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      
      // Priorités et fréquences de mise à jour
      if (url === '/') {
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>1.0</priority>\n';
      } else if (url.startsWith('/bars/')) {
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.9</priority>\n';
      } else if (['/bars', '/carte', '/types', '/quartiers'].includes(url)) {
        xml += '    <changefreq>daily</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
      } else {
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
      }
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    // Réponse XML
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du sitemap XML:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du sitemap XML' },
      { status: 500 }
    );
  }
}
