/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co', 
      'lh3.googleusercontent.com', 
      'source.unsplash.com',
      'streetviewpixels-pa.googleapis.com'
    ],
  },
  // Ajout de configurations supplémentaires si nécessaire
};

module.exports = nextConfig;
