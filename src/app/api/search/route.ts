import { NextRequest, NextResponse } from 'next/server';
import { searchBars } from '@/lib/supabase/search';

export async function GET(request: NextRequest) {
  try {
    // Récupérer le paramètre de recherche de l'URL
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    
    // Effectuer la recherche
    const { data, error } = await searchBars(query);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ results: data });
  } catch (error) {
    console.error('Erreur de recherche:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche' }, 
      { status: 500 }
    );
  }
}
