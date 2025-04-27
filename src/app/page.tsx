import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DynamicMap from "@/components/ui/DynamicMap";
import HeroSearch from "@/components/search/HeroSearch";
import BarsListSchemaOrg from "@/components/seo/BarsListSchemaOrg";
import { getBars, getQuartiers, getTypes } from "@/lib/supabase/client";

// Fonction pour obtenir les données à l'avance pour la page
export async function generateMetadata() {
  return {
    title: "Bars Gay Paris - Annuaire des établissements LGBT+ de Paris",
    description: "Découvrez le guide complet des meilleurs bars, clubs et établissements gay-friendly de Paris. Filtrez par quartier, type et explorez la carte interactive."
  };
}

// Récupérer les données depuis Supabase pour le rendu statique de la page
export const revalidate = 3600; // Revalider toutes les heures

export default async function Home() {
  // Récupérer les données réelles depuis Supabase
  const [allBars, quartiersData, typesData] = await Promise.all([
    getBars({ limite: 200 }),
    getQuartiers(),
    getTypes()
  ]);
  
  // Trier les quartiers par nombre d'établissements
  const quartiers = quartiersData.map(q => {
    // Compter les bars dans chaque quartier
    const count = allBars.filter(bar => 
      bar.postal_code && bar.postal_code.includes(q.id)
    ).length;
    
    // Extraire le numéro d'arrondissement réel (sans le préfixe 750)
    const arrondissement = q.id.startsWith('750') ? q.id.substring(3) : q.id;
    
    return { ...q, count, arrondissement };
  }).sort((a, b) => b.count - a.count).slice(0, 6); // Top 6 quartiers
  
  // Trier les types par nombre d'établissements
  const types = typesData.map(t => {
    // Compter les bars de chaque type
    const count = allBars.filter(bar => 
      bar.subtypes && bar.subtypes.includes(t.id)
    ).length;
    return { ...t, count };
  }).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 types
  
  // Sélectionner les bars les mieux notés pour la section "Tendance"
  const featuredBars = allBars
    .filter(bar => bar.rating && bar.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3); // Top 3 bars les mieux notés
  
  return (
    <>
      {/* Données structurées pour le SEO (Schema.org) */}
      <BarsListSchemaOrg bars={allBars.slice(0, 50)} baseUrl="https://bars-gay-paris.fr" />
      
      <Header />
      <main className="flex-grow">
        {/* Hero section avec recherche */}
        <section className="relative bg-gradient-to-br from-primary to-blue text-text-light py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                Découvrez les Bars Gay de Paris
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-text-light">
                Le guide complet des meilleurs établissements LGBT+ et queer friendly de la capitale
              </p>
              
              {/* Formulaire de recherche avec fonctionnalité AJAX */}
              <HeroSearch />
            </div>
          </div>

          {/* Vague décorative en bas de la section */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ transform: 'translateY(1px)' }}>
            <svg
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              fill="#0A0F29"
              className="w-full h-16 md:h-24"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
            </svg>
          </div>
        </section>

        {/* Carte interactive */}
        <section className="py-12 bg-bg-dark px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-text-light">Carte des Établissements</h2>
              <p className="mt-2 text-lg text-text-light opacity-80">Explorez les {allBars.length} lieux LGBT+ sur la carte de Paris</p>
            </div>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
              <DynamicMap bars={allBars.map(bar => ({
                id: bar.id,
                slug: bar.slug,
                name: bar.name,
                lat: bar.latitude,
                lng: bar.longitude,
                type: bar.type || bar.subtypes?.split(',')[0] || 'Bar',
              }))} />
            </div>
            <div className="mt-4 text-center">
              <Link 
                href="/carte"
                className="inline-flex items-center text-blue hover:text-highlight"
              >
                Voir la carte complète
                <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Bars en Vedette */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary">Bars en Vedette</h2>
              <p className="mt-2 text-lg text-text-light opacity-80">Notre sélection des meilleures adresses parisiennes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBars.map((bar) => (
                <Link 
                  key={bar.id} 
                  href={`/bars/${bar.slug}`}
                  className="block group"
                >
                  <div className="bg-surface rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-all border border-blue/20">
                    <div className="relative h-44 w-full bg-surface">
                      <Image
                        src={bar.photo || `/images/placeholder-bar-${(bar.id % 3) + 1}.jpg`}
                        alt={bar.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-text-light mb-1 group-hover:text-highlight transition-colors">{bar.name}</h3>
                      <p className="flex items-center text-text-light opacity-80 text-sm mb-2">
                        <FaMapMarkerAlt className="text-blue mr-1" />
                        {bar.postal_code ? `Paris ${bar.postal_code.replace(/[^0-9]/g, '')}` : 'Paris'}
                      </p>
                      <p className="text-text-light opacity-90 text-sm mb-3 line-clamp-2">
                        Découvrez {bar.name}, un établissement {bar.subtypes?.split(',')[0] || 'LGBT+'} au cœur de Paris. Consultez les détails pour en savoir plus.
                      </p>
                      <div className="mt-2">
                        <span className="bg-secondary inline-block px-2 py-1 text-xs text-text-dark font-semibold rounded">Nouveau</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link 
                href="/bars"
                className="inline-flex items-center justify-center px-6 py-3 border-none text-base font-medium rounded-md text-text-light bg-primary hover:bg-blue transition-colors shadow-md"
              >
                Voir tous les établissements
              </Link>
            </div>
          </div>
        </section>

        {/* Explorez par quartier */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-bg-dark text-text-light border-t border-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Explorez par Quartier</h2>
              <p className="mt-2 text-lg text-accent">Découvrez les meilleurs établissements par zone géographique</p>
            </div>
            
            {/* Liste des quartiers populaires */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {quartiers.slice(0, 8).map((quartier) => (
                <Link 
                  key={quartier.id} 
                  href={`/quartiers/${quartier.id}`}
                  className="px-4 py-3 bg-surface hover:bg-blue text-text-light rounded-lg transition-colors text-center group shadow-md"
                >
                  <span className="text-lg font-semibold block">{quartier.arrondissement}ème</span>
                  <span className="text-sm text-text-light opacity-80 group-hover:text-text-light transition-colors">{quartier.count} établissements</span>
                </Link>
              ))}
            </div>
            
            {/* Affichage des bars populaires */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-center text-secondary mb-6">
                Établissements populaires à Paris
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allBars
                  .filter(bar => bar.rating && bar.rating > 4.0)
                  .slice(0, 6)
                  .map(bar => (
                    <Link 
                      key={bar.id} 
                      href={`/bars/${bar.slug}`}
                      className="bg-surface hover:bg-surface/90 rounded-lg overflow-hidden flex flex-col transition-all border border-blue/30"
                    >
                      <div className="relative h-40 w-full bg-bg-dark">
                        <Image
                          src={bar.photo || `/images/placeholder-bar-${(parseInt(bar.id) % 3) + 1}.jpg`}
                          alt={bar.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="p-4 flex-grow">
                        <h3 className="font-bold text-text-light text-lg">{bar.name}</h3>
                        <p className="text-text-light opacity-80 text-sm mt-1">
                          <FaMapMarkerAlt className="inline mr-1" />
                          {bar.postal_code ? `Paris ${bar.postal_code.replace(/[^0-9]/g, '')}` : 'Paris'}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
            
            {/* Bouton Tout voir */}
            <div className="text-center">
              <Link
                href="/quartiers"
                className="inline-flex items-center justify-center px-6 py-3 border border-secondary text-base font-medium rounded-md text-text-light hover:bg-accent/80 transition-colors mt-8"
              >
                Voir tous les quartiers
                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
          </div>
        </section>

        {/* Explorez par type */}
        <section className="py-12 bg-bg-dark px-4 sm:px-6 lg:px-8 border-t border-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary">Explorez par Type</h2>
              <p className="mt-2 text-lg text-accent">Filtrez les établissements selon vos préférences</p>
            </div>

            {/* Liste des types principaux */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {types.slice(0, 3).map((type, index) => (
                <a 
                  key={type.id} 
                  href={`#type-content-${type.id}`}
                  className={`px-6 py-3 rounded-full ${index === 0 ? 'bg-primary text-text-light' : 'bg-surface hover:bg-blue hover:text-text-light text-text-light'} transition-colors text-center cursor-pointer shadow-md`}
                >
                  {type.name} ({type.count})
                </a>
              ))}
            </div>
            
            {/* Affichage des types populaires */}
            <div className="space-y-12">
              {types.slice(0, 3).map((type, index) => {
                // Filtrer les bars pour ce type
                const typeBars = allBars
                  .filter(bar => bar.subtypes && bar.subtypes.includes(type.id))
                  .slice(0, 6);
                  
                return (
                  <div key={type.id} id={`type-content-${type.id}`} className={`mb-8 ${index !== 0 ? 'mt-12 pt-12 border-t border-surface' : ''}`}>
                    <h3 className="text-xl font-bold text-center text-secondary mb-6">
                      Meilleurs {type.name}s à Paris
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {typeBars.map(bar => (
                        <Link 
                          key={bar.id} 
                          href={`/bars/${bar.slug}`}
                          className="bg-surface hover:bg-surface/90 rounded-lg overflow-hidden shadow-md hover:shadow-lg flex flex-col transition-all border border-blue/30"
                        >
                          <div className="relative h-40 w-full bg-bg-dark">
                            <Image
                              src={bar.photo || `/images/placeholder-bar-${(parseInt(bar.id) % 3) + 1}.jpg`}
                              alt={bar.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 flex-grow">
                            <h3 className="font-bold text-text-light text-lg">{bar.name}</h3>
                            <p className="text-text-light opacity-80 text-sm mt-1">
                              <FaMapMarkerAlt className="inline mr-1" />
                              {bar.address ? `${bar.address}, ${bar.postal_code}` : `${bar.postal_code} Paris`}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Bouton Tout voir */}
            <div className="text-center">
              <Link
                href="/types"
                className="inline-flex items-center justify-center px-6 py-3 border border-secondary text-base font-medium rounded-md text-secondary hover:bg-secondary/20 transition-colors mt-8 shadow-md"
              >
                Voir tous les types d'établissements
                <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-16 bg-gradient-to-br from-primary to-blue text-text-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à découvrir la scène LGBT+ parisienne ?</h2>
            <p className="text-lg max-w-3xl mx-auto mb-8 text-text-light opacity-90">
              Explorez notre guide complet des bars, clubs et établissements gay-friendly de Paris
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/bars" 
                className="px-6 py-3 bg-secondary text-text-dark font-medium rounded-md hover:bg-accent transition-colors shadow-md"
              >
                Voir tous les établissements
              </Link>
              <Link 
                href="/carte" 
                className="px-6 py-3 bg-highlight text-text-dark font-medium rounded-md hover:bg-blue transition-colors shadow-md"
              >
                Explorer la carte
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
