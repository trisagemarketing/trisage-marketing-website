"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight } from "lucide-react";

// Using the mock data from the blog page to preview the layout
const blogPosts = [
  {
    id: "1",
    title: "The Future of AI in Performance Marketing",
    excerpt: "Discover how artificial intelligence is fundamentally changing how we bid on ads, target audiences, and generate creative assets at scale.",
    category: "Performance Marketing",
    date: "Jun 10, 2026",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Why Your B2B SaaS SEO Strategy is Failing",
    excerpt: "Stop writing generic top-of-funnel content. Learn how bottom-of-funnel, high-intent targeting is the new gold rush for B2B software.",
    category: "SEO Strategy",
    date: "May 28, 2026",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Mastering TikTok Ads in 2026",
    excerpt: "The algorithm has changed. Here is the exact creative framework we use to generate massive ROAS on short-form video platforms.",
    category: "Social Media",
    date: "May 15, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
  },
];

interface HomeBlogProps {
  recentPosts?: any[];
}

export default function HomeBlog({ recentPosts = [] }: HomeBlogProps) {
  const displayPosts = recentPosts.length > 0 ? recentPosts.map(post => ({
    id: post.slug || post.id,
    title: post.title,
    excerpt: post.excerpt || "Read our latest insights and strategies for growth.",
    category: post.category || "General",
    date: post.published_at ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
    readTime: "5 min read",
    imageUrl: post.cover_image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
  })) : blogPosts;

  return (
    <section className="relative py-8 md:py-12 bg-white dark:bg-[#050b14]/30 transition-colors duration-300 overflow-hidden" id="insights">
      {/* Background Ambience */}
      <div className="absolute hidden dark:block left-[-10%] top-[10%] w-[30%] h-[30%] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute hidden dark:block right-[-10%] bottom-[-10%] w-[30%] h-[30%] bg-secondary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-[#2A3F64] dark:text-white mb-4 md:mb-6"
          >
            Latest Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Strategies</span>
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Industry-leading perspectives on digital marketing, growth engineering, and building iconic brands.
          </motion.p>
        </div>

        {/* Grid Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.id}`} className="group flex flex-col h-full bg-white dark:bg-[#0a1220]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-200/50 dark:border-white/5 shadow-sm hover:shadow-2xl dark:hover:shadow-primary-500/10 transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-900 dark:text-white shadow-sm border border-gray-200 dark:border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col flex-grow p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <Calendar size={14} className="text-primary-500" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="text-secondary-500" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
          className="text-center"
        >
          <Link href="/blog" className="inline-flex items-center justify-center py-4 px-8 rounded-full text-white text-sm font-bold tracking-wide bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1 gap-2 group">
            View All Articles <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
