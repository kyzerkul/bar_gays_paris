'use client';

type JsonLdProps = {
  data: Record<string, any>;
};

// Composant qui génère le balisage JSON-LD
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
