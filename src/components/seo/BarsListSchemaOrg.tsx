'use client';

import JsonLd from './JsonLd';

type BarSimple = {
  id: number;
  name: string;
  address?: string;
  postal_code?: string;
  slug: string;
};

type BarsListSchemaOrgProps = {
  bars: BarSimple[];
  baseUrl: string;
};

export default function BarsListSchemaOrg({ bars, baseUrl }: BarsListSchemaOrgProps) {
  // Création d'un ItemList Schema.org pour la liste des bars
  const listItems = bars.map((bar, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "BarOrPub",
      "name": bar.name,
      "url": `${baseUrl}/bars/${bar.slug}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Paris",
        "postalCode": bar.postal_code || "",
        "streetAddress": bar.address || "",
        "addressCountry": "FR"
      }
    }
  }));

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": listItems,
    "numberOfItems": bars.length,
    "itemListOrder": "https://schema.org/ItemListUnordered",
    "name": "Bars Gay et LGBT+ à Paris"
  };

  return <JsonLd data={listSchema} />;
}
