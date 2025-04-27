import Link from 'next/link';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DynamicMap from '@/components/ui/DynamicMap';
import BarImage from '@/components/ui/BarImage';
import { getBars, getTypes } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';

// Génération des métadonnées dynamiques pour le référencement
export async function generateMetadata({ params }: { params: { type: string } }) {
  const decodedType = decodeURIComponent(params.type);
  
  // Vérifier si le type existe
  const types = await getTypes();
  const typeExists = types.some(t => t.id === params.type);
  
  if (!typeExists) {
    return {
      title: "Type non trouvé | Bars Gay Paris",
      description: "Ce type d'établissement n'existe pas dans notre annuaire des bars gay de Paris."
    };
  }
  
  return {
    title: `Bars gay ${decodedType} à Paris | Guide LGBT+`,
    description: `Découvrez les meilleurs établissements ${decodedType} gay et LGBT+ à Paris. Guide complet avec adresses, horaires et ambiances.`
  };
}

// Types pour la pagination
type PageProps = {
  params: {
    type: string;
  };
  searchParams?: {
    page?: string;
  };
};

export default async function TypePage({ params, searchParams = {} }: PageProps) {
  // Récupération du type à partir de l'URL et décodage
  const { type: encodedType } = params;
  const type = decodeURIComponent(encodedType);
  
  // Vérifier si le type existe
  const types = await getTypes();
  const typeExists = types.some(t => t.id === type);
  
  if (!typeExists) {
    notFound();
  }
  
  // Récupération des paramètres pour la pagination
  const currentPage = Number(searchParams.page) || 1;
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;
  
  // Récupération des bars pour ce type
  const allBars = await getBars({
    type,
    limite: 1000 // Limite élevée pour récupérer tous les bars
  });
  
  // Récupérer seulement les bars pour la page actuelle
  const barsForCurrentPage = allBars.slice(skip, skip + pageSize);
  
  // Calcul du nombre total de pages
  const totalPages = Math.ceil(allBars.length / pageSize);
  
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary to-blue text-text-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Bars gays {type} à Paris</h1>
            <p className="mt-3 text-lg max-w-3xl mx-auto opacity-90">
              Découvrez tous les établissements {type} LGBT+ de la capitale
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ transform: 'translateY(1px)' }}>
            <svg
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              fill="#0A0F29"
              className="w-full h-12"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
            </svg>
          </div>
        </section>

        {/* Bars grid section */}
        <section className="py-10 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Résultats */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-secondary">
                {allBars.length} établissement{allBars.length > 1 ? 's' : ''} de type {type}
              </h2>
            </div>

            {/* Grille de bars */}
            {barsForCurrentPage.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {barsForCurrentPage.map((bar) => (
                  <div 
                    key={bar.id}
                    className="bg-surface rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow border border-primary/20"
                  >
                    <Link href={`/bars/${bar.slug}`} className="block relative h-48 w-full overflow-hidden">
                      <BarImage
                        photo={bar.photo}
                        barId={bar.id}
                        barName={bar.name}
                        className="transform hover:scale-105 transition-transform duration-500"
                      />
                      {bar.rating && (
                        <div className="absolute top-2 right-2 bg-white text-primary px-2 py-1 rounded text-sm font-bold flex items-center">
                          <FaStar className="text-primary mr-1" size={16} />
                          {Number(bar.rating).toFixed(1)}
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        {type}
                      </div>
                    </Link>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-text-light mb-1">{bar.name}</h3>
                      <p className="text-text-light opacity-80 text-sm mb-2 flex items-center">
                        <FaMapMarkerAlt className="text-blue mr-1" size={12} />
                        {bar.postal_code?.substring(3, 5)}e arr.
                      </p>
                      <p className="mt-2 text-sm line-clamp-2 text-gray-700">
                        {bar.description || `Découvrez ${bar.name}, un établissement LGBT+ au cœur de Paris.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface rounded-lg shadow-md border border-blue/20">
                <h3 className="text-lg font-medium text-text-light mb-2">Aucun établissement de ce type n'a été trouvé</h3>
                <p className="text-text-light opacity-80">Essayez un autre type d'établissement</p>
                <Link href="/bars" className="mt-4 inline-block text-accent hover:text-blue font-medium">
                  Voir tous les établissements
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Link
                    href={`/types/${encodeURIComponent(type)}?page=${Math.max(1, currentPage - 1)}`}
                    className={`px-3 py-2 rounded text-sm ${
                      currentPage === 1
                        ? 'text-text-light opacity-50 cursor-not-allowed'
                        : 'text-text-light hover:bg-surface'
                    }`}
                    aria-disabled={currentPage === 1}
                  >
                    Précédent
                  </Link>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    // Afficher un nombre limité de pages pour éviter une pagination trop longue
                    if (
                      i + 1 === 1 ||
                      i + 1 === totalPages ||
                      (i + 1 >= currentPage - 2 && i + 1 <= currentPage + 2)
                    ) {
                      return (
                        <Link
                          key={i}
                          href={`/types/${encodeURIComponent(type)}?page=${i + 1}`}
                          className={`px-3 py-2 rounded text-sm ${
                            currentPage === i + 1
                              ? 'bg-accent text-text-light'
                              : 'text-text-light hover:bg-surface'
                          }`}
                        >
                          {i + 1}
                        </Link>
                      );
                    }
                    
                    // Afficher des ellipses pour les sauts de pagination
                    if (
                      (i + 1 === 2 && currentPage > 4) ||
                      (i + 1 === totalPages - 1 && currentPage < totalPages - 3)
                    ) {
                      return <span key={i} className="px-2 py-2 text-text-light opacity-70">...</span>;
                    }
                    
                    return null;
                  })}
                  
                  <Link
                    href={`/types/${encodeURIComponent(type)}?page=${Math.min(totalPages, currentPage + 1)}`}
                    className={`px-3 py-2 rounded text-sm ${
                      currentPage === totalPages
                        ? 'text-text-light opacity-50 cursor-not-allowed'
                        : 'text-text-light hover:bg-surface'
                    }`}
                    aria-disabled={currentPage === totalPages}
                  >
                    Suivant
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </section>
        
        {/* Browse all categories */}
        <section className="bg-bg-dark py-12 border-t border-primary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-secondary mb-6">Explorer d'autres catégories</h2>
            <Link 
              href="/bars"
              className="inline-flex items-center px-5 py-3 bg-accent hover:bg-blue text-text-light font-medium rounded-md shadow-md"
            >
              Voir tous les établissements
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
