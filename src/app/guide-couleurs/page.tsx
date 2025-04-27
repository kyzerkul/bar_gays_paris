import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ColorGuide from '@/components/ui/ColorGuide';

export const metadata = {
  title: 'Guide des couleurs | Bars Gay Paris',
  description: 'Guide des couleurs et styles utilisés dans le site Bars Gay Paris'
};

export default function ColorGuidePage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary to-blue text-text-light py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Guide des couleurs</h1>
            <p className="mt-3 text-lg max-w-3xl mx-auto opacity-90">
              Découvrez la palette de couleurs et les styles du site
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ transform: 'translateY(1px)' }}>
            <svg
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              fill="#0A0F29"
              className="w-full h-12"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
            </svg>
          </div>
        </section>
        
        {/* Guide des couleurs */}
        <section className="py-12 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ColorGuide />
            
            <div className="mt-12 max-w-3xl mx-auto p-6 bg-surface rounded-lg border border-primary/20">
              <h2 className="text-2xl font-bold text-secondary mb-4">Comment utiliser</h2>
              <div className="text-text-light space-y-4">
                <p>
                  Ce guide illustre le nouveau système de couleurs HSL avec support du mode sombre. 
                  Les couleurs sont définies dans <code className="bg-bg-dark px-2 py-1 rounded">globals.css</code> en tant que variables CSS et configurées dans <code className="bg-bg-dark px-2 py-1 rounded">tailwind.config.js</code>.
                </p>
                
                <h3 className="text-xl font-semibold text-secondary mt-6">Exemples d'utilisation</h3>
                
                <pre className="bg-bg-dark p-4 rounded-md overflow-x-auto text-sm">
                  {`// Utiliser une couleur de base
<div className="bg-primary text-primary-foreground">
  Contenu avec couleur primaire
</div>

// Utiliser une couleur personnalisée
<button className="bg-lgbtPurple text-white">
  Bouton violet LGBT
</button>

// Hover et états différents
<button className="bg-secondary hover:bg-secondary/90">
  Bouton secondaire
</button>

// Dégradé
<div className="bg-gradient-to-r from-lgbtPurple to-lgbtPink">
  Dégradé violet à rose
</div>`}
                </pre>
                
                <p className="mt-4">
                  Le basculement entre le mode clair et sombre est facilité par l'ajout de la classe <code className="bg-bg-dark px-2 py-1 rounded">'dark'</code> à l'élément HTML racine.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
