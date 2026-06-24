import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import CTA from "@/components/CTA";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RichTextRenderer from "@/components/blog/RichTextRenderer";
import ShareButton from "@/components/blog/ShareButton";

// ==========================================
// DYNAMIC METADATA + JSON-LD
// ==========================================
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('blogs').select('*').eq('slug', id).eq('status', 'published').single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.meta_title || `${post.title} | Trisage Blog`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : [],
      type: 'article',
    },
    alternates: {
      canonical: post.canonical_url || `https://trisage.com/blog/${post.slug}`,
    }
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from('blogs').select('*').eq('slug', id).eq('status', 'published').single();

  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: [{ '@type': 'Person', name: post.author_name }],
    publisher: { '@type': 'Organization', name: 'Trisage Marketing' },
  };

  const publishDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // ONE shared container class used by every section — guarantees pixel-perfect alignment
  const CONTAINER = "w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-white dark:bg-[#050b14] transition-colors duration-300">

        {/* ── Hero / Header ── */}
        <header className="relative pt-28 pb-10 md:pt-36 md:pb-14 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white dark:from-[#0a1220] dark:to-[#050b14]" />

          <div className={`relative ${CONTAINER}`}>

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 mb-10 transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              Back to Insights
            </Link>

            {/* Category + read time */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-sm font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-500/20">
                <Tag size={12} />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Clock size={13} />
                {post.read_time || '5 min read'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                {post.excerpt}
              </p>
            )}

            {/* Author + meta bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 ring-2 ring-primary-200 dark:ring-primary-800 flex-shrink-0">
                  {post.author_avatar ? (
                    <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base">
                      {post.author_name?.[0] || 'A'}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">{post.author_name}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
                    {post.author_role && <span>{post.author_role}</span>}
                    {post.author_role && <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />}
                    <span className="flex items-center gap-1"><Calendar size={11} /> {publishDate}</span>
                  </div>
                </div>
              </div>
              <ShareButton 
                title={post.title} 
                url={post.canonical_url || `https://trisage.com/blog/${post.slug}`} 
              />
            </div>
          </div>
        </header>

        {/* ── Cover Image — same CONTAINER as header and content ── */}
        {post.cover_image && (
          <div className={`${CONTAINER} mb-10`}>
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl dark:shadow-[0_0_60px_rgba(0,0,0,0.4)]">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </div>
        )}

        {/* ── Article Body — same CONTAINER, no extra wrapper ── */}
        <div className={`${CONTAINER} pb-24`}>
          <RichTextRenderer content={post.content} />

          {/* Tags footer */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

      </main>

      <CTA />
    </>
  );
}
