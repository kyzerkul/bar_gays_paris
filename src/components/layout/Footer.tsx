"use client";

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bg-dark text-text-light border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Bars<span className="text-secondary">Paris</span>
              </span>
            </Link>
            <p className="mt-2 text-sm text-text-light opacity-80">
              Le guide complet des établissements LGBT+ parisiens. Découvrez les meilleurs bars gay et queer de Paris.
            </p>
            <div className="mt-4 flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-highlight"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-highlight"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-highlight"
                aria-label="Twitter"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="text-sm font-semibold text-blue tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-text-light opacity-80 hover:text-highlight">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/bars" className="text-gray-400 hover:text-white">
                  Tous les Bars
                </Link>
              </li>
              <li>
                <Link href="/carte" className="text-gray-400 hover:text-white">
                  Carte Interactive
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Quartiers populaires */}
          <div>
            <h3 className="text-sm font-semibold text-blue tracking-wider uppercase">
              Quartiers Populaires
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/quartiers/75004" className="text-gray-400 hover:text-white">
                  Le Marais (4ème)
                </Link>
              </li>
              <li>
                <Link href="/quartiers/75001" className="text-gray-400 hover:text-white">
                  Châtelet (1er)
                </Link>
              </li>
              <li>
                <Link href="/quartiers/75011" className="text-gray-400 hover:text-white">
                  Bastille (11ème)
                </Link>
              </li>
              <li>
                <Link href="/quartiers/75009" className="text-gray-400 hover:text-white">
                  Pigalle (9ème)
                </Link>
              </li>
            </ul>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="text-sm font-semibold text-blue tracking-wider uppercase">
              Informations Légales
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-white">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="mt-8 pt-8 border-t border-primary/20">
          <p className="text-sm text-text-light opacity-80 text-center">
            &copy; {currentYear} Bars Paris - Guide des établissements LGBT+ parisiens. Tous droits réservés.
          </p>
          <p className="text-xs text-text-light opacity-60 text-center mt-2">
            Les informations sur les établissements sont fournies à titre indicatif. Pensez à vérifier les horaires d'ouverture avant de vous déplacer.
          </p>
        </div>
      </div>
    </footer>
  );
}
