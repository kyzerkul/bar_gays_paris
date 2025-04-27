'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BarImageProps {
  photo?: string | null;
  barId: string;
  barName: string;
  className?: string;
}

export default function BarImage({ photo, barId, barName, className = '' }: BarImageProps) {
  const placeholderIndex = parseInt(barId) % 3 + 1;
  const [imgSrc, setImgSrc] = useState(photo || `/images/placeholder-bar-${placeholderIndex}.jpg`);
  
  return (
    <Image
      src={imgSrc}
      alt={barName}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${className}`}
      onError={() => setImgSrc(`/images/placeholder-bar-${placeholderIndex}.jpg`)}
    />
  );
}
