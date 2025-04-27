import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuartierImage from "@/components/ui/QuartierImage";
import { getQuartiers } from "@/lib/supabase/client";

// Fonction pour obtenir les données à l'avance pour la page
export async function generateMetadata() {
  return {
    title: "Quartiers - Bars Gay Paris",
    description:
      "Découvrez tous les quartiers de Paris et leurs établissements LGBT+ par arrondissement. Explorez la carte des bars gay par quartier.",
  };
}

export const revalidate = 3600; // Revalider toutes les heures

export default async function QuartiersPage() {
  // Récupération des données
  const quartiers = await getQuartiers();

  return (
    <>
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-gradient-to-br from-primary to-blue text-text-light py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Les Quartiers LGBT+ de Paris
              </h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 opacity-90">
                Explorez les établissements par arrondissement et découvrez la
                scène gay parisienne quartier par quartier
              </p>
            </div>
          </div>

          {/* Vague décorative en bas de la section */}
          <div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{ transform: "translateY(1px)" }}
          >
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

        {/* Liste des quartiers */}
        <section className="py-12 bg-bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-secondary mb-8 text-center">
              Tous les Arrondissements
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quartiers.map((quartier) => (
                <Link
                  key={quartier.id}
                  href={`/quartiers/${quartier.id}`}
                  className="group"
                >
                  <div className="bg-surface rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-primary/20">
                    <div className="relative h-40 w-full bg-gray-100">
                      <QuartierImage
                        quartierCode={
                          quartier.id.length === 5
                            ? quartier.id.substring(3, 5)
                            : quartier.id
                        }
                        quartierName={quartier.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-xl font-bold tracking-wide text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)]">
                            Bars gays dans le {quartier.name}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-text-light opacity-80">
                          {quartier.count || 0} établissements
                        </span>
                        <span className="text-secondary group-hover:text-primary transition-colors">
                          Découvrir →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-12 bg-surface border-t border-primary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Envie d'explorer autrement ?
            </h2>
            <p className="text-lg text-text-light opacity-90 mb-8 max-w-3xl mx-auto">
              Découvrez les établissements par type ou consultez la carte pour
              trouver les bars près de chez vous
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/types"
                className="px-6 py-3 bg-primary text-text-light font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Voir par type d'établissement
              </Link>
              <Link
                href="/carte"
                className="px-6 py-3 bg-accent text-text-light font-medium rounded-md hover:bg-blue transition-colors"
              >
                Explorer la carte
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
