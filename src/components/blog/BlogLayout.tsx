"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Blog } from "@/types/blog";

export default function BlogLayout({ 
  initialBlogs, 
  dbCategories = [] 
}: { 
  initialBlogs: Blog[]; 
  dbCategories?: string[]; 
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const articleCats = initialBlogs.map(b => b.category).filter(Boolean);
    const combined = new Set([...dbCategories, ...articleCats]);
    const list = Array.from(combined);
    if (list.length === 0) {
      return ["All", "Performance Marketing", "SEO Strategy", "Growth Playbooks", "Case Studies"];
    }
    return ["All", ...list];
  }, [initialBlogs, dbCategories]);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === "All") return initialBlogs;
    return initialBlogs.filter(b => b.category === activeCategory);
  }, [activeCategory, initialBlogs]);

  const featuredPost = filteredBlogs.find(post => post.is_featured) || filteredBlogs[0];
  const regularPosts = featuredPost ? filteredBlogs.filter(post => post.id !== featuredPost.id) : filteredBlogs;

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
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Infinite Marquee Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200vw] flex overflow-hidden pointer-events-none select-none z-0">
          <div className="animate-marquee flex whitespace-nowrap text-[50px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold text-stroke opacity-70">
            <span>INSIGHTS • STRATEGY • MARKETING • GROWTH • PERFORMANCE • INSIGHTS • STRATEGY • MARKETING •&nbsp;</span>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/50 dark:border-primary-500/20 text-xs font-bold text-primary-600 dark:text-primary-400 mb-6 uppercase tracking-wider shadow-xs">
            ✨ Knowledge Hub & Insights
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tighter">
            Insights &amp; <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500">Strategy</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Expert perspectives on performance marketing, conversion optimization, and scaling growth in competitive markets.
          </p>
        </div>
      </section>

      {/* Category Filter - Touch-friendly scrollable on mobile */}
      <section className="container mx-auto px-4 md:px-8 pb-8 sm:pb-12 z-10 relative">
        <div className="flex items-center justify-start sm:justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar py-2 px-1 -mx-4 sm:mx-0 px-4 sm:px-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border whitespace-nowrap shrink-0 cursor-pointer ${
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

      {/* Empty State when no published articles match */}
      {filteredBlogs.length === 0 && (
        <section className="container mx-auto px-4 md:px-8 pb-20 sm:pb-28 z-10 relative max-w-2xl text-center">
          <div className="relative group bg-white/80 dark:bg-[#0a1220]/80 backdrop-blur-2xl border border-gray-200/60 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-xl">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 border border-primary-200/50 dark:border-primary-500/30 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-3xl sm:text-4xl">🚀</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              New Articles Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto">
              Our team of growth strategists is currently preparing deep-dive performance marketing playbooks and case studies. Get a free website audit while we finalize our next publication!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('openLeadModal'));
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-white text-sm font-bold bg-linear-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg shadow-primary-500/20 transition-all cursor-pointer"
              >
                Get Free Audit
              </button>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-800 dark:text-gray-200 text-sm font-bold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all text-center"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <section className="container mx-auto px-4 md:px-8 pb-12 sm:pb-16 md:pb-24 z-10 relative">
          <Link href={`/blog/${featuredPost.slug}`} className="group block relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-[#0a1220] border border-gray-100 dark:border-white/5 transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_50px_rgba(0,0,0,0.4)]">
            
            {/* Rotating Badge - Scaled for mobile */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 pointer-events-none drop-shadow-xl">
              <div className="w-full h-full animate-[spin_12s_linear_infinite] bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center p-1 md:p-2 border border-gray-100 dark:border-gray-800">
                 <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-900 dark:fill-white font-bold tracking-[0.2em] text-[12px] uppercase">
                  <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
                  <text>
                    <textPath href="#circlePath" startOffset="0%">
                      Read Latest • New Post • Read Latest • 
                    </textPath>
                  </text>
                </svg>
                {/* Center Star */}
                <svg className="absolute w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-0 lg:min-h-125">
              
              {/* Featured Image */}
              <div className="relative w-full lg:w-1/2 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[220px] sm:min-h-[300px] lg:min-h-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                <Image 
                  src={featuredPost.cover_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop"} 
                  alt={featuredPost.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 sm:group-hover:scale-125"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t lg:bg-linear-to-r from-gray-900/60 lg:from-transparent to-transparent" />
              </div>

              {/* Featured Content */}
              <div className="w-full lg:w-1/2 p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-[#0a1220] z-10 relative">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold text-primary-600 dark:text-primary-400 mb-4 sm:mb-6">
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/20 uppercase tracking-wider">Featured</span>
                  <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-6 leading-[1.2] sm:leading-[1.1] tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {featuredPost.title}
                </h2>

                <p className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                      {featuredPost.author_avatar && (
                        <Image src={featuredPost.author_avatar} alt={featuredPost.author_name} fill className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs sm:text-base font-bold text-gray-900 dark:text-white">{featuredPost.author_name}</div>
                      <div className="text-[11px] sm:text-sm font-medium text-gray-500 flex items-center gap-1.5"><Clock size={13} /> {featuredPost.read_time || "5 min read"}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-primary-600 group-hover:text-white dark:group-hover:bg-primary-500 text-gray-900 dark:text-white transition-all duration-300 group-hover:scale-110">
                    <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid Layout */}
      {regularPosts.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 pb-20 sm:pb-24 md:pb-32 z-10 relative">
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
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
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-[#0a1220] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] transition-all duration-500">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {post.cover_image && (
                        <Image 
                          src={post.cover_image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 sm:group-hover:scale-125"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 p-5 sm:p-6 md:p-8">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-[1.2] tracking-tight">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 line-clamp-3 leading-relaxed flex-1 font-medium">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 shrink-0">
                            {post.author_avatar && (
                              <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {post.author_name}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-500 font-bold">
                          <Clock size={13} />
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
