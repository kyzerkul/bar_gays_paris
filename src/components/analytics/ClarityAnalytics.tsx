'use client';

import { useEffect } from 'react';
import { clarity } from '@microsoft/clarity';

// L'ID de projet Clarity défini directement ici pour garantir le fonctionnement
// Dans un environnement de production, vous devriez utiliser une variable d'environnement
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'rro38d0347';

export default function ClarityAnalytics() {
  useEffect(() => {
    // Initialiser Microsoft Clarity uniquement côté client
    if (typeof window !== 'undefined') {
      try {
        clarity.init(CLARITY_PROJECT_ID);
        console.log('Microsoft Clarity initialized successfully');
      } catch (error) {
        console.error('Error initializing Microsoft Clarity:', error);
      }
    }
  }, []);

  // Ce composant ne rend rien dans le DOM
  return null;
}
