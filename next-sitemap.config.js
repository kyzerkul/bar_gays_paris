/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://bars-gay-paris.fr', // Remplacez par votre URL de production
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      // Vous pouvez ajouter des sitemaps supplémentaires ici si nécessaire
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
