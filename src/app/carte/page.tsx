import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DynamicMap from '@/components/ui/DynamicMap';
import { getBars } from '@/lib/supabase/client';
import Link from 'next/link';
import { FaList, FaMapMarkedAlt } from 'react-icons/fa';

// Métadonnées statiques pour le référencement
export const metadata = {
  title: 'Carte des bars gay de Paris | Bars Gay Paris',
  description: 'Découvrez tous les bars gay de Paris sur une carte interactive. Navigation simple et intuitive pour trouver les établissements LGBT+ près de chez vous.'
};

export default async function CartePage() {
  // Récupérer tous les bars pour les afficher sur la carte
  const allBars = await getBars({ limite: 1000 });
  
  // Préparer les bars pour l'affichage sur la carte
  const barMarkers = allBars.map(bar => ({
    id: bar.id,
    name: bar.name,
    slug: bar.slug,
    lat: bar.latitude,
    lng: bar.longitude,
    type: bar.subtypes?.split(',')[0] || 'Bar',
    description: bar.seo_description || `Découvrez ${bar.name}, un établissement LGBT+ à Paris.`,
    address: bar.full_address || `${bar.address || ''} ${bar.postal_code || ''} Paris`
  }));
  
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary to-blue text-text-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Carte des bars gay de Paris</h1>
            <p className="mt-3 text-lg max-w-3xl mx-auto opacity-90">
              Explorez visuellement tous les établissements LGBT+ de la capitale
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
        
        {/* Map section */}
        <section className="py-10 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end mb-4">
              <Link 
                href="/bars"
                className="inline-flex items-center px-5 py-2 bg-surface rounded-md text-text-light border border-primary/20 hover:bg-bg-dark transition-colors"
              >
                <FaList className="mr-2" />
                Voir en liste
              </Link>
            </div>
            
            <div className="bg-surface rounded-lg p-1 shadow-lg border border-primary/20 overflow-hidden">
              {/* Carte interactive */}
              <DynamicMap 
                bars={barMarkers} 
                height="calc(100vh - 300px)" 
                fullScreen={true}
                zoom={13}
              />
            </div>
            
            <div className="mt-6 text-center text-text-light opacity-80 text-sm">
              <p>Cliquez sur un marqueur pour voir les détails de l'établissement</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
