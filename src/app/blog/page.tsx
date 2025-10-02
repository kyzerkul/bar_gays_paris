import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/supabase/blog";

export const revalidate = 1800; // 30 min

export const metadata: Metadata = {
  title: "Blog – Bars Gay Paris",
  description: "Guides, actualités et sélections LGBT+ à Paris. Découvrez nos derniers articles.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog – Bars Gay Paris",
    description: "Guides, actualités et sélections LGBT+ à Paris.",
    type: "website",
  },
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts({ limit: 12 });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-text-light">Blog</h1>
        <p className="text-text-light opacity-80 mt-2">
          Guides, actualités et sélections LGBT+ à Paris.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-surface border border-blue/20 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-44 w-full bg-bg-dark">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.cover_image_alt || post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-text-light/60">
                    Aucune image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-text-light line-clamp-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-sm text-text-light/80 mt-2 line-clamp-3">{post.excerpt}</p>
                )}
                {post.published_at && (
                  <time className="block text-xs text-text-light/60 mt-3">
                    {new Date(post.published_at).toLocaleDateString("fr-FR")}
                  </time>
                )}
              </div>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}


