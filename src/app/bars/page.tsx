import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';
import { FaMapMarkerAlt, FaStar, FaFilter, FaMapMarked, FaGlassMartini, FaSearch, FaTimesCircle } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BarsListSchemaOrg from '@/components/seo/BarsListSchemaOrg';
import { getBars, getTypes, getQuartiers } from '@/lib/supabase/client';

// Métadonnées statiques pour le référencement
export const metadata = {
  title: 'Tous les établissements | Bars Gay Paris',
  description: 'Découvrez la liste complète des bars, clubs et établissements gay-friendly à Paris. Filtrez par quartier et type.'
};

// Types pour la pagination et les filtres
type PageProps = {
  searchParams?: {
    page?: string;
    quartier?: string;
    type?: string;
    q?: string; // Paramètre de recherche
  };
};

export default async function BarsPage({ searchParams }: PageProps) {
  // Construire l'URL de base pour le SEO
  const baseUrl = 'https://bars-gay-paris.fr';
  
  // Récupération des paramètres de l'URL
  const currentPage = Number(searchParams?.page) || 1;
  const quartier = searchParams?.quartier || '';
  const type = searchParams?.type || '';
  const searchQuery = searchParams?.q || '';
  
  // Paramètres de pagination
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;
  
  // Récupérer tous les bars pour déterminer le nombre total de pages
  let allBars = await getBars({ 
    quartier: quartier,
    type: type,
    limite: 1000 // Limite élevée pour récupérer tous les bars
  });
  
  // Filtrer les bars en fonction de la recherche si un terme de recherche est fourni
  if (searchQuery) {
    const searchTerm = searchQuery.toLowerCase();
    allBars = allBars.filter(bar => 
      bar.name?.toLowerCase().includes(searchTerm) ||
      bar.address?.toLowerCase().includes(searchTerm) ||
      bar.postal_code?.toLowerCase().includes(searchTerm) ||
      bar.description?.toLowerCase().includes(searchTerm)
    );
  }
  
  // Récupérer seulement les bars pour la page actuelle
  const barsForCurrentPage = allBars.slice(skip, skip + pageSize);
  
  // Calcul du nombre total de pages
  const totalPages = Math.ceil(allBars.length / pageSize);
  
  // Récupérer tous les quartiers et types pour les filtres
  const quartiers = await getQuartiers();
  const types = await getTypes();
  
  return (
    <>
      {/* Intégration des données structurées Schema.org */}
      <BarsListSchemaOrg bars={allBars.slice(0, 30)} baseUrl={baseUrl} />
      
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary to-blue text-text-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              {searchQuery 
                ? `Résultats pour "${searchQuery}"` 
                : "Tous les bars gays de Paris"}
            </h1>
            <p className="mt-3 text-lg max-w-3xl mx-auto opacity-90">
              {searchQuery
                ? `${allBars.length} établissement${allBars.length > 1 ? 's' : ''} trouvé${allBars.length > 1 ? 's' : ''}`
                : "Découvrez la sélection complète des bars et établissements LGBT+ de la capitale"}
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

        {/* Bars section with sidebar */}
        <section className="py-10 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Active filters - mobile only */}
            {(quartier || type || searchQuery) && (
              <div className="lg:hidden mb-6 flex items-center text-sm">
                <span className="mr-2 text-text-light opacity-80">Filtres actifs:</span>
                <div className="flex flex-wrap gap-2">
                  {quartier && (
                    <div className="bg-surface px-3 py-1 rounded-full flex items-center shadow-sm border border-blue/20 text-text-light">
                      <span>{quartier.replace('750', '')}e Arrondissement</span>
                      <Link href="/bars" className="ml-2 text-text-light opacity-80 hover:text-secondary transition-colors">
                        ×
                      </Link>
                    </div>
                  )}
                  {type && (
                    <div className="bg-surface px-3 py-1 rounded-full flex items-center shadow-sm border border-blue/20 text-text-light">
                      <span>{type}</span>
                      <Link href={`/bars${quartier ? `?quartier=${quartier}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`} className="ml-2 text-text-light opacity-80 hover:text-secondary transition-colors">
                        ×
                      </Link>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="bg-surface px-3 py-1 rounded-full flex items-center shadow-sm border border-primary/20 text-text-light">
                      <FaSearch className="mr-1 text-xs text-secondary" />
                      <span>"{searchQuery}"</span>
                      <Link href={`/bars${quartier ? `?quartier=${quartier}` : ''}${type ? `&type=${type}` : ''}`} className="ml-2 text-text-light opacity-80 hover:text-secondary transition-colors">
                        ×
                      </Link>
                    </div>
                  )}
                  {(quartier || type) && (
                    <Link href="/bars" className="text-accent hover:text-blue font-medium transition-colors">
                      Réinitialiser tous les filtres
                    </Link>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar with filters */}
              <div className="lg:w-1/4">
                <div className="sticky top-20 bg-surface rounded-lg shadow-md p-5 border border-primary/20">
                  <h2 className="text-xl font-bold text-text-light mb-4 flex items-center">
                    <FaFilter className="text-primary mr-2" />
                    Filtres
                  </h2>
                  
                  {/* Quartiers filter */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-secondary mb-3 flex items-center">
                      <FaMapMarked className="mr-2 text-highlight" />
                      Quartiers
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {quartier ? (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-text-light">
                            {quartier.replace('750', '')}e Arrondissement
                          </span>
                          <Link 
                            href="/bars"
                            className="text-accent hover:text-blue flex items-center"
                          >
                            <FaTimesCircle className="mr-1" />
                            Retirer
                          </Link>
                        </div>
                      ) : (
                        quartiers.map((q) => (
                          <Link 
                            key={q.id} 
                            href={`/bars?quartier=${q.id}`}
                            className={`flex justify-between items-center p-2 rounded-md transition-colors hover:bg-bg-dark hover:text-accent`}
                          >
                            <span className="text-text-light">{q.name}</span>
                            <span className="text-sm text-text-light opacity-70 bg-accent/20 px-2 py-0.5 rounded-full">
                              {q.count}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Types filter */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-secondary mb-3 flex items-center">
                      <FaGlassMartini className="mr-2 text-highlight" />
                      Types d'établissements
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {type ? (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-text-light">{type}</span>
                          <Link 
                            href="/bars"
                            className="text-accent hover:text-blue flex items-center"
                          >
                            <FaTimesCircle className="mr-1" />
                            Retirer
                          </Link>
                        </div>
                      ) : (
                        types.map((t) => (
                          <Link 
                            key={t.id} 
                            href={`/bars?type=${t.id}`}
                            className={`flex justify-between items-center p-2 rounded-md transition-colors hover:bg-bg-dark hover:text-accent`}
                          >
                            <span className="text-text-light">{t.name}</span>
                            <span className="text-sm text-text-light opacity-70 bg-accent/20 px-2 py-0.5 rounded-full">
                              {t.count}
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Reset filters */}
                  {(quartier || type) && (
                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <Link 
                        href="/bars"
                        className="w-full flex items-center justify-center bg-primary hover:bg-highlight text-white py-2 px-4 rounded-md transition-colors"
                      >
                        <FaTimesCircle className="mr-2" />
                        Réinitialiser les filtres
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Main content */}
              <div className="lg:w-3/4">


                {/* Grid de bars */}
                {barsForCurrentPage.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {barsForCurrentPage.map((bar) => {
                  const barType = bar.subtypes?.split(',')[0] || 'Bar';
                  
                  return (
                    <div 
                      key={bar.id}
                      className="bg-surface rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow border border-primary/20"
                    >
                      <Link href={`/bars/${bar.slug}`} className="block relative h-48 w-full overflow-hidden">
                        <Image
                          src={bar.photo || `/images/placeholder-bar-${(bar.id % 3) + 1}.jpg`}
                          alt={bar.name}
                          fill
                          className="object-cover transform hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {bar.rating && (
                          <div className="bg-secondary text-text-dark px-2 py-1 rounded text-sm font-bold flex items-center">
                            <FaStar className="text-primary mr-1" size={16} />
                            {bar.rating.toFixed(1)}
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                          {barType}
                        </div>
                      </Link>

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-text-light group-hover:text-accent transition-colors">
                          <Link href={`/bars/${bar.slug}`} className="hover:text-primary">
                            {bar.name}
                          </Link>
                        </h3>
                        <p className="text-text-light opacity-80 text-sm flex items-center">
                          <FaMapMarkerAlt className="mr-1 text-blue" size={12} />
                          {bar.postal_code?.substring(3, 5)}e arr.
                        </p>
                        <p className="mt-2 text-sm line-clamp-2 text-text-light opacity-90">
                          {bar.description || `Découvrez ${bar.name}, un établissement LGBT+ au cœur de Paris.`}
                        </p>
                      </div>
                    </div>
                  );
                })}
                  </div>
            ) : (
                  <div className="text-center py-12 bg-surface rounded-lg shadow-md border border-blue/20">
                    <h3 className="text-lg font-medium text-text-light mb-2">Aucun établissement ne correspond à vos critères</h3>
                    <p className="text-text-light opacity-80">Essayez de modifier ou réinitialiser les filtres</p>
                    <Link href="/bars" className="mt-4 inline-block text-accent hover:text-blue font-medium">
                {searchQuery ? "Effacer la recherche" : "Voir tous les établissements"}
              </Link>
                  </div>
            )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="flex items-center gap-1">
                  <Link
                    href={`/bars?page=${Math.max(1, currentPage - 1)}${quartier ? `&quartier=${quartier}` : ''}${type ? `&type=${type}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
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
                          href={`/bars?page=${i + 1}${quartier ? `&quartier=${quartier}` : ''}${type ? `&type=${type}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
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
                    href={`/bars?page=${Math.min(totalPages, currentPage + 1)}${quartier ? `&quartier=${quartier}` : ''}${type ? `&type=${type}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
