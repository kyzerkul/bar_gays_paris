/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Nouveau domaine
  siteUrl: 'https://barsgayparis.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // Pour les pages de bars, mise à jour plus fréquente
  changefreq: 'daily',
  // Priorité plus élevée pour assurer une bonne indexation
  priority: 0.8,
  // Exclure uniquement les routes API et non les contenus
  exclude: ['/api/*'],
  // Configuration spécifique pour différents types de pages
  transform: async (config, path) => {
    // Configuration par défaut
    const defaultConfig = {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };

    // Priorités personnalisées par type de page
    if (path === '/') {
      // Page d'accueil - priorité maximale
      return {
        ...defaultConfig,
        priority: 1.0,
        changefreq: 'daily',
      };
    } else if (path.startsWith('/bars/') && !path.includes('page')) {
      // Pages individuelles des bars - haute priorité
      return {
        ...defaultConfig,
        priority: 0.9,
        changefreq: 'weekly',
      };
    } else if (path === '/bars' || path === '/carte' || path === '/types' || path === '/quartiers') {
      // Pages principales de catégories - priorité élevée
      return {
        ...defaultConfig,
        priority: 0.8,
        changefreq: 'daily',
      };
    } else if (path.startsWith('/types/') || path.startsWith('/quartiers/')) {
      // Pages de sous-catégories - priorité moyenne-haute
      return {
        ...defaultConfig,
        priority: 0.7,
        changefreq: 'weekly',
      };
    }

    // Configuration par défaut pour les autres pages
    return defaultConfig;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
