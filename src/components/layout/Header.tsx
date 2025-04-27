"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes, FaSearch, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SearchResults from '@/components/search/SearchResults';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  
  // Gestionnaire de clic à l'extérieur pour fermer les résultats
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchResultsRef.current && 
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
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
  
  // Fermer la recherche et réinitialiser les résultats
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };
  
  // Gérer la soumission du formulaire de recherche
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/bars?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="bg-bg-dark border-b border-primary shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              <div className="relative h-9 w-32 flex items-center">
                <Image 
                  src="/images/logo/Logo.png" 
                  alt="Bars Paris Logo"
                  width={128}
                  height={36}
                  className="object-contain max-h-9"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation de bureau */}
          <nav className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 text-text-light hover:text-highlight transition-colors">
              Accueil
            </Link>
            <Link href="/bars" className="px-3 py-2 text-text-light hover:text-secondary transition-colors">
              Tous les Bars
            </Link>
            <Link href="/quartiers" className="px-3 py-2 text-text-light hover:text-secondary transition-colors">
              Par Quartier
            </Link>
            <Link href="/types" className="px-3 py-2 text-text-light hover:text-secondary transition-colors">
              Par Type
            </Link>
            <Link href="/carte" className="px-3 py-2 text-text-light hover:text-secondary transition-colors">
              Carte
            </Link>
          </nav>

          {/* Bouton de recherche */}
          <div className="hidden md:flex items-center">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-blue hover:text-highlight"
              aria-label={isSearchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'}
            >
              <FaSearch className="h-5 w-5" />
            </button>
          </div>

          {/* Bouton de menu mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-highlight hover:text-secondary"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full bg-surface shadow-md z-10"
          >
            <div className="max-w-7xl mx-auto p-4">
              <form 
                onSubmit={handleSearchSubmit}
                className="relative"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Rechercher un bar, une adresse, un quartier..."
                  className="w-full py-3 pl-10 pr-10 border border-secondary bg-surface text-text-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isSearching ? (
                    <FaSpinner className="h-5 w-5 text-accent animate-spin" />
                  ) : (
                    <FaSearch className="h-5 w-5 text-accent" />
                  )}
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-accent"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                )}
              </form>
              
              {/* Résultats de recherche */}
              {(searchResults.length > 0 || isSearching) && searchQuery.trim() && (
                <div ref={searchResultsRef} className="mt-2">
                  <SearchResults 
                    results={searchResults}
                    isLoading={isSearching}
                    searchQuery={searchQuery}
                    onResultClick={handleCloseSearch}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden bg-surface border-t border-bg-dark shadow-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-light hover:bg-bg-dark hover:text-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/bars"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-light hover:bg-bg-dark hover:text-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Tous les Bars
              </Link>
              <Link 
                href="/quartiers"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-light hover:bg-bg-dark hover:text-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Par Quartier
              </Link>
              <Link 
                href="/types"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-light hover:bg-bg-dark hover:text-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Par Type
              </Link>
              <Link 
                href="/carte"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-light hover:bg-bg-dark hover:text-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                Carte
              </Link>
              <form 
                className="mt-4 mx-3"
                onSubmit={(e) => { 
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/bars?q=${encodeURIComponent(searchQuery)}`;
                    setIsMenuOpen(false);
                  }
                }}
              >
                <label htmlFor="mobile-search" className="sr-only">Rechercher</label>
                <div className="relative">
                  <input
                    id="mobile-search"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Rechercher..."
                    className="w-full py-2 pl-10 pr-4 border border-accent bg-bg-dark text-text-light rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {isSearching ? (
                      <FaSpinner className="h-4 w-4 text-secondary animate-spin" />
                    ) : (
                      <FaSearch className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent hover:text-primary"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
              
              {/* Résultats de recherche mobile */}
              {(searchResults.length > 0 || isSearching) && searchQuery.trim() && (
                <div className="mx-3 my-2">
                  <SearchResults 
                    results={searchResults}
                    isLoading={isSearching}
                    searchQuery={searchQuery}
                    onResultClick={() => {
                      setIsMenuOpen(false);
                      handleCloseSearch();
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
