'use client';

import { useState } from 'react';

export default function ColorGuide() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`p-8 ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-background text-foreground rounded-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Guide des couleurs</h2>
          <button 
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {isDarkMode ? 'Mode clair' : 'Mode sombre'}
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Couleurs principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col">
            <div className="h-20 bg-primary rounded-t-md flex items-center justify-center">
              <span className="text-primary-foreground font-medium">primary</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-primary text-primary-foreground</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-secondary rounded-t-md flex items-center justify-center">
              <span className="text-secondary-foreground font-medium">secondary</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-secondary text-secondary-foreground</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-accent rounded-t-md flex items-center justify-center">
              <span className="text-accent-foreground font-medium">accent</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-accent text-accent-foreground</code>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Couleurs LGBT spécifiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col">
            <div className="h-20 bg-lgbtPurple rounded-t-md flex items-center justify-center">
              <span className="text-white font-medium">lgbtPurple</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-lgbtPurple text-white</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-lgbtPink rounded-t-md flex items-center justify-center">
              <span className="text-white font-medium">lgbtPink</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-lgbtPink text-white</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-lgbtOrange rounded-t-md flex items-center justify-center">
              <span className="text-white font-medium">lgbtOrange</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-lgbtOrange text-white</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-lgbtBlue rounded-t-md flex items-center justify-center">
              <span className="text-white font-medium">lgbtBlue</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-lgbtBlue text-white</code>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Interface du site</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col">
            <div className="h-20 bg-bg-dark rounded-t-md flex items-center justify-center">
              <span className="text-text-light font-medium">bg-dark</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-bg-dark text-text-light</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-surface rounded-t-md flex items-center justify-center">
              <span className="text-text-light font-medium">surface</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-surface text-text-light</code>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="h-20 bg-blue rounded-t-md flex items-center justify-center">
              <span className="text-blue-foreground font-medium">blue</span>
            </div>
            <div className="bg-muted p-2 rounded-b-md">
              <code className="text-sm">bg-blue text-blue-foreground</code>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Exemples de composants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-card rounded-lg border border-border">
            <h4 className="font-bold text-lg mb-3">Card</h4>
            <p className="text-card-foreground mb-4">Contenu d'une carte avec style card de base.</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Bouton primaire
            </button>
          </div>
          
          <div className="p-6 bg-surface rounded-lg border border-primary/20">
            <h4 className="font-bold text-lg text-secondary mb-3">Surface</h4>
            <p className="text-text-light opacity-80 mb-4">Contenu avec le style surface personnalisé.</p>
            <button className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
              Bouton accent
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Dégradés</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gradient-to-r from-lgbtPurple to-lgbtPink rounded-md flex items-center justify-center">
            <span className="text-white font-medium">from-lgbtPurple to-lgbtPink</span>
          </div>
          
          <div className="h-32 bg-gradient-to-r from-primary to-blue rounded-md flex items-center justify-center">
            <span className="text-white font-medium">from-primary to-blue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
