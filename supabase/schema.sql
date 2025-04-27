-- Création de la table principale pour les bars
CREATE TABLE IF NOT EXISTS public.bars (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  site TEXT,
  subtypes TEXT,
  category TEXT,
  type TEXT,
  phone TEXT,
  full_address TEXT,
  street TEXT,
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  h3 TEXT,
  rating DOUBLE PRECISION,
  reviews INTEGER,
  reviews_link TEXT,
  photos_count INTEGER,
  photo TEXT,
  street_view TEXT,
  working_hours TEXT,
  other_hours TEXT,
  business_status TEXT,
  about TEXT,
  range TEXT,
  logo TEXT,
  description TEXT,
  reservation_links TEXT,
  booking_appointment_link TEXT,
  order_links TEXT,
  location_link TEXT,
  location_reviews_link TEXT,
  reviews_id TEXT,
  email_1 TEXT,
  phone_1 TEXT,
  facebook TEXT,
  instagram TEXT,
  tiktok TEXT,
  twitter TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_bars_slug ON public.bars (slug);
CREATE INDEX IF NOT EXISTS idx_bars_postal_code ON public.bars (postal_code);
CREATE INDEX IF NOT EXISTS idx_bars_type ON public.bars (type);
CREATE INDEX IF NOT EXISTS idx_bars_rating ON public.bars (rating);

-- Fonction de recherche vectorielle pour une meilleure recherche textuelle
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Index de recherche sur le nom, le quartier, l'adresse et la description
CREATE INDEX IF NOT EXISTS idx_bars_name_trgm ON public.bars USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_bars_full_address_trgm ON public.bars USING GIN (full_address gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_bars_description_trgm ON public.bars USING GIN (description gin_trgm_ops);

-- Fonction pour mettre à jour automatiquement updated_at à chaque modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Déclencheur pour mettre à jour updated_at automatiquement
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.bars
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Configuration des politiques RLS (Row Level Security)
ALTER TABLE public.bars ENABLE ROW LEVEL SECURITY;

-- Politique permettant à tous de lire les données (pour l'affichage public)
CREATE POLICY "Permettre à tous de lire les bars" ON public.bars
FOR SELECT USING (true);

-- Politique restreignant la modification aux administrateurs authentifiés
CREATE POLICY "Permettre aux admins de modifier les bars" ON public.bars
FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (
  'admin@bars-gay-paris.fr'  -- Remplacer par les emails des administrateurs
));

-- Table pour les avis et commentaires des utilisateurs
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  bar_id INTEGER REFERENCES public.bars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les avis
CREATE INDEX IF NOT EXISTS idx_reviews_bar_id ON public.reviews (bar_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews (user_id);

-- Déclencheur pour mettre à jour updated_at automatiquement pour les avis
CREATE TRIGGER set_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Configuration des politiques RLS pour les avis
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Politique permettant à tous de lire les avis
CREATE POLICY "Permettre à tous de lire les avis" ON public.reviews
FOR SELECT USING (true);

-- Politique permettant aux utilisateurs authentifiés de créer leurs propres avis
CREATE POLICY "Permettre aux utilisateurs de créer leurs avis" ON public.reviews
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politique permettant aux utilisateurs de modifier uniquement leurs propres avis
CREATE POLICY "Permettre aux utilisateurs de modifier leurs avis" ON public.reviews
FOR UPDATE USING (auth.uid() = user_id);

-- Politique permettant aux utilisateurs de supprimer uniquement leurs propres avis
CREATE POLICY "Permettre aux utilisateurs de supprimer leurs avis" ON public.reviews
FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour calculer la note moyenne d'un bar
CREATE OR REPLACE FUNCTION calculate_average_rating(bar_id INTEGER)
RETURNS DOUBLE PRECISION AS $$
DECLARE
  avg_rating DOUBLE PRECISION;
BEGIN
  SELECT AVG(rating) INTO avg_rating
  FROM public.reviews
  WHERE reviews.bar_id = calculate_average_rating.bar_id;
  
  RETURN avg_rating;
END;
$$ LANGUAGE plpgsql;

-- Déclencheur pour mettre à jour la note d'un bar à chaque nouvel avis
CREATE OR REPLACE FUNCTION update_bar_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour la note et le nombre d'avis du bar concerné
  UPDATE public.bars
  SET 
    rating = calculate_average_rating(NEW.bar_id),
    reviews = (SELECT COUNT(*) FROM public.reviews WHERE bar_id = NEW.bar_id)
  WHERE id = NEW.bar_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer les déclencheurs pour les avis
CREATE TRIGGER update_bar_rating_on_review_insert
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_bar_rating();

CREATE TRIGGER update_bar_rating_on_review_update
AFTER UPDATE ON public.reviews
FOR EACH ROW
WHEN (OLD.rating IS DISTINCT FROM NEW.rating)
EXECUTE FUNCTION update_bar_rating();

CREATE TRIGGER update_bar_rating_on_review_delete
AFTER DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_bar_rating();

-- Commentaire final
COMMENT ON TABLE public.bars IS 'Table principale stockant les informations sur les bars gay de Paris';
COMMENT ON TABLE public.reviews IS 'Avis et commentaires des utilisateurs sur les bars';
