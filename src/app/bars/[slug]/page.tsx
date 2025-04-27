import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

// Extension pour capitaliser la première lettre
declare global {
  interface String {
    capitalize(): string;
  }
}

// Implémentation de capitalize
if (!String.prototype.capitalize) {
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
}
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaPhone, 
  FaGlobe, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter,
  FaCalendarAlt,
  FaEuroSign,
  FaCheck,
  FaTimes,
  FaComments,
  FaUtensils,
  FaWineGlassAlt,
  FaCocktail,
  FaUsers,
  FaToilet,
  FaParking,
  FaCreditCard,
  FaCogs,
  FaMinus,
  FaInfoCircle
} from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DynamicMap from '@/components/ui/DynamicMap';
import BarSchemaOrg from '@/components/seo/BarSchemaOrg';
import { getBarBySlug, getSimilarBars } from '@/lib/supabase/client';
import { notFound } from 'next/navigation';

// Types
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Destructurer le slug pour éviter l'erreur d'utilisation synchrone
  const { slug } = params;
  const bar = await getBarBySlug(slug);
  
  if (!bar) {
    return {
      title: 'Bar non trouvé | Bars Gay Paris',
      description: 'La page demandée n\'a pas été trouvée.'
    };
  }
  
  return {
    title: `${bar.name} | Bars Gay Paris`,
    description: bar.seo_description || bar.description || `Découvrez ${bar.name}, un établissement LGBT+ à Paris. Adresse, horaires, et ambiance.`
  };
}

