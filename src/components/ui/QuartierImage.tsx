'use client';

import { useState } from 'react';
import Image from 'next/image';

interface QuartierImageProps {
  quartierCode: string;
  quartierName: string;
  className?: string;
}

export default function QuartierImage({ quartierCode, quartierName, className = '' }: QuartierImageProps) {
  const [imgSrc, setImgSrc] = useState(`/images/arrondissements-jpg/${quartierCode}.jpg`);
  
  return (
    <Image
      src={imgSrc}
      alt={quartierName}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${className}`}
      onError={() => setImgSrc("/images/placeholder-bar-1.jpg")}
    />
  );
}
