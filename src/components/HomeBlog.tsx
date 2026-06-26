"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowRight } from "lucide-react";


interface HomeBlogProps {
  recentPosts?: any[];
}

export default function HomeBlog({ recentPosts = [] }: HomeBlogProps) {
  const displayPosts = recentPosts.map((post) => ({
    id: post.slug || post.id,
    title: post.title,
    excerpt: post.excerpt || "Read our latest insights and strategies for growth.",
    category: post.category || "General",
    date: post.published_at
      ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "Recently",
    readTime: "5 min read",
    imageUrl: post.cover_image || "/fallback-blog.jpg",
  }));

  return (
    <section
      className="relative py-16 md:py-24 bg-white dark:bg-[#050b14] overflow-hidden normal-case!"
      id="insights"
    >
      {/* ── Mesh Orbs — same pattern as Testimonials & FAQ ── */}
      <div
        className="absolute -top-1/4 left-[-8%] w-[50%] h-[70%] rounded-full blur-3xl pointer-events-none animate-[pulse_9s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 right-[-8%] w-[45%] h-[65%] rounded-full blur-3xl pointer-events-none animate-[pulse_12s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }}
      />

      {/* Galaxy background (dark only) */}
      <div
        className="absolute hidden dark:block left-[-20%] top-[10%] w-150 h-150 md:w-300 md:h-300 pointer-events-none z-0 opacity-40 mix-blend-screen"
        style={{ transform: "rotateX(60deg) rotateY(15deg) rotateZ(-20deg)", transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 animate-[planetSpin_60s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
          <div className="absolute top-1/2 left-1/2 w-[30%] h-[30%] -translate-x-1/2 -translate-y-1/2 bg-rose-500/80 rounded-full blur-[60px]" />
          <div className="absolute top-1/2 left-1/2 w-[15%] h-[15%] -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full blur-[20px]" />
          <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-20 border-t-purple-500/40 border-r-transparent border-b-fuchsia-500/30 border-l-transparent blur-[15px] animate-[planetSpin_40s_linear_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-full border-40 border-t-transparent border-r-indigo-500/20 border-b-transparent border-l-blue-500/20 blur-[25px] animate-[planetSpin_50s_linear_infinite]" />
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 blur-[1px] animate-[planetSpin_30s_linear_infinite]" />
          <div className="absolute inset-8 rounded-full border-[3px] border-dotted border-pink-300/30 blur-[2px] animate-[planetSpin_25s_linear_infinite_reverse]" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-300">

        {/* ── Section Header — exact same pattern as Testimonials ── */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-[8vw] sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight flex flex-wrap justify-center gap-2"
          >
            <span className="text-primary-950 dark:text-white">Latest</span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">
              Insights
            </span>
            <span className="text-primary-950 dark:text-white">&</span>
            <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary-500 to-primary-600 dark:from-secondary-400 dark:to-primary-400">
              Strategies
            </span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="font-sans font-medium text-lg sm:text-xl lg:text-2xl leading-snug capitalize tracking-tight text-balance text-primary-700 dark:text-primary-300"
          >
            Industry-leading perspectives on{" "}
            <strong className="font-black text-primary-600 dark:text-primary-400">digital marketing</strong>,{" "}
            <strong className="font-black text-secondary-600 dark:text-secondary-400">growth engineering</strong>, and building{" "}
            <strong className="font-black text-primary-950 dark:text-white">iconic brands</strong>.
          </motion.p>
        </div>

        {/* ── Blog Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-14 md:mb-16 normal-case!">
          {displayPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.id}`}
                className="group relative flex flex-col h-full bg-primary-50 dark:bg-primary-950 rounded-3xl overflow-hidden border-2 border-primary-100 dark:border-primary-900 shadow-sm hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-[0_20px_60px_rgba(37,99,235,0.10)] dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)] transition-all duration-500 hover:-translate-y-2"
              >
                {/* Corner slash — same as Testimonials & FAQ */}
                <div
                  className="absolute bottom-0 right-0 w-[40%] h-[35%] pointer-events-none opacity-[0.07] dark:opacity-[0.12] group-hover:opacity-[0.13] dark:group-hover:opacity-[0.20] transition-opacity duration-500 z-10"
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-[25%] h-[22%] pointer-events-none opacity-[0.12] dark:opacity-[0.18] group-hover:opacity-[0.22] dark:group-hover:opacity-[0.30] transition-opacity duration-500 z-10"
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                  }}
                />

                {/* Cover Image */}
                <div className="relative aspect-3/2 w-full overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black capitalize tracking-widest bg-white/90 dark:bg-primary-950/80 backdrop-blur-md text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-800 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="relative z-10 flex flex-col grow p-5 sm:p-6 md:p-7 normal-case!">
                  <h3 className="font-sans font-black text-lg md:text-xl tracking-tight leading-snug mb-3 text-primary-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2 capitalize" style={{ textTransform: "none" }}>
                    {post.title}
                  </h3>

                  <p className="font-sans font-medium text-sm leading-relaxed grow mb-5 line-clamp-3 text-primary-700 dark:text-primary-300 normal-case!">
                    {post.excerpt}
                  </p>

                  {/* Footer meta */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-primary-100 dark:border-primary-800 mt-auto">
                    <div className="flex items-center gap-1.5 text-[11px] font-boldcapitalize tracking-widest text-secondary-600 dark:text-secondary-400">
                      <Calendar size={13} />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold capitalize tracking-widest text-primary-600 dark:text-primary-400">
                      <Clock size={13} />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
          className="text-center pb-4 md:pb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center justify-center py-4 px-8 rounded-full text-white text-sm font-black capitalize tracking-widest bg-linear-to-r from-primary-600 to-secondary-500 dark:from-primary-500 dark:to-secondary-400 hover:from-primary-500 hover:to-secondary-400 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-1 gap-2 group"
          >
            View All Articles
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
