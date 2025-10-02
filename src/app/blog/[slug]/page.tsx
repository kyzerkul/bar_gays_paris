import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/supabase/blog";

type Props = { params: { slug: string } };

export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return { title: "Article introuvable – Bars Gay Paris" };
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || "";
  const url = `https://bars-gay-paris.fr/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post || !post.published) return notFound();

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <article>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-text-light">{post.title}</h1>
          {post.published_at && (
            <time className="block text-sm text-text-light/70 mt-2">
              {new Date(post.published_at).toLocaleDateString("fr-FR")}
            </time>
          )}
        </header>

        {post.cover_image_url && (
          <div className="relative w-full h-64 md:h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Rendu simple: paragraphes depuis excerpt + rendu minimal JSON */}
        {post.excerpt && (
          <p className="text-text-light/90 leading-7 mb-6">{post.excerpt}</p>
        )}
        {post.content_html ? (
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content_html }} />
        ) : post.content_json ? (
          <RichContentRenderer content={post.content_json} />
        ) : null}
      </article>
    </main>
  );
}

// Rendu minimal de contenu riche (titres/paragraphes/images) depuis JSON
function RichContentRenderer({ content }: { content: any }) {
  try {
    if (!content || !Array.isArray(content?.content)) return null;
    return (
      <div className="prose prose-invert max-w-none">
        {content.content.map((node: any, idx: number) => {
          if (node.type === 'heading') {
            const level = node.attrs?.level || 2;
            const text = node.content?.map((c: any) => c.text).join(' ') || '';
            const Tag = `h${Math.min(Math.max(level, 2), 4)}` as any;
            return <Tag key={idx}>{text}</Tag>;
          }
          if (node.type === 'paragraph') {
            const text = node.content?.map((c: any) => c.text).join(' ') || '';
            return <p key={idx}>{text}</p>;
          }
          if (node.type === 'image') {
            const src = node.attrs?.src;
            const alt = node.attrs?.alt || '';
            if (!src) return null;
            return (
              <div key={idx} className="my-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="rounded" />
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  } catch {
    return null;
  }
}


