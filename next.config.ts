import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24h (pas 1 an — risque de cacher des erreurs)
    remotePatterns: [
      // Google user photos (lh3, lh4, lh5, lh6, etc.)
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      // Google Street View
      { protocol: 'https', hostname: '*.googleapis.com' },
      // Supabase Storage (images blog)
      { protocol: 'https', hostname: '*.supabase.co' },
      // Placeholders et Unsplash
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
    ],
  },
  compress: true,
  async headers() {
    return [
      {
        // Headers de sécurité sur toutes les routes
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
      {
        // Cache long uniquement pour les assets statiques Next.js
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
