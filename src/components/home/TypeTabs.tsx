"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt } from "react-icons/fa";

interface TypeType {
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

interface TypeTabsProps {
  types: TypeType[];
  barsByType: {
    [key: string]: BarType[];
  };
}

export default function TypeTabs({ types, barsByType }: TypeTabsProps) {
  const [activeType, setActiveType] = useState<string>(types[0]?.id || "");

  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {types.slice(0, 3).map((type, index) => (
          <button
            key={type.id}
            className={`type-btn px-6 py-3 rounded-full font-medium text-sm transition-colors ${
              activeType === type.id
                ? "bg-primary text-text-light shadow-lg"
                : "bg-surface text-text-light hover:bg-accent hover:text-text-light"
            }`}
            onClick={() => setActiveType(type.id)}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {types.slice(0, 3).map((type) => {
        const typeBars = barsByType[type.id] || [];

        return (
          <div
            key={type.id}
            className={`type-tab ${activeType === type.id ? "" : "hidden"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {typeBars.map((bar) => (
                <Link
                  key={bar.id}
                  href={`/bars/${bar.slug}`}
                  className="bg-white hover:bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md flex flex-col transition-all"
                >
                  <div className="relative h-40 w-full bg-gray-100">
                    <Image
                      src={bar.photo || `/images/placeholder-bar-${(parseInt(bar.id) % 3) + 1}.jpg`}
                      alt={bar.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-gray-900 text-lg">{bar.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
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
          href="/types"
          className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary hover:bg-primary/5 transition-colors"
        >
          Voir tous les types d'établissements
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