export default async function BarDetailPage({ params }: { params: { slug: string } }) {
  // Construire l'URL complète pour le SEO
  const fullUrl = `https://bars-gay-paris.fr/bars/${params.slug}`;
  
  // Destructurer le slug pour éviter l'erreur d'utilisation synchrone
  const { slug } = params;
  const bar = await getBarBySlug(slug);
  
  if (!bar) {
    notFound();
  }
  
  // Formatter les données pour l'affichage
  const address = bar.full_address || `${bar.address || ''} ${bar.postal_code || ''} Paris`;
  const barTypes = bar.subtypes?.split(',').map((t: string) => t.trim()) || [];
  
  // Récupérer des bars similaires
  const similarBars = await getSimilarBars({
    barId: bar.id,
    types: barTypes,
    postalCode: bar.postal_code,
    limit: 3
  });
  const mainType = barTypes[0] || 'Bar';
  
  // Pour la carte
  const barMarker = {
    id: bar.id,
    name: bar.name,
    slug: bar.slug,
    lat: bar.latitude,
    lng: bar.longitude,
    type: mainType
  };
  
  // Photo principale de l'établissement
  const mainPhoto = bar.photo || '/images/placeholder-bar-1.jpg';
  
  // Interpréter les gammes de prix avec le symbole euro
  let priceRange = '';
  if (bar.range) {
    // La valeur range peut être déjà au format symbole (€, €€, €€€)
    if (bar.range === '€' || bar.range === '1') {
      priceRange = '€';
    } else if (bar.range === '€€' || bar.range === '2') {
      priceRange = '€€';
    } else if (bar.range === '€€€' || bar.range === '3') {
      priceRange = '€€€';
    } else {
      // S'il s'agit d'une autre valeur, l'utiliser directement
      priceRange = bar.range;
    }
  } else {
    priceRange = 'Prix non précisé';
  }
  
  // Traiter les services JSON
  let services = {};
  try {
    if (bar.attributes && typeof bar.attributes === 'string') {
      services = JSON.parse(bar.attributes);
    } else if (bar.attributes && typeof bar.attributes === 'object') {
      services = bar.attributes;
    }
  } catch (e) {
    console.error('Erreur dans le parsing des attributs:', e);
    services = {};
  }
  
  // Utilisons des valeurs statiques pour éviter les erreurs d'hydratation
  // Note: Pour une vraie app en production, on gérerait cela côté client uniquement
  // Commencer par lundi comme demandé
  // Utiliser les jours en français puisque c'est ainsi qu'ils sont stockés dans la base de données
  const daysMap = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  
  // Utiliser la date réelle du système
  const now = new Date();
  // Convertir de 0-6 (dimanche-samedi) à 0-6 (lundi-dimanche)
  const staticToday = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 = lundi, 6 = dimanche
  
  // Débogage - afficher le contenu de working_hours pour comprendre sa structure
  console.log('Bar details:', bar.name, bar.slug);
  console.log('Working hours type:', typeof bar.working_hours);
  console.log('Working hours content:', bar.working_hours);
  
  // Extraction des horaires à partir du format JSON ou de l'objet
  let parsedHours: Record<string, string> = {};
  let todayHours = 'Non précisé';
  
  try {
    if (bar.working_hours) {
      // Si c'est une chaîne JSON, parser
      if (typeof bar.working_hours === 'string') {
        parsedHours = JSON.parse(bar.working_hours);
      } 
      // Si c'est déjà un objet
      else if (typeof bar.working_hours === 'object') {
        parsedHours = bar.working_hours;
      }
      
      // Si parsedHours n'est toujours pas un objet, vérifier si bar.attributes contient les horaires
      if (!parsedHours || Object.keys(parsedHours).length === 0) {
        try {
          if (bar.attributes && typeof bar.attributes === 'string') {
            const attrs = JSON.parse(bar.attributes);
            if (attrs.opening_hours) {
              parsedHours = attrs.opening_hours;
            }
          } else if (bar.attributes && typeof bar.attributes === 'object' && bar.attributes.opening_hours) {
            parsedHours = bar.attributes.opening_hours;
          }
        } catch (e) {
          console.error('Erreur parsing attributes:', e);
        }
      }
      
      console.log('Parsed hours:', parsedHours);
      
      // Déterminer l'horaire d'aujourd'hui
      const todayName = daysMap[staticToday];
      console.log('Today name:', todayName);
      
      // Chercher avec le nom exact, pas besoin de variantes puisque les jours sont en français dans la base
      // et nous utilisons maintenant des noms de jours en français
      const variants = [
        todayName  // 'samedi'
      ];
      
      // Essayer toutes les variantes de noms de jours
      for (const variant of variants) {
        if (parsedHours[variant]) {
          todayHours = parsedHours[variant];
          break;
        }
      }
    }
  } catch (e) {
    console.error('Erreur dans le traitement des horaires:', e);
  }

  return (
    <>
      {/* Intégration des données structurées Schema.org */}
      <BarSchemaOrg bar={bar} url={fullUrl} />
      
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-blue text-text-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold">{bar.name}</h1>
                <p className="mt-2 flex items-center text-lg">
                  <FaMapMarkerAlt className="mr-2" />
                  {address}
                </p>
              </div>
              <div className="flex flex-col items-end">
                {bar.rating ? (
                  <Link 
                    href={bar.reviews_link || '#'} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="flex items-center bg-secondary text-text-dark px-4 py-2 rounded-lg hover:bg-accent transition-colors shadow-lg text-lg"
                  >
                    <FaStar className="text-primary text-xl mr-2" />
                    <span className="font-bold">{bar.rating.toFixed(1)}</span>
                    <span className="text-text-dark text-sm ml-1">
                      ({bar.reviews || 0} avis)
                    </span>
                    <FaComments className="ml-2 text-primary" />
                  </Link>
                ) : (
                  <div className="bg-highlight text-text-dark px-4 py-2 rounded-lg text-lg font-medium shadow-lg">
                    Nouveau
                  </div>
                )}
                <div className="mt-2 text-sm">
                  {barTypes.map((type: string, index: number) => (
                    <Link
                      key={type}
                      href={`/types/${encodeURIComponent(type)}`}
                      className="inline-block bg-accent hover:bg-primary px-2 py-1 rounded mr-2 mb-1 text-text-light"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
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

        {/* Content section */}
        <section className="py-12 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main information */}
              <div className="lg:col-span-2">
                {/* Main photo */}
                <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-md mb-8">
                  <Image
                    src={mainPhoto}
                    alt={bar.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                    className="object-cover"
                  />
                </div>

                {/* Description */}
                <div className="bg-highlight p-6 rounded-lg shadow-lg mb-8 border-l-4 border-primary">
                  <h2 className="text-2xl font-bold text-text-dark mb-4 flex items-center">
                    <FaInfoCircle className="text-primary mr-3" />
                    Description
                  </h2>
                  <p className="text-text-dark text-lg leading-relaxed">
                    {bar.seo_description ? 
                      (bar.seo_description.includes('{"Services disponi') ?
                        bar.seo_description.split('{"Services disponi')[0].trim() :
                        bar.seo_description)
                      : `Découvrez ${bar.name}, un établissement unique situé au cœur de Paris. Profitez d'une ambiance chaleureuse et accueillante dans ce lieu emblématique de la scène LGBT+ parisienne.`
                    }
                  </p>
                </div>
                
                {/* Services et équipements */}
                <div className="bg-highlight p-6 rounded-lg shadow-lg mb-6 border-l-4 border-accent">
                  <h2 className="text-2xl font-bold text-text-dark mb-4 flex items-center">
                    <FaCogs className="text-primary mr-3" /> 
                    Services et équipements
                  </h2>
                  
                  {/* Affichage des services à partir de la colonne 'about' en tant que JSON */}
                  {bar.about ? (
                    <div className="py-2">
                      {(() => {
                        try {
                          // Essayer de parser le JSON
                          const aboutData = JSON.parse(bar.about);
                          // Récupération de toutes les catégories et leurs items dans un format plat pour une seule section
                          const allServices = [];
                          
                          Object.entries(aboutData as Record<string, any>).forEach(([category, items]) => {
                            if (typeof items === 'object' && items !== null && !Array.isArray(items)) {
                              const categoryName = category.replace(/[{}"']*/g, '');
                              
                              Object.entries(items).forEach(([item, value]) => {
                                const serviceItem = {
                                  category: categoryName,
                                  name: item.replace(/[{}"']*/g, ''),
                                  value: value,
                                };
                                allServices.push(serviceItem);
                              });
                            }
                          });
                          
                          // Regrouper les services par catégorie pour affichage en une seule section
                          const servicesByCategory = {};
                          allServices.forEach(service => {
                            if (!servicesByCategory[service.category]) {
                              servicesByCategory[service.category] = [];
                            }
                            servicesByCategory[service.category].push(service);
                          });
                          
                          return (
                            <div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                {Object.entries(servicesByCategory).map(([category, services]) => (
                                  <div key={category} className="bg-surface/50 rounded-lg p-4">
                                    <h3 className="font-semibold text-lg text-secondary mb-3 capitalize border-b border-primary/20 pb-2">
                                      {category}
                                    </h3>
                                    <ul className="space-y-2">
                                      {services.map((service, index) => (
                                        <li key={index} className="flex items-center p-2 rounded-md hover:bg-highlight/20 transition-colors">
                                          {service.value === true ? (
                                            <span className="flex items-center justify-center bg-green-100 text-green-600 rounded-full p-1 mr-3 w-6 h-6">
                                              <FaCheck className="flex-shrink-0 h-3 w-3" />
                                            </span>
                                          ) : service.value === false ? (
                                            <span className="flex items-center justify-center bg-red-100 text-red-600 rounded-full p-1 mr-3 w-6 h-6">
                                              <FaTimes className="flex-shrink-0 h-3 w-3" />
                                            </span>
                                          ) : (
                                            <span className="flex items-center justify-center bg-gray-100 text-gray-500 rounded-full p-1 mr-3 w-6 h-6">
                                              <FaMinus className="flex-shrink-0 h-3 w-3" />
                                            </span>
                                          )}
                                          <span className="text-text-dark">{service.name}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        } catch (e) {
                          // En cas d'erreur de parsing, afficher un message simple
                          return (
                            <div>
                              <ul className="space-y-2">
                                {bar.about.split('\n').map((line, index) => {
                                  if (line.trim() === '') return null;
                                  return (
                                    <li key={index} className="flex items-center p-2 hover:bg-highlight/20 rounded-md transition-colors">
                                      <span className="flex items-center justify-center bg-green-100 text-green-600 rounded-full p-1 mr-3 w-6 h-6">
                                        <FaCheck className="flex-shrink-0 h-3 w-3" />
                                      </span>
                                      <span className="text-text-dark">{line.trim()}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="bg-surface/50 p-4 rounded-lg text-center">
                      <FaInfoCircle className="text-primary text-4xl mx-auto mb-2" />
                      <p className="text-text-dark italic py-3">Aucune information sur les services n'est disponible.</p>
                    </div>
                  )}
                </div>


              </div>

              {/* Sidebar information */}
              <div className="lg:col-span-1">
                {/* Contact & Social */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Contact & Informations</h2>
                  
                  {/* Gamme de prix */}
                  <div className="flex items-center mb-3">
                    <FaEuroSign className="text-primary mr-3" />
                    <span className="text-gray-700">{priceRange}</span>
                  </div>
                  
                  {bar.phone && (
                    <div className="flex items-center mb-3">
                      <FaPhone className="text-primary mr-3" />
                      <a href={`tel:${bar.phone}`} className="text-gray-700 hover:text-primary">
                        {bar.phone}
                      </a>
                    </div>
                  )}

                  {bar.site && (
                    <div className="flex items-center mb-3">
                      <FaGlobe className="text-primary mr-3" />
                      <a 
                        href={bar.site.startsWith('http') ? bar.site : `https://${bar.site}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-primary"
                      >
                        Site officiel
                      </a>
                    </div>
                  )}
                  
                  {bar.email_1 && (
                    <div className="flex items-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a 
                        href={`mailto:${bar.email_1}`} 
                        className="text-gray-700 hover:text-primary"
                      >
                        {bar.email_1}
                      </a>
                    </div>
                  )}


                  {/* Social links */}
                  <div className="mt-5">
                    <h3 className="font-medium text-gray-900 mb-2">Réseaux sociaux</h3>
                    <div className="flex gap-3">
                      {bar.facebook && (
                        <a 
                          href={bar.facebook.startsWith('http') ? bar.facebook : `https://facebook.com/${bar.facebook}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <FaFacebook size={24} />
                        </a>
                      )}
                      {bar.instagram && (
                        <a 
                          href={bar.instagram.startsWith('http') ? bar.instagram : `https://instagram.com/${bar.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-pink-600"
                        >
                          <FaInstagram size={24} />
                        </a>
                      )}
                      {bar.twitter && (
                        <a 
                          href={bar.twitter.startsWith('http') ? bar.twitter : `https://twitter.com/${bar.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-400"
                        >
                          <FaTwitter size={24} />
                        </a>
                      )}
                      {!bar.facebook && !bar.instagram && !bar.twitter && (
                        <p className="text-gray-500 text-sm">Aucun réseau social renseigné</p>
                      )}
                    </div>
                  </div>
                </div>


                {/* Lien de réservation */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <FaCalendarAlt className="text-yellow-500 mr-2" />
                    Lien de réservation
                  </h2>
                  
                  {bar.reservation_link ? (
                    <a 
                      href={bar.reservation_link.startsWith('http') ? bar.reservation_link : `https://${bar.reservation_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <FaCalendarAlt className="mr-2" /> Réserver une table
                    </a>
                  ) : bar.booking_appointment_link ? (
                    <a 
                      href={bar.booking_appointment_link.startsWith('http') ? bar.booking_appointment_link : `https://${bar.booking_appointment_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <FaCalendarAlt className="mr-2" /> Prendre rendez-vous
                    </a>
                  ) : bar.order_link ? (
                    <a 
                      href={bar.order_link.startsWith('http') ? bar.order_link : `https://${bar.order_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <FaCalendarAlt className="mr-2" /> Commander en ligne
                    </a>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 italic">Aucune réservation en ligne disponible</span>
                    </div>
                  )}
                </div>

                {/* Hours */}
                <div className="bg-surface p-6 rounded-lg shadow-lg mb-8 border-l-4 border-yellow-500">
                  <h2 className="text-xl font-bold text-text-light mb-4 flex items-center">
                    <FaCalendarAlt className="text-yellow-500 mr-2" />
                    Horaires d'ouverture
                  </h2>
                  <div className="bg-yellow-50 p-4 rounded-md mb-5 flex items-center border border-yellow-200">
                    <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold">{staticToday + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-800">Aujourd'hui • {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][staticToday]}</p>
                      <p className="text-yellow-700 font-medium">{todayHours}</p>
                    </div>
                  </div>
                  {/* Tous les horaires */}
                  <div className="rounded-md overflow-hidden border border-gray-100">
                    {daysMap.map((day: string, index: number) => {
                      const frenchDay = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][index];
                      
                      // Utiliser les horaires déjà parsés plus haut
                      let hours = 'Non précisé';
                      
                      // Chercher avec le nom exact en français
                      const variants = [
                        day  // 'lundi'
                      ];
                      
                      // Essayer toutes les variantes de noms de jours
                      for (const variant of variants) {
                        if (parsedHours[variant]) {
                          hours = parsedHours[variant];
                          break;
                        }
                      }
                      
                      const isToday = index === staticToday;
                      
                      return (
                        <div 
                          key={day}
                          className={`flex justify-between items-center py-2.5 px-3 ${isToday ? 'bg-yellow-50 border-l-2 border-yellow-500' : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs mr-2 font-medium text-gray-600">{index+1}</span>
                            <span className={`${isToday ? 'font-medium text-yellow-800' : 'text-gray-700'}`}>{frenchDay}</span>
                          </div>
                          <span className={`${isToday ? 'font-medium text-yellow-800' : hours === 'Non précisé' ? 'text-gray-400 italic' : 'text-gray-900'}`}>{hours}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map */}
                <div className="bg-surface p-6 rounded-lg shadow-lg mb-8 border-l-4 border-highlight">
                  <h2 className="text-xl font-bold text-text-light mb-4 flex items-center">
                    <FaMapMarkerAlt className="text-highlight mr-2" />
                    Localisation
                  </h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <DynamicMap 
                      bars={[barMarker]} 
                      center={[bar.latitude || 48.8566, bar.longitude || 2.3522]}
                      zoom={16}
                      height="250px"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-secondary mb-2">Adresse</h3>
                    <p className="text-text-light opacity-90">{address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bars similaires section */}
        <section className="bg-bg-dark py-12 border-t border-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-text-light mb-4 text-center">Découvrez des établissements similaires</h2>
            <p className="text-text-light opacity-80 mb-8 text-center">Bars et clubs dans le même quartier ou de types similaires</p>
            
            {similarBars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {similarBars.map((similarBar) => (
                  <Link key={similarBar.id} href={`/bars/${similarBar.slug}`} className="group">
                    <div className="bg-surface rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 h-full flex flex-col border border-accent/20">
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image 
                          src={similarBar.photo || '/images/placeholder-bar-1.jpg'}
                          alt={similarBar.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {similarBar.subtypes && (
                          <div className="absolute bottom-2 left-2 bg-primary text-text-light text-xs px-2 py-1 rounded shadow-sm">
                            {similarBar.subtypes.split(',')[0]}
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-text-light group-hover:text-secondary transition-colors">{similarBar.name}</h3>
                          <p className="text-text-light opacity-80 text-sm flex items-center mt-1">
                            <FaMapMarkerAlt className="mr-1 text-highlight" />
                            {similarBar.postal_code ? `Paris ${similarBar.postal_code.replace(/[^0-9]/g, '')}` : 'Paris'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-surface rounded-lg shadow-sm border border-accent/20">
                <p className="text-text-light opacity-70">Aucun établissement similaire trouvé.</p>
              </div>
            )}
            
            <div className="text-center mt-6">
              <Link 
                href="/bars"
                className="inline-flex items-center px-5 py-3 bg-primary hover:bg-highlight text-text-light font-medium rounded-md shadow-md"
              >
                Voir tous les bars
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
