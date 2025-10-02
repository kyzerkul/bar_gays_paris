# BarsGayParis.com - Plan d'Amélioration et d'Expansion

## Background and Motivation

Le site BarsGayParis.com est un annuaire des bars et établissements LGBT+ de Paris, construit avec Next.js 15, Supabase, et Tailwind CSS. Le site fonctionne déjà avec du trafic, mais nécessite des améliorations majeures :

**État actuel :**
- 500 bars de test en base de données
- Design basique fonctionnel mais peu moderne
- SSR implémenté pour le SEO
- Structure Next.js 15 avec App Router
- Base de données Supabase avec schéma complet

**Objectifs :**
1. Moderniser le design pour une meilleure UX
2. Ajouter tous les bars de Paris (pas seulement 500 de test)
3. Éviter les doublons lors de l'ajout de nouveaux établissements
4. Ajouter de nouveaux types d'établissements (saunas, etc.)
5. Implémenter une section blog avec bon SEO

## Key Challenges and Analysis

### 1. Détection et Élimination des Doublons
**Problème :** Comment éviter les doublons lors du scraping de nouveaux bars ?
**Solutions possibles :**
- Algorithme de similarité de noms (fuzzy matching)
- Comparaison des adresses et coordonnées GPS
- Système de validation manuelle pour les cas ambigus
- Base de données de "noms alternatifs" pour les établissements

### 2. Modernisation du Design
**Problèmes identifiés :**
- Interface trop basique
- Manque d'animations et de micro-interactions
- Palette de couleurs limitée
- Responsive design à améliorer

### 3. Gestion des Nouveaux Types d'Établissements
**Défis :**
- Catégorisation des saunas et autres établissements
- Adaptation du système de filtres
- SEO pour les nouvelles catégories

### 4. Section Blog
**Exigences :**
- Template moderne et responsive
- SSR complet pour le SEO
- Système de catégories et tags
- Intégration avec l'écosystème existant

---

## Blog - Background and Motivation

Créer un blog pour publier des articles (guides, actualités, sélections) avec un excellent SEO. Objectif: générer du trafic organique et renforcer l'autorité du site.

## Blog - Key Challenges and Analysis

- Choix de l'éditeur: Markdown ou Rich Text. Décision: Rich Text (TipTap) pour mise en page et SEO (balises sémantiques, H2/H3, alt images).
- Authentification admin: Supabase email/mot de passe.
- Images: upload Supabase Storage `blog-images` + compression côté client, alt obligatoire.
- SEO: `seo_title`, `seo_description`, `og:image`, canonical, JSON-LD Article.
- Performance: ISR/revalidate et pré-render des 10 derniers articles.

## Blog - High-level Task Breakdown

- [ ] Schéma DB `posts` (title, slug, content_rich, cover_image_url, cover_image_alt, seo_title, seo_description, published, published_at, author_id, created_at, updated_at, tags TEXT[])
- [ ] RLS: lecture publique, écriture admin (authentifiés)
- [ ] Types TypeScript pour `posts`
- [ ] Lib CRUD `lib/supabase/blog.ts`
- [ ] Pages publiques: `/blog` (liste paginée), `/blog/[slug]` (article)
- [ ] SEO: `generateMetadata`, OpenGraph, JSON-LD Article
- [ ] Storage: bucket `blog-images`, upload API route
- [ ] Admin: `/admin/login`, `/admin/blog/new` (éditeur riche, upload image, SEO fields)
- [ ] Sitemaps: inclure les articles

## Project Status Board

### En cours
- [ ] Analyse initiale du projet (Planner)
- [ ] Planifier l'architecture du blog

### À faire
- [ ] Ajouter table `posts` + RLS dans `supabase/schema.sql`
- [ ] Mettre à jour `src/types/supabase.ts` pour `posts`
- [ ] Créer librairie CRUD `src/lib/supabase/blog.ts`
- [ ] Implémenter `/blog` et `/blog/[slug]` (SSR + SEO)
- [ ] Pages admin `/admin/login` et `/admin/blog/new` (auth email/mdp)
- [ ] Uploader images via Supabase Storage `blog-images`

### Terminé
- Aucun pour le moment

## Executor's Feedback or Assistance Requests

- Aucun pour le moment

## Lessons

- Toujours lire le fichier avant de l'éditer
- Inclure des informations utiles pour le debugging dans les sorties du programme
- Exécuter `npm audit` si des vulnérabilités apparaissent
- Toujours demander avant d'utiliser `git -force`
