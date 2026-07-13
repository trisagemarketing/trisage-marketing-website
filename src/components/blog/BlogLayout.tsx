"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Blog } from "@/types/blog";

export default function BlogLayout({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set(initialBlogs.map(b => b.category).filter(Boolean));
    return ["All", ...Array.from(cats)] as string[];
  }, [initialBlogs]);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return initialBlogs;
    return initialBlogs.filter(b => b.category === activeCategory);
  }, [activeCategory, initialBlogs]);

  const featuredPost = filteredBlogs.find(post => post.is_featured) || filteredBlogs[0];
  const regularPosts = featuredPost ? filteredBlogs.filter(post => post.id !== featuredPost.id) : filteredBlogs;

  if (initialBlogs.length === 0) {
    return (
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-24 text-center">
        <p className="text-xl text-gray-500">No published articles yet. Check back soon!</p>
      </section>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .text-stroke {
          -webkit-text-stroke: 1.5px rgba(0,0,0,0.1);
          color: transparent;
        }
        :is(.dark .text-stroke) {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.15);
        }
      `}} />

      {/* Hero Section with Infinite Marquee */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Infinite Marquee Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200vw] flex overflow-hidden pointer-events-none select-none z-0">
          <div className="animate-marquee flex whitespace-nowrap text-[80px] md:text-[120px] lg:text-[160px] font-bold text-stroke opacity-70">
            <span>INSIGHTS • STRATEGY • MARKETING • INSIGHTS • STRATEGY • MARKETING • INSIGHTS • STRATEGY • MARKETING •&nbsp;</span>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tighter">
            Insights & <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500">Strategy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Expert perspectives on performance marketing, conversion optimization, and scaling growth in competitive markets.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 md:px-8 pb-12 z-10 relative">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === category 
                  ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-black dark:border-white shadow-md scale-105" 
                  : "bg-transparent text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 md:px-8 pb-16 md:pb-24 z-10 relative">
          <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-[#0a1220] border border-gray-100 dark:border-white/5 transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_50px_rgba(0,0,0,0.4)]">
            
            {/* Rotating Badge - Absolute positioned overlapping image & content */}
            <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-24 h-24 md:w-32 md:h-32 pointer-events-none drop-shadow-xl">
              <div className="w-full h-full animate-[spin_12s_linear_infinite] bg-white dark:bg-gray-900 rounded-full flex items-center justify-center p-1 md:p-2 border border-gray-100 dark:border-gray-800">
                 <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-900 dark:fill-white font-bold tracking-[0.2em] text-[12px] uppercase">
                  <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                  <text>
                    <textPath href="#circlePath" startOffset="0%">
                      Read Latest • New Post • Read Latest • 
                    </textPath>
                  </text>
                </svg>
                {/* Center Star */}
                <svg className="absolute w-6 h-6 md:w-8 md:h-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-100 lg:min-h-125">
              
              {/* Featured Image */}
              <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <Image 
                  src={featuredPost.cover_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop"} 
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-125"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-gray-900/60 lg:from-transparent to-transparent" />
              </div>

              {/* Featured Content */}
              <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-[#0a1220] z-10 relative">
                <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-primary-600 dark:text-primary-400 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/20 uppercase tracking-wider">Featured</span>
                  <span className="px-4 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                      {featuredPost.author_avatar && (
                        <Image src={featuredPost.author_avatar} alt={featuredPost.author_name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-900 dark:text-white">{featuredPost.author_name}</div>
                      <div className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Clock size={14} /> {featuredPost.read_time || "5 min read"}</div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-600 group-hover:text-white dark:group-hover:bg-primary-500 text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-110">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid Layout */}
      {regularPosts.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 pb-24 md:pb-32 z-10 relative">
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            >
              {regularPosts.map((post) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={post.id}
                >
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-[#0a1220] rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all duration-500">
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {post.cover_image && (
                        <Image 
                          src={post.cover_image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-125"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 p-6 md:p-8">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-[1.2] tracking-tight">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed flex-1 font-medium">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                            {post.author_avatar && (
                              <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {post.author_name}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                          <Clock size={14} />
                          {post.read_time || "5 min read"}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>
      )}
    </>
  );
}
