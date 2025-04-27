"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";

interface QuartierType {
  id: string;
  name: string;
  count: number;
}

interface BarType {
  id: string;
  name: string;
  slug: string;
  address?: string;
  postal_code?: string;
  photo?: string;
  description?: string;
}

interface QuartierTabsProps {
  quartiers: QuartierType[];
  barsByQuartier: {
    [key: string]: BarType[];
  };
}

export default function QuartierTabs({ quartiers, barsByQuartier }: QuartierTabsProps) {
  const [activeQuartier, setActiveQuartier] = useState<string>(quartiers[0]?.id || "");

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {quartiers.slice(0, 3).map((quartier, index) => (
          <button
            key={quartier.id}
            className={`quartier-btn px-6 py-3 rounded-full font-medium text-sm transition-colors ${
              activeQuartier === quartier.id
                ? "bg-accent text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
            onClick={() => setActiveQuartier(quartier.id)}
          >
            {quartier.id}ème Arrondissement
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {quartiers.slice(0, 3).map((quartier) => {
        const quartierBars = barsByQuartier[quartier.id] || [];

        return (
          <div
            key={quartier.id}
            className={`quartier-tab ${activeQuartier === quartier.id ? "" : "hidden"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quartierBars.map((bar) => (
                <Link
                  key={bar.id}
                  href={`/bars/${bar.slug}`}
                  className="bg-white/10 hover:bg-white/15 rounded-lg overflow-hidden flex flex-col transition-all"
                >
                  <div className="relative h-40 w-full bg-gray-800">
                    <Image
                      src={bar.photo || `/images/placeholder-bar-${(parseInt(bar.id) % 3) + 1}.jpg`}
                      alt={bar.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-white text-lg">{bar.name}</h3>
                    <p className="text-gray-300 text-sm mt-1">
                      <FaMapMarkerAlt className="inline mr-1" />
                      {bar.address
                        ? `${bar.address}, ${bar.postal_code}`
                        : `${bar.postal_code} Paris`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bouton Tout voir */}
      <div className="mt-8 text-center">
        <Link
          href="/bars"
          className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
        >
          Voir tous les quartiers
          <svg
            className="ml-2 w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
