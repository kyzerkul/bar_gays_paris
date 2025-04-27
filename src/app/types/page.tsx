import Image from 'next/image';
import Link from 'next/link';
import { FaListUl, FaMapMarkedAlt, FaSearch, FaRegCalendarAlt } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getTypes, getBars } from '@/lib/supabase/client';

// Métadonnées de la page
export async function generateMetadata() {
  return {
    title: "Types d'établissements LGBT+ à Paris - Bars Gay Paris",
    description: "Découvrez tous les types d'établissements LGBT+ à Paris: bars, clubs, restaurants, cafés et plus encore. Guide complet pour trouver le lieu idéal selon vos envies."
  };
}

export const revalidate = 3600; // Revalider toutes les heures

// Interface pour la description des types d'établissements
interface TypeDescription {
  description: string;
  atmosphere: string;
  bestFor: string[];
}

export default async function TypesPage() {
  // Récupération des types d'établissements
  const types = await getTypes();
  const allBars = await getBars({});
  const totalBars = allBars.length;
  
  // Icônes pour chaque type d'établissement
  const typeIcons: Record<string, string> = {
    bar: '/icons/bar.svg',
    club: '/icons/club.svg',
    restaurant: '/icons/restaurant.svg',
    cafe: '/icons/cafe.svg',
    hotel: '/icons/hotel.svg',
    sauna: '/icons/sauna.svg',
    default: '/icons/default.svg'
  };
  
  // Descriptions personnalisées pour chaque type d'établissement
  const typeDescriptions: Record<string, TypeDescription> = {
    bar: {
      description: "Les bars gay-friendly de Paris sont connus pour leur ambiance chaleureuse et accueillante.",
      atmosphere: "Détendue et sociale",
      bestFor: ["Apéritifs entre amis", "Soirées décontractées", "Rencontres"],
    },
    club: {
      description: "Les clubs LGBT+ parisiens offrent une expérience nocturne vibrante avec musique et danse.",
      atmosphere: "Festive et animée",
      bestFor: ["Danser toute la nuit", "Événements spéciaux", "Performances"],
    },
    restaurant: {
      description: "Les restaurants gay-friendly de Paris proposent une cuisine variée dans un cadre inclusif.",
      atmosphere: "Conviviale et gastronomique",
      bestFor: ["Dîners romantiques", "Repas entre amis", "Brunches du dimanche"],
    },
    cafe: {
      description: "Les cafés LGBT+ parisiens sont parfaits pour des moments de détente autour d'un bon café ou thé.",
      atmosphere: "Détendue et calme",
      bestFor: ["Travail à distance", "Lecture", "Rencontres informelles"],
    },
    hotel: {
      description: "Les hôtels gay-friendly de Paris offrent un hébergement confortable et accueillant.",
      atmosphere: "Élégante et discrète",
      bestFor: ["Séjours romantiques", "Tourisme", "Week-ends en ville"],
    },
    sauna: {
      description: "Les saunas gay de Paris proposent des espaces de détente et de bien-être dans un environnement discret.",
      atmosphere: "Relaxante et intime",
      bestFor: ["Détente", "Bien-être", "Rencontres"],
    }
  };
  
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-[#0A0F29] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Guide des Établissements LGBT+ à Paris
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6 text-white/90">
                Explorez la diversité des lieux gay-friendly à Paris en fonction de vos envies
              </p>
              <div className="flex items-center justify-center space-x-6 mb-8 text-white">
                <div className="flex items-center bg-[#FF2A6D]/20 px-4 py-2 rounded-full">
                  <FaMapMarkedAlt className="mr-2 text-[#FF2A6D]" />
                  <span>{types.length} types d'établissements</span>
                </div>
                <div className="flex items-center bg-[#FFD600]/20 px-4 py-2 rounded-full">
                  <FaSearch className="mr-2 text-[#FFD600]" />
                  <span>{totalBars} établissements au total</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vague décorative en bas de la section */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ transform: 'translateY(1px)' }}>
            <svg
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              fill="#090d25"
              className="w-full h-12"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
            </svg>
          </div>
        </section>
        
        {/* Liste des types d'établissements */}
        <section className="py-12 bg-[#090d25]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Explorer par Type d'Établissement</h2>
              <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10">
                Chaque type d'établissement offre une expérience unique. Sélectionnez un type ci-dessous pour découvrir les établissements correspondants.
              </p>
            </div>

            <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-4 mb-12">
              {types.map((type) => {
                const typeId = type.id.toLowerCase();
                const iconSrc = typeIcons[typeId] || typeIcons.default;
                let bgColor, borderColor, iconBgColor, textColor;
                
                // Rotation des couleurs pour les différents types d'établissements
                switch(typeId) {
                  case 'bar':
                    bgColor = 'bg-[#FF2A6D]/10';
                    borderColor = 'border-[#FF2A6D]/30';
                    iconBgColor = 'bg-[#FF2A6D]/20';
                    textColor = 'text-[#FF2A6D]';
                    break;
                  case 'club':
                    bgColor = 'bg-[#FFD600]/10';
                    borderColor = 'border-[#FFD600]/30';
                    iconBgColor = 'bg-[#FFD600]/20';
                    textColor = 'text-[#FFD600]';
                    break;
                  case 'restaurant':
                    bgColor = 'bg-[#FF7D00]/10';
                    borderColor = 'border-[#FF7D00]/30';
                    iconBgColor = 'bg-[#FF7D00]/20';
                    textColor = 'text-[#FF7D00]';
                    break;
                  case 'cafe':
                    bgColor = 'bg-[#05D9B2]/10';
                    borderColor = 'border-[#05D9B2]/30';
                    iconBgColor = 'bg-[#05D9B2]/20';
                    textColor = 'text-[#05D9B2]';
                    break;
                  case 'hotel':
                    bgColor = 'bg-[#1A76FF]/10';
                    borderColor = 'border-[#1A76FF]/30';
                    iconBgColor = 'bg-[#1A76FF]/20';
                    textColor = 'text-[#1A76FF]';
                    break;
                  default:
                    bgColor = 'bg-[#FF2A6D]/10';
                    borderColor = 'border-[#FF2A6D]/30';
                    iconBgColor = 'bg-[#FF2A6D]/20';
                    textColor = 'text-[#FF2A6D]';
                }
                
                return (
                  <Link 
                    key={`filter-${type.id}`}
                    href={`/types/${type.id}`}
                    className={`group flex items-center px-6 py-4 rounded-xl ${bgColor} shadow-lg hover:shadow-xl border ${borderColor} transition-all hover:scale-105 duration-200`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 ${iconBgColor} rounded-full mr-4 p-2.5 flex items-center justify-center group-hover:${iconBgColor.replace('/20', '/30')} transition-colors`}>
                      <Image 
                        src={typeIcons[typeId] || typeIcons.default}
                        alt={type.name}
                        width={30}
                        height={30}
                        className={textColor}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className={`font-bold text-white group-hover:${textColor} transition-colors`}>Bars gays {type.name}</div>
                      <div className="text-sm text-white/70">{type.count} établissements</div>
                    </div>
                    <div className={`flex-shrink-0 ${textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center mt-16 mb-8">
              <Link 
                href="/carte" 
                className="inline-flex items-center px-8 py-4 bg-[#1A76FF] text-white font-medium rounded-lg hover:bg-[#1A76FF]/90 transition-colors shadow-md"
              >
                <FaMapMarkedAlt className="mr-2" />
                Voir tous les établissements sur la carte
              </Link>
            </div>
          </div>
        </section>
        
        {/* FAQ section */}
        <section className="py-12 bg-[#0A0F29]/90 border-t border-[#FF2A6D]/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
            
            <div className="space-y-6">
              <div className="bg-[#0A0F29]/70 rounded-lg p-6 shadow-md border border-[#FF2A6D]/20">
                <h3 className="text-xl font-bold text-[#FF2A6D] mb-2">Quelle est la différence entre un bar et un club gay ?</h3>
                <p className="text-white/80">
                  Les bars gay à Paris sont généralement des endroits plus détendus pour prendre un verre et discuter, tandis que les clubs sont orientés vers la danse et la musique, souvent avec des horaires plus tardifs. Les clubs proposent fréquemment des soirées à thème et des performances.                  
                </p>
              </div>
              
              <div className="bg-[#0A0F29]/70 rounded-lg p-6 shadow-md border border-[#FFD600]/20">
                <h3 className="text-xl font-bold text-[#FFD600] mb-2">Où trouver les meilleurs établissements LGBT+ à Paris ?</h3>
                <p className="text-white/80">
                  Le Marais (3ème et 4ème arrondissements) abrite la plus forte concentration d'établissements LGBT+ de Paris. Cependant, vous trouverez des lieux gay-friendly dans toute la ville, notamment dans les quartiers comme Montmartre, Pigalle, et Oberkampf.                  
                </p>
              </div>
              
              <div className="bg-[#0A0F29]/70 rounded-lg p-6 shadow-md border border-[#05D9B2]/20">
                <h3 className="text-xl font-bold text-[#05D9B2] mb-2">Les restaurants gay-friendly ont-ils une cuisine particulière ?</h3>
                <p className="text-white/80">
                  Les restaurants gay-friendly à Paris proposent une grande variété de cuisines, de la gastronomie française aux spécialités internationales. Ce qui les distingue est plutôt leur ambiance inclusive et accueillante que leur type de cuisine.                  
                </p>
              </div>
            </div>
          </div>
        </section>
          
        {/* Call to action */}
        <section className="py-12 bg-[#090d25]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Envie d'explorer autrement ?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
              Découvrez les établissements par quartier ou consultez la carte pour trouver les bars près de chez vous
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                href="/quartiers" 
                className="px-6 py-3 bg-[#FF2A6D] text-white font-medium rounded-md hover:bg-[#FF2A6D]/90 transition-colors shadow-md"
              >
                Explorer par quartier
              </Link>
              <Link 
                href="/carte" 
                className="px-6 py-3 bg-[#05D9B2] text-white font-medium rounded-md hover:bg-[#05D9B2]/90 transition-colors shadow-md"
              >
                Voir la carte interactive
              </Link>
              <Link 
                href="/" 
                className="px-6 py-3 bg-[#FF7D00] text-white font-medium rounded-md hover:bg-[#FF7D00]/90 transition-colors shadow-md"
              >
                Découvrir les tendances
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
