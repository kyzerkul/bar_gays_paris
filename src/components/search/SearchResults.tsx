'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt } from 'react-icons/fa';

type SearchResult = {
  id: number;
  name: string;
  address: string;
  postal_code: string;
  slug: string;
  photo: string | null;
};

type SearchResultsProps = {
  results: SearchResult[];
  isLoading: boolean;
  searchQuery: string;
  onResultClick: () => void;
};

export default function SearchResults({ 
  results, 
  isLoading, 
  searchQuery, 
  onResultClick 
}: SearchResultsProps) {
  // Si pas de recherche, ne rien afficher
  if (!searchQuery.trim()) {
    return null;
  }

  // Message de chargement
  if (isLoading) {
    return (
      <div className="bg-surface p-4 rounded-md shadow-md">
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-t-primary border-r-primary border-b-primary border-l-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-text-light">Recherche en cours...</span>
        </div>
      </div>
    );
  }

  // Si aucun résultat trouvé
  if (results.length === 0) {
    return (
      <div className="bg-surface p-4 rounded-md shadow-md">
        <p className="text-text-light text-center py-4">
          Aucun résultat trouvé pour <span className="font-bold">"{searchQuery}"</span>
        </p>
      </div>
    );
  }

  // Afficher les résultats
  return (
    <div className="bg-surface rounded-md shadow-md overflow-hidden border border-primary/20">
      <ul className="divide-y divide-primary/10">
        {results.map((result) => (
          <li key={result.id} className="hover:bg-primary/5 transition-colors">
            <Link 
              href={`/bars/${result.slug}`} 
              className="flex items-center p-3"
              onClick={onResultClick}
            >
              <div className="h-12 w-12 relative flex-shrink-0 mr-3 bg-bg-dark rounded-md overflow-hidden">
                {result.photo ? (
                  <Image
                    src={result.photo}
                    alt={result.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                    <span className="text-xs font-bold">{result.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium text-text-light truncate">{result.name}</p>
                <div className="flex items-center text-text-light/60 text-sm">
                  <FaMapMarkerAlt className="mr-1 text-secondary text-xs" />
                  <span className="truncate">{result.address}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {results.length > 0 && (
        <div className="bg-bg-dark/90 p-2 text-center">
          <Link 
            href={`/bars?q=${encodeURIComponent(searchQuery)}`}
            className="text-secondary hover:text-primary text-sm"
            onClick={onResultClick}
          >
            Voir tous les résultats ({results.length})
          </Link>
        </div>
      )}
    </div>
  );
}
