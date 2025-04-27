"use client";

import dynamic from 'next/dynamic';

// Import de la carte en mode dynamique (côté client uniquement)
const MapComponent = dynamic(() => import("@/components/ui/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-500">Chargement de la carte...</p>
    </div>
  ),
});

interface DynamicMapProps {
  height?: string;
  center?: [number, number];
  zoom?: number;
  bars?: any[];
  fullScreen?: boolean;
}

export default function DynamicMap({ 
  height = "500px", 
  center,
  zoom, 
  bars,
  fullScreen
}: DynamicMapProps) {
  return <MapComponent height={height} center={center} zoom={zoom} bars={bars} fullScreen={fullScreen} />;
}
