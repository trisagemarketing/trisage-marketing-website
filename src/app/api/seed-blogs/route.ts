import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// The hardcoded mock data from the original blog implementation
const mockBlogs = [
  {
    title: "The Future of AI in Performance Marketing",
    slug: "future-of-ai-in-performance-marketing",
    excerpt: "Discover how artificial intelligence is fundamentally changing how we bid on ads, target audiences, and generate creative assets at scale.",
    category: "Performance Marketing",
    read_time: "8 min read",
    author_name: "Sarah Jenkins",
    author_role: "Head of Growth",
    author_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
    is_featured: true,
    status: "published",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Artificial Intelligence is no longer just a buzzword; it's the foundational layer of modern performance marketing. Over the last 12 months, we've seen a paradigm shift in how platforms like Google and Meta handle ad placements." }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Gone are the days of manual bid adjustments and hyper-granular audience targeting. Today, the most successful campaigns leverage broad targeting alongside advanced machine learning algorithms that dynamically allocate budget to the highest-converting impressions in real-time." }]
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "The Role of Generative Creative" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Perhaps the most exciting development is generative creative. Instead of A/B testing two or three static images, we are now deploying systems that can generate thousands of micro-variations of an ad creative, test them simultaneously, and automatically double down on the winners. This level of multivariate testing was impossible just two years ago." }]
        }
      ]
    }
  },
  {
    title: "Why Your B2B SaaS SEO Strategy is Failing",
    slug: "why-your-b2b-saas-seo-strategy-is-failing",
    excerpt: "Stop writing generic top-of-funnel content. Learn how bottom-of-funnel, high-intent targeting is the new gold rush for B2B software.",
    category: "SEO Strategy",
    read_time: "12 min read",
    author_name: "Elena Rodriguez",
    author_role: "SEO Lead",
    author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    is_featured: false,
    status: "published",
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Most B2B SaaS companies make the exact same mistake with their SEO strategy: they obsess over traffic volume instead of traffic intent." }]
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Bottom-of-Funnel Gold" }]
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Instead, you should be writing comparison pages: 'Your Software vs Competitor X'. The search volume might only be 200 searches a month, but the intent is incredibly high. Someone searching for a direct comparison is at the bottom of the funnel, credit card in hand, trying to make a final purchasing decision." }]
        }
      ]
    }
  }
];

export async function GET(request: Request) {
  // Simple auth check to prevent random people from hitting this route
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized. Please log in as an admin." }, { status: 401 });
  }

  try {
    for (const blog of mockBlogs) {
      // Create published blog
      const { data: savedBlog, error } = await supabase
        .from('blogs')
        .insert({
          ...blog,
          author_id: user.id, // assign to the admin who clicked seed
          published_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        console.error("Failed to seed blog:", blog.title, error);
        continue;
      }

      // Create an initial revision snapshot for safety
      await supabase
        .from('blog_revisions')
        .insert({
          blog_id: savedBlog.id,
          content_snapshot: blog.content,
          published_by: user.id
        });
    }

    return NextResponse.json({ success: true, message: "Successfully seeded mock blogs to Supabase." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
