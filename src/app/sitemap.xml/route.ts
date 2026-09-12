import { getAllPublishedPosts } from '@/lib/blog/data';
import { services } from '@/data/services';

export const revalidate = 3600; // Cache for 1 hour, allowing ISR

export async function GET() {
  const baseUrl = 'https://trisagemarketing.com';
  const now = new Date().toISOString();

  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: '1.0' },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: '0.9' },
    ...services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: '0.8',
    })),
    { url: `${baseUrl}/methodology`, lastModified: now, changeFrequency: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/case-studies`, lastModified: now, changeFrequency: 'weekly', priority: '0.7' },
    { url: `${baseUrl}/case-studies/villasita-resort-haridwar`, lastModified: now, changeFrequency: 'weekly', priority: '0.9' },
    { url: `${baseUrl}/clients`, lastModified: now, changeFrequency: 'monthly', priority: '0.6' },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: '0.7' },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: 'yearly', priority: '0.3' },
  ];

  type DynamicRoute = {
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: string;
  };

  let dynamicBlogRoutes: DynamicRoute[] = [];
  try {
    const posts = await getAllPublishedPosts();
    dynamicBlogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || post.created_at || now).toISOString(),
      changeFrequency: 'weekly',
      priority: '0.8',
    }));
  } catch (error) {
    console.error('[Sitemap Route] Failed to fetch dynamic blog posts:', error);
  }

  const allRoutes = [...staticRoutes, ...dynamicBlogRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastModified}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
