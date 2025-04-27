'use client';

import JsonLd from './JsonLd';

type BarProps = {
  id: number;
  name: string;
  description?: string;
  address?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  email?: string;
  photo?: string;
  rating?: number;
  reviews?: number;
  opening_hours?: any;
  subtypes?: string;
  slug: string;
};

type BarSchemaOrgProps = {
  bar: BarProps;
  url: string;
};

export default function BarSchemaOrg({ bar, url }: BarSchemaOrgProps) {
  // Déterminer le type d'établissement
  let barType = "NightClub";
  if (bar.subtypes) {
    if (bar.subtypes.includes('restaurant')) {
      barType = "Restaurant";
    } else if (bar.subtypes.includes('cafe')) {
      barType = "CafeOrCoffeeShop";
    } else if (bar.subtypes.includes('bar')) {
      barType = "BarOrPub";
    }
  }
  
  // Construire l'adresse complète
  const addressRegion = "Île-de-France";
  const addressCountry = "FR";
  const streetAddress = bar.address || "";
  const postalCode = bar.postal_code || "";
  const addressLocality = "Paris";
  
  // Définir l'interface pour les horaires d'ouverture
  interface OpeningHoursSpecification {
    "@type": string;
    "dayOfWeek": string;
    "opens": string;
    "closes": string;
  }
  
  // Formater les horaires d'ouverture au format Schema.org si disponibles
  const openingHoursSpecification: OpeningHoursSpecification[] = [];
  
  if (bar.opening_hours) {
    const daysMap: Record<string, string> = {
      'lundi': 'Monday',
      'mardi': 'Tuesday',
      'mercredi': 'Wednesday',
      'jeudi': 'Thursday',
      'vendredi': 'Friday',
      'samedi': 'Saturday',
      'dimanche': 'Sunday'
    };
    
    try {
      // Supposons que opening_hours est un objet JSON avec les jours comme clés
      const hours = typeof bar.opening_hours === 'string' 
        ? JSON.parse(bar.opening_hours) 
        : bar.opening_hours;
      
      Object.entries(hours).forEach(([day, hours]) => {
        if (daysMap[day] && hours) {
          const hourString = String(hours);
          if (hourString !== "fermé" && hourString !== "closed") {
            // Format attendu: "HH:MM-HH:MM"
            const times = hourString.split('-');
            if (times.length === 2) {
              openingHoursSpecification.push({
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": daysMap[day],
                "opens": times[0].trim(),
                "closes": times[1].trim()
              });
            }
          }
        }
      });
    } catch (e) {
      console.error("Erreur de parsing des horaires:", e);
    }
  }
  
  // Construire l'objet Schema.org
  const barSchema = {
    "@context": "https://schema.org",
    "@type": barType,
    "@id": url,
    "name": bar.name,
    "description": bar.description || `${bar.name} est un établissement LGBT+ situé à Paris.`,
    "url": url,
    "telephone": bar.phone || undefined,
    "email": bar.email || undefined,
    "image": bar.photo || undefined,
    "priceRange": "€€",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": streetAddress,
      "addressLocality": addressLocality,
      "postalCode": postalCode,
      "addressRegion": addressRegion,
      "addressCountry": addressCountry
    },
    "geo": bar.latitude && bar.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": bar.latitude,
      "longitude": bar.longitude
    } : undefined,
    "openingHoursSpecification": openingHoursSpecification.length > 0 
      ? openingHoursSpecification as OpeningHoursSpecification[] 
      : undefined,
    "aggregateRating": bar.rating && bar.reviews ? {
      "@type": "AggregateRating",
      "ratingValue": bar.rating,
      "reviewCount": bar.reviews
    } : undefined
  };
  
  // Filtrer les valeurs undefined pour un JSON propre
  const cleanSchema = JSON.parse(JSON.stringify(barSchema));
  
  return <JsonLd data={cleanSchema} />;
}
