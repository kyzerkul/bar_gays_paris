# Bars Gay Paris - Directory

## À propos du projet

Bars Gay Paris est un directory complet des établissements LGBT+ parisiens, conçu avec une forte optimisation SEO. Cette application web moderne permet aux utilisateurs de découvrir les bars, clubs et autres lieux de la scène gay parisienne à travers une expérience interactive et intuitive.

## Fonctionnalités principales

- **Page d'accueil** avec carte interactive des établissements
- **Listing des bars** avec système de filtrage (quartier, type, etc.)
- **Pages détaillées** pour chaque établissement
- **Système de recherche** par nom, quartier, adresse postale
- **Design responsive** optimisé pour mobile et desktop
- **Optimisation SEO poussée** à tous les niveaux de l'application

## Technologies utilisées

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS
- **Base de données**: Supabase (PostgreSQL)
- **Cartographie**: Leaflet / React-Leaflet
- **Animations**: Framer Motion
- **Icônes**: React Icons

## Optimisations SEO

L'application a été conçue en privilégiant le SEO à chaque étape :

- **Structure SSR** (Server-Side Rendering) grâce à Next.js
- **Métadonnées dynamiques** optimisées pour chaque page
- **Données structurées Schema.org** pour une meilleure indexation
- **URLs optimisées** et structure propre
- **Contenu textuel riche** et pertinent
- **Balisage sémantique HTML** approprié
- **Optimisation mobile** avec design responsive

## Installation et démarrage

### Prérequis

- Node.js (v16+)
- npm ou yarn
- Compte Supabase pour la base de données

### Installation

1. Cloner le dépôt

```bash
git clone https://github.com/votreusername/bars-gay-paris.git
cd bars-gay-paris
```

2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet et ajoutez les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
```

4. Démarrer le serveur de développement

```bash
npm run dev
# ou
yarn dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

### Import des données

Pour importer vos données depuis un fichier CSV :

1. Placez votre fichier CSV dans le dossier `data/`
2. Exécutez le script d'importation :

```bash
npm run import-data
# ou
yarn import-data
```

## Configuration de Supabase

1. Créez un projet sur [Supabase](https://supabase.com/)
2. Utilisez le fichier `supabase/schema.sql` pour initialiser la structure de la base de données
3. Configurez les variables d'environnement comme indiqué ci-dessus

## Déploiement

L'application peut facilement être déployée sur Vercel, Netlify ou tout autre service de déploiement supportant Next.js :

```bash
npm run build
# ou
yarn build
```

## Personnalisation

### Couleurs et thème

Les couleurs principales peuvent être modifiées dans le fichier `tailwind.config.js` :

```js
theme: {
  extend: {
    colors: {
      primary: '#9b87f5', // Violet
      secondary: '#D946EF', // Rose
      accent: '#F97316', // Orange
    },
  },
},
```

### Ajouter des fonctionnalités

Le projet est structuré de manière modulaire pour faciliter l'ajout de nouvelles fonctionnalités :

- `/src/components` : Composants réutilisables
- `/src/app/(pages)` : Pages et routes de l'application
- `/src/lib` : Utilitaires et fonctions partagées

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## Licence

Ce projet est sous licence MIT.
