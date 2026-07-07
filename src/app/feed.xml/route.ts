import { Feed } from 'feed';
import { getAllPublishedPosts } from '@/lib/blog/data';

export async function GET() {
  const baseUrl = 'https://trisagemarketing.com';
  const now = new Date();

  try {
    const posts = await getAllPublishedPosts();

    const feed = new Feed({
      title: "Trisage Marketing Blog",
      description: "Expert perspectives on performance marketing, conversion optimization, and scaling B2B growth.",
      id: baseUrl,
      link: baseUrl,
      language: "en",
      image: `${baseUrl}/icon.png`, // Fallback standard icon
      favicon: `${baseUrl}/favicon.ico`,
      copyright: `All rights reserved ${now.getFullYear()}, Trisage Marketing`,
      updated: now,
      generator: "Trisage CMS",
      feedLinks: {
        rss2: `${baseUrl}/feed.xml`,
      },
      author: {
        name: "Trisage Marketing",
        email: "hello@trisagemarketing.com",
        link: baseUrl,
      }
    });

    posts.forEach(post => {
      const postUrl = `${baseUrl}/blog/${post.slug}`;
      const pubDate = new Date(post.published_at || post.created_at || now);

      feed.addItem({
        title: post.title,
        id: postUrl,
        link: postUrl,
        description: post.excerpt || post.meta_description || "Read more on our blog.",
        // Using excerpt as summary since parsing complex ProseMirror JSON to clean HTML here is unnecessary for RSS.
        content: post.excerpt || post.meta_description || "Read more on our blog.",
        author: [
          {
            name: post.author_name || "Trisage Team",
            // role is mapped as title if needed
          }
        ],
        date: pubDate,
        image: post.cover_image || undefined,
        category: [
          { name: post.category },
          ...(post.tags || []).map((tag: string) => ({ name: tag }))
        ],
      });
    });

    return new Response(feed.rss2(), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });

  } catch (error) {
    console.error('[RSS Feed] Failed to generate:', error);
    return new Response('<error>Internal Server Error</error>', { 
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
  }
}
