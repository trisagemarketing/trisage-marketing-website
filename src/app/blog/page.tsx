import CTA from "@/components/CTA";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Insights & Strategy | Trisage Marketing",
  description: "Expert perspectives on performance marketing, conversion optimization, and scaling B2B growth.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // Safety fallback if no blogs exist yet
  const displayBlogs = blogs && blogs.length > 0 ? blogs : [];
  
  // Separate featured post
  const featuredPost = displayBlogs.find(post => post.is_featured) || displayBlogs[0];
  const regularPosts = featuredPost ? displayBlogs.filter(post => post.id !== featuredPost.id) : displayBlogs;

  return (
    <main className="min-h-screen bg-white dark:bg-[#050b14] font-rubik">
      
      {/* Header Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-full bg-linear-to-b from-primary-50/50 to-white dark:from-[#0a1220] dark:to-[#050b14] z-0" />
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Insights & <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500">Strategy</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Expert perspectives on performance marketing, conversion optimization, and scaling growth in competitive markets.
          </p>
        </div>
      </section>

      {displayBlogs.length === 0 ? (
        <section className="container mx-auto px-4 md:px-8 py-12 md:py-24 text-center">
          <p className="text-xl text-gray-500">No published articles yet. Check back soon!</p>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="container mx-auto px-4 md:px-8 pb-16 md:pb-24">
              <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-[#0a1220] border border-gray-100 dark:border-white/5 transition-all hover:shadow-2xl dark:hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                <div className="flex flex-col lg:flex-row min-h-100 lg:min-h-125">
                  
                  {/* Featured Image */}
                  <div className="relative w-full lg:w-1/2 min-h-75 lg:min-h-full overflow-hidden">
                    <Image 
                      src={featuredPost.cover_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop"} 
                      alt={featuredPost.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-gray-900/40 lg:from-transparent to-transparent" />
                  </div>

                  {/* Featured Content */}
                  <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-primary-600 dark:text-primary-400 mb-6">
                      <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-500/20">Featured</span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                        {featuredPost.category}
                      </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                          {featuredPost.author_avatar && (
                            <Image src={featuredPost.author_avatar} alt={featuredPost.author_name} fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{featuredPost.author_name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> {featuredPost.read_time || "5 min read"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                        Read Article <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Grid Layout */}
          {regularPosts.length > 0 && (
            <section className="container mx-auto px-4 md:px-8 pb-24 md:pb-32">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {regularPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col h-full bg-white dark:bg-[#0a1220] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all duration-300">
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {post.cover_image && (
                        <Image 
                          src={post.cover_image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    
                    <div className="flex flex-col flex-1 p-6 md:p-8">
                      <div className="flex items-center gap-3 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-primary-50 dark:bg-primary-500/10">
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                            {post.author_avatar && (
                              <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {post.author_name}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Clock size={14} />
                          {post.read_time || "5 min read"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <CTA />
    </main>
  );
}
