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
