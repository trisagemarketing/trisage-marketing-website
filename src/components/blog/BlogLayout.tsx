"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
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

  // The user requested to disable the large featured hero banner and show all posts uniformly in the small grid layout
  const featuredPost = null;
  const displayGridPosts = filteredBlogs;
  return (
    <div className="w-full max-w-full overflow-x-hidden">
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
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20 overflow-hidden w-full">
        {/* Infinite Marquee Background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full overflow-hidden pointer-events-none select-none z-0">
          <div className="animate-marquee flex whitespace-nowrap text-[50px] sm:text-[80px] md:text-[120px] lg:text-[160px] font-bold text-stroke opacity-70">
            <span>INSIGHTS • STRATEGY • MARKETING • GROWTH • PERFORMANCE • INSIGHTS • STRATEGY • MARKETING •&nbsp;</span>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/50 dark:border-primary-500/20 text-xs font-bold text-primary-600 dark:text-primary-400 mb-6 uppercase tracking-wider shadow-xs">
            <Sparkles size={14} /> Knowledge Hub & Insights
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tighter">
            Insights &amp; <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500">Strategy</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Expert perspectives on performance marketing, conversion optimization, and scaling growth in competitive markets.
          </p>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="container mx-auto px-4 md:px-8 pb-8 sm:pb-12 z-10 relative">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 py-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold truncate transition-all duration-300 cursor-pointer w-[calc(50%-0.25rem)] sm:w-auto text-center ${
                activeCategory === category
                  ? "bg-primary-600 dark:bg-primary-500 text-white shadow-lg shadow-primary-500/25 scale-105"
                  : "bg-white/80 dark:bg-[#0a1220]/80 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
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


      {/* Professional Blog Grid List */}
      {displayGridPosts.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 pb-20 sm:pb-24 md:pb-32 z-10 relative">
          <AnimatePresence mode="popLayout">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
            >
              {displayGridPosts.map((post) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={post.id}
                >
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-[#0a1220] rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/80 dark:border-white/10 hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300">
                    {/* Cover Image Container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {post.cover_image && (
                        <Image 
                          src={post.cover_image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[11px] font-bold text-gray-900 dark:text-white uppercase tracking-wider shadow-xs border border-gray-200/50 dark:border-white/10">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Card Content Area */}
                    <div className="flex flex-col flex-1 p-5 sm:p-6 md:p-7">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug tracking-tight line-clamp-2" title={post.title}>
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed font-normal">
                        {post.excerpt || "Dive deep into our latest strategies and actionable insights on how to scale your brand and accelerate revenue growth."}
                      </p>

                      {/* Author & Footer Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/80 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0">
                            {post.author_avatar && (
                              <Image src={post.author_avatar} alt={post.author_name} fill className="object-cover" />
                            )}
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {post.author_name}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-semibold">
                          <Clock size={12} />
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
    </div>
  );
}
