'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { createPost } from '@/lib/supabase/blog';
import TinyEditor from '@/components/ui/TinyEditor';

export default function AdminNewPostPage() {
  const router = useRouter();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverAlt, setCoverAlt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [contentHtml, setContentHtml] = useState<string>('');
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Redirection si non connecté
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/admin/login');
      } else {
        setSessionChecked(true);
      }
    });
  }, [router]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { upsert: false });
      if (error) throw error;
      const publicUrl = supabase.storage.from('blog-images').getPublicUrl(data.path).data.publicUrl;
      setCoverUrl(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim()) return setError('Titre requis');
    const normalizedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    try {
      const now = new Date().toISOString();
      const post = await createPost({
        title,
        slug: normalizedSlug,
        excerpt,
        content_html: contentHtml || null,
        cover_image_url: coverUrl || null,
        cover_image_alt: coverAlt || null,
        seo_title: seoTitle || null,
        seo_description: seoDesc || null,
        published,
        published_at: published ? now : null,
      });
      router.push(`/blog/${post.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur sauvegarde');
    }
  };

  if (!sessionChecked) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text-light mb-6">Nouvel article</h1>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-text-light/80 mb-1">Titre</label>
          <input className="w-full px-3 py-2 rounded border border-blue/30 bg-bg-dark text-text-light" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-text-light/80 mb-1">Slug (optionnel)</label>
          <input className="w-full px-3 py-2 rounded border border-blue/30 bg-bg-dark text-text-light" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-text-light/80 mb-1">Résumé (excerpt)</label>
          <textarea rows={3} className="w-full px-3 py-2 rounded border border-blue/30 bg-bg-dark text-text-light" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-text-light/80 mb-1">Image de couverture</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
          {uploading && <div className="text-sm text-text-light/60 mt-2">Upload en cours...</div>}
          {coverUrl && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt={coverAlt || ''} className="max-h-48 rounded" />
            </div>
          )}
          <input className="mt-2 w-full px-3 py-2 rounded border border-blue/30 bg-bg-dark text-text-light" placeholder="Texte alternatif (alt)" value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-text-light/80 mb-1">SEO Title</label>
          <input className="w-full px-3 py-2 rounded border border-blue/30 bg-bg-dark text-text-light" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-text-light/80 mb-1">Meta Description</label>
          <textarea rows={2} className="w-full px-3 py-2 rounded border border-blue/30 bg-bg-dark text-text-light" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-text-light/80 mb-1">Contenu de l'article</label>
          <TinyEditor value={contentHtml} onChange={setContentHtml} />
        </div>
        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <label htmlFor="published" className="text-text-light">Publier</label>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="flex gap-3">
          <button onClick={handleSave} className="px-4 py-2 rounded bg-primary text-text-light hover:bg-blue">Enregistrer</button>
          <button onClick={() => router.push('/blog')} className="px-4 py-2 rounded border border-blue/30 text-text-light">Annuler</button>
        </div>
      </div>
    </main>
  );
}


