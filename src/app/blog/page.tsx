import CTA from "@/components/CTA";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Insights | Trisage Marketing",
  description: "Industry-leading insights, strategies, and news from the Trisage Marketing team.",
};

// Mock data to visualize the layout before real content is written
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI in Performance Marketing",
    excerpt: "Discover how artificial intelligence is fundamentally changing how we bid on ads, target audiences, and generate creative assets at scale.",
    category: "Performance Marketing",
    date: "Jun 10, 2026",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "2",
    title: "Maximizing ROI for Luxury Hotel Brands",
    excerpt: "A deep dive into the specific omnichannel strategies that are driving record-breaking direct bookings for our hospitality clients.",
    category: "Case Study",
    date: "Jun 02, 2026",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "3",
    title: "Why Your B2B SaaS SEO Strategy is Failing",
    excerpt: "Stop writing generic top-of-funnel content. Learn how bottom-of-funnel, high-intent targeting is the new gold rush for B2B software.",
    category: "SEO Strategy",
    date: "May 28, 2026",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
    featured: false,
  },
  {
    id: "4",
    title: "Mastering TikTok Ads in 2026",
    excerpt: "The algorithm has changed. Here is the exact creative framework we use to generate massive ROAS on short-form video platforms.",
    category: "Social Media",
    date: "May 15, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <main className="min-h-screen bg-white dark:bg-[#050b14] transition-colors duration-300">
      {/* Hero Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">Strategies</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Industry-leading perspectives on digital marketing, growth engineering, and building iconic brands.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 pb-32">
        {/* Featured Post (Hero) */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.id}`} className="group block mb-16 md:mb-24">
            <div className="relative rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-500 hover:shadow-xl dark:hover:shadow-primary-500/10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                  <Image 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                </div>
                
                {/* Content Side */}
                <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 relative z-10 bg-white/90 dark:bg-[#0a1220]/90 backdrop-blur-sm lg:backdrop-blur-none lg:bg-transparent lg:dark:bg-transparent lg:-ml-8 lg:rounded-l-[2rem]">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <Clock size={14} />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Calendar size={16} />
                      {featuredPost.date}
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                    <span className="flex items-center gap-2 text-primary-600 dark:text-primary-400 group-hover:translate-x-2 transition-transform">
                      Read Article <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group flex flex-col h-full bg-white dark:bg-[#0a1220] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[3/2] w-full overflow-hidden">
                <Image 
                  src={post.imageUrl} 
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col flex-grow p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                    <Clock size={14} />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <CTA />
    </main>
  );
}
