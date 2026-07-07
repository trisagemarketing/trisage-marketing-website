import { cache } from 'react';
import { createPublicClient } from '@/lib/supabase/public';

/**
 * Cached fetcher for a single published blog post by slug.
 * Using React.cache() memoizes the request during SSR, meaning if `generateMetadata`
 * and `BlogPostPage` both call this, only ONE database query is executed.
 */
export const getPublishedPostBySlug = cache(async (slug: string) => {
  const supabase = createPublicClient();
  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  return post || null;
});

/**
 * Cached fetcher for all published blog posts.
 * Primarily used by the dynamic sitemap, RSS feed, and blog listing pages.
 */
export const getAllPublishedPosts = cache(async () => {
  const supabase = createPublicClient();
  const { data: posts } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false }); // Fallback to created_at logic if needed by the consumer

  return posts || [];
});
