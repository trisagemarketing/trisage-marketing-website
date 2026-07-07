import { MetadataRoute } from 'next';
import { getAllPublishedPosts } from '@/lib/blog/data';

export const revalidate = 3600; // Cache for 1 hour, allowing ISR

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trisagemarketing.com';
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/clients`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];

  try {
    // Dynamic Blog Routes
    const posts = await getAllPublishedPosts();
    
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      // Use updated_at if available, otherwise published_at, otherwise created_at
      lastModified: new Date(post.updated_at || post.published_at || post.created_at || now),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes];
  } catch (error) {
    console.error('[Sitemap] Failed to generate dynamic blog routes:', error);
    // Graceful fallback to just static routes if DB fails
    return staticRoutes;
  }
}
