-- Ajout d'une politique temporaire pour permettre toutes les insertions
CREATE POLICY "Permettre temporairement toutes les insertions" 
ON public.bars
FOR INSERT 
TO anon
WITH CHECK (true);

-- Après avoir terminé l'importation, exécutez ceci pour supprimer la politique:
-- DROP POLICY "Permettre temporairement toutes les insertions" ON public.bars;
