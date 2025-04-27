import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DynamicMap from '@/components/ui/DynamicMap';
import QuartierImage from '@/components/ui/QuartierImage';
import { getBars, getQuartiers } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';

// Types pour les métadonnées et les props
interface QuartierPageProps {
  params: {
    quartier: string;
  };
}

// Générer les métadonnées de la page
export async function generateMetadata({ params }: QuartierPageProps) {
  const { quartier: quartierId } = params;
  
  // Trouver le quartier correspondant
  const quartiers = await getQuartiers();
  const quartier = quartiers.find(q => q.id === quartierId);
  
  if (!quartier) {
    return {
      title: "Quartier non trouvé | Bars Gay Paris",
      description: "Ce quartier n'existe pas dans notre annuaire des bars gay de Paris."
    };
  }
  
  return {
    title: `${quartier.name} - Bars et clubs gay | Bars Gay Paris`,
    description: `Découvrez les meilleurs bars et établissements LGBT+ dans le ${quartier.name}. Guide complet des spots gay-friendly à Paris.`
  };
}

// Générer les params statiques pour les routes
export async function generateStaticParams() {
  const quartiers = await getQuartiers();
  return quartiers.map(quartier => ({
    quartier: quartier.id,
  }));
}

export const revalidate = 3600; // Revalider toutes les heures

export default async function QuartierDetailPage({ params }: QuartierPageProps) {
  const { quartier: quartierId } = params;
  
  // Récupérer les données
  const quartiers = await getQuartiers();
  const quartier = quartiers.find(q => q.id === quartierId);
  
  // Vérifier si le quartier existe
  if (!quartier) {
    notFound();
  }
  
  // Récupérer les bars de ce quartier
  const allBars = await getBars({});
  const quartierBars = allBars.filter(bar => {
    // Si nous utilisons un code postal complet (ex: 75001)
    if (quartierId.length === 5) {
      return bar.postal_code && bar.postal_code.includes(quartierId);
    } 
    // Si nous utilisons juste le code d'arrondissement (ex: 01, 02, etc.)
    else {
      return bar.postal_code && bar.postal_code.includes(`75${quartierId}`);
    }
  });
  
  // Création des marqueurs pour la carte
  const barMarkers = quartierBars.map(bar => ({
    id: bar.id,
    name: bar.name,
    slug: bar.slug,
    lat: bar.latitude,
    lng: bar.longitude,
    type: bar.subtypes?.split(',')[0] || 'Bar'
  }));
  
  // Centre de la carte (moyenne des coordonnées ou position par défaut)
  const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris
  
  // Extraire le code d'arrondissement pour l'affichage des images
  const arrondissementCode = quartierId.length === 5 ? quartierId.substring(3, 5) : quartierId;
  
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-gradient-to-br from-primary to-blue text-text-light py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link href="/quartiers" className="text-text-light hover:text-secondary transition-colors flex items-center">
                <FaArrowLeft className="mr-2" /> Tous les quartiers
              </Link>
            </div>
            <div className="text-center md:text-left md:flex md:justify-between md:items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Bars gays dans le {quartier.name}
                </h1>
                <p className="text-text-light opacity-80 mb-4 text-center md:text-left max-w-3xl mx-auto md:mx-0">
                  {quartierBars.length} établissements LGBT+ à découvrir dans cet arrondissement
                </p>
              </div>
            </div>
          </div>
          
          {/* Vague décorative en bas de la section */}
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
        
        {/* Contenu principal */}
        <section className="py-16 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Liste des établissements */}
            <div className="w-full">
                <h2 className="text-2xl font-bold text-secondary mb-6">
                  Établissements dans le {quartier.name}
                </h2>
                
                {quartierBars.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quartierBars.map(bar => (
                      <Link href={`/bars/${bar.slug}`} key={bar.id} className="block">
                        <div className="bg-surface h-full rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-primary/20">
                          <div className="relative h-48 bg-gray-200">
                            {bar.photo ? (
                              <Image 
                                src={bar.photo}
                                alt={`Photo de ${bar.name}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                              />
                            ) : (
                              <Image 
                                src={`/images/placeholder-bar-${parseInt(bar.id) % 3 + 1}.jpg`}
                                alt={`Photo de ${bar.name}`}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-xl font-bold text-secondary mb-1">{bar.name}</h3>
                            <span className="inline-block bg-bg-dark rounded-full px-3 py-1 text-xs font-semibold text-text-light mr-2 mb-2">
                              {bar.subtypes?.split(',')[0]}
                            </span>
                            <p className="text-text-light text-sm mb-2 flex items-start">
                              <FaMapMarkerAlt className="text-blue mr-1 mt-1 flex-shrink-0" />
                              <span>{bar.address || ""} {bar.postal_code}</span>
                            </p>
                            <p className="text-text-light opacity-90 text-sm mb-4 line-clamp-2">
                              {bar.seo_description || `Découvrez ${bar.name}, un établissement LGBT+ situé dans le ${quartier.name}.`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-surface rounded-lg p-8 text-center border border-blue/20">
                    <p className="text-text-light opacity-80">Aucun établissement trouvé dans ce quartier.</p>
                  </div>
                )}
              </div>
            </div>
        </section>
        
        {/* Carte et grille */}
        <section className="py-12 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
              Établissements dans le {quartier.name}
            </h2>
            
            {barMarkers.length > 0 && (
              <div className="mb-12">
                <div className="bg-surface rounded-lg shadow-md overflow-hidden mb-4 border border-primary/20">
                  <DynamicMap 
                    bars={barMarkers} 
                    height="500px"
                    zoom={14}
                  />
                </div>
                <p className="text-center text-text-light opacity-70 text-sm">
                  Cliquez sur un marqueur pour consulter plus d'informations
                </p>
              </div>
            )}
            
            {/* Autres quartiers */}
            <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
              Autres quartiers à explorer
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quartiers
                .filter(q => q.id !== quartierId)
                .slice(0, 4)
                .map(quartier => (
                  <Link 
                    key={quartier.id}
                    href={`/quartiers/${quartier.id}`}
                    className="group"
                  >
                    <div className="bg-surface rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-primary/20">
                      <div className="relative h-32">
                        <QuartierImage
                          quartierCode={quartier.id.length === 5 ? quartier.id.substring(3, 5) : quartier.id}
                          quartierName={quartier.name}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <h3 className="text-text-light font-bold text-lg">{quartier.name}</h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link
                href="/quartiers"
                className="inline-flex items-center justify-center px-5 py-3 border-none rounded-md shadow-md text-sm font-medium text-text-light bg-accent hover:bg-blue transition-colors"
              >
                Voir tous les quartiers
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
