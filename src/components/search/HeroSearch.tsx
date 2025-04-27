'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa';
import SearchResults from './SearchResults';

export default function HeroSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Gestionnaire de clic à l'extérieur pour fermer les résultats
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour effectuer la recherche avec debounce
  const performSearch = (query: string) => {
    // Annuler la recherche précédente
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Si la requête est vide, effacer les résultats
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    // Attendre 300ms avant d'effectuer la recherche (debounce)
    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (response.ok) {
          setSearchResults(data.results || []);
        } else {
          console.error('Erreur de recherche:', data.error);
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Gestionnaire de changement pour le champ de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Gérer la soumission du formulaire de recherche
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/bars?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fonction pour effacer la recherche
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <form 
        className="relative flex bg-surface border-2 border-secondary rounded-full shadow-xl overflow-hidden p-1"
        onSubmit={handleSearchSubmit}
      >
        <div className="flex-grow flex items-center">
          {isSearching ? (
            <FaSpinner className="h-5 w-5 text-accent ml-4 animate-spin" />
          ) : (
            <FaSearch className="h-5 w-5 text-accent ml-4" />
          )}
          <input 
            ref={searchInputRef}
            type="text" 
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Rechercher un bar, une adresse, un quartier..." 
            className="w-full pl-3 py-3 text-text-light bg-transparent focus:outline-none" 
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-accent hover:text-secondary mr-2"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          )}
        </div>
        <button 
          type="submit"
          className="bg-primary hover:bg-blue transition-colors text-text-light px-6 py-3 rounded-full font-medium shadow-lg"
        >
          Rechercher
        </button>
      </form>

      {/* Résultats de recherche */}
      {isFocused && (searchResults.length > 0 || isSearching) && searchQuery.trim() && (
        <div 
          ref={searchResultsRef} 
          className="absolute z-10 mt-2 w-full left-0 right-0 rounded-xl overflow-hidden"
        >
          <SearchResults 
            results={searchResults}
            isLoading={isSearching}
            searchQuery={searchQuery}
            onResultClick={() => {
              setIsFocused(false);
              setSearchResults([]);
            }}
          />
        </div>
      )}
    </div>
  );
}
