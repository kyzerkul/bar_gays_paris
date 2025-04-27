"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRouter } from 'next/navigation';

// Résoudre le problème d'icônes Leaflet en Next.js
// Déclaration de l'icône sans initialiser immédiatement
let defaultIcon: L.Icon;

// Fonction pour initialiser l'icône côté client
const initializeIcons = () => {
  defaultIcon = L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Données fictives pour la démonstration
const demoData = [
  {
    id: 1,
    name: 'Le Cox',
    slug: 'le-cox',
    address: '15 Rue des Archives, 75004 Paris',
    description: 'Bar gay emblématique du Marais',
    type: 'Bar',
    position: [48.8566, 2.3522]
  },
  {
    id: 2,
    name: 'Freedj',
    slug: 'freedj',
    address: '35 Rue Sainte-Croix de la Bretonnerie, 75004 Paris',
    description: 'Bar lounge avec cocktails et musique',
    type: 'Bar',
    position: [48.8570, 2.3530]
  },
  {
    id: 3,
    name: 'La Boîte',
    slug: 'la-boite',
    address: '15 Rue des Lombards, 75001 Paris',
    description: 'Club électro et house',
    type: 'Club',
    position: [48.8580, 2.3490]
  },
];

// Type pour les propriétés du composant
interface MapComponentProps {
  height?: string;
  width?: string;
  zoom?: number;
  center?: [number, number];
  bars?: any[]; // À typer correctement avec l'interface Bar
  fullScreen?: boolean;
}

export default function MapComponent({
  height = '600px',
  width = '100%',
  zoom = 13,
  center = [48.8566, 2.3522], // Centre de Paris
  bars = demoData,
  fullScreen = false,
}: MapComponentProps) {
  const router = useRouter();
  const [mapReady, setMapReady] = useState(false);

  // Résout le problème de chargement de la carte côté client
  useEffect(() => {
    // Initialisation des icônes côté client uniquement
    initializeIcons();
    
    // Définir l'icône par défaut
    L.Marker.prototype.options.icon = defaultIcon;
    
    // Indiquer que la carte est prête à être affichée
    setMapReady(true);
    
    // Gestion des erreurs potentielles de Leaflet
    return () => {
      // Nettoyage lors du démontage du composant
    };
  }, []);

  // Fonction pour naviguer vers la page détaillée d'un bar
  const handleMarkerClick = (slug: string) => {
    if (fullScreen) {
      router.push(`/bars/${slug}`);
    }
  };

  // Affiche un message de chargement si la carte n'est pas prête
  if (!mapReady) {
    return (
      <div 
        style={{ height, width }}
        className="bg-gray-100 flex items-center justify-center text-gray-500"
      >
        Chargement de la carte...
      </div>
    );
  }

  return (
    <div style={{ height, width }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {bars.map((bar) => {
          // Vérifier et utiliser lat/lng ou position selon ce qui est disponible
          const position = bar.position ? 
            bar.position as [number, number] : 
            [bar.lat || 48.8566, bar.lng || 2.3522] as [number, number];
            
          return (
            <Marker 
              key={bar.id} 
              position={position}
              eventHandlers={{
                click: () => {
                  handleMarkerClick(bar.slug);
                }
              }}
            >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-primary">{bar.name}</h3>
                <p className="text-xs text-gray-600">{bar.address}</p>
                <p className="text-sm mt-1">{bar.description}</p>
                <button 
                  onClick={() => router.push(`/bars/${bar.slug}`)}
                  className="mt-2 text-sm text-white bg-primary px-3 py-1 rounded hover:bg-secondary transition-colors"
                >
                  Voir détails
                </button>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
