"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const caseStudies = [
  {
    id: "villasita",
    headline: "Proof of Impact: The Villasita Resort",
    challengeSolution: "Trisage implemented a targeted social media revival strategy, OTA optimisation, GMB enhancement, and premium content positioning to strengthen Villasita Resort’s digital presence, increase room night bookings, and improve local search visibility.",
    results: [
      { metric: "+94%", label: "Growth in Room Bookings", highlight: true },
      { metric: "+95%", label: "Increase in Room Nights", highlight: true },
      { metric: "₹8.46L", label: "Revenue Generated Online", highlight: true },
      { metric: "21,877+", label: "Google Business Profile Views" },
      { metric: "2,381+", label: "Customer Actions Generated" },
    ],
    closingCopy: "The campaign delivered massive improvement in online visibility, guest engagement, and direct customer interest.",
    imageColor: "from-blue-500/20 to-cyan-500/20",
    themeColor: "text-blue-600 dark:text-blue-400",
    themeHighlight: "text-blue-400",
    imageUrl: "/hero-front.jpg"
  },
  {
    id: "avyanta",
    headline: "Proof of Impact: Avyanta Hotels",
    challengeSolution: "Trisage implemented a luxury-focused digital branding, social media growth strategy, premium storytelling content, and visibility-driven hospitality marketing approach to strengthen Avyanta Hotels’ online presence and audience engagement.",
    results: [
      { metric: "+180%", label: "Growth in Social Media Reach", highlight: true },
      { metric: "+140%", label: "Increase in Audience Engagement", highlight: true },
      { metric: "Premium", label: "Luxury Brand Positioning Established" },
      { metric: "Visuals", label: "Strong Improvement in Storytelling" },
      { metric: "Visibility", label: "Enhanced Online Instagram Presence" },
    ],
    closingCopy: "Avyanta Hotels was successfully positioned as a premium hospitality destination through aesthetic content strategy, luxury-focused branding, and engaging digital storytelling.",
    imageColor: "from-purple-500/20 to-pink-500/20",
    themeColor: "text-purple-600 dark:text-purple-400",
    themeHighlight: "text-purple-400",
    imageUrl: "/hero-back.jpg"
  }
];

export default function CaseStudies() {
  return (
    <section className="relative pt-8 pb-20 md:pt-16 md:pb-32 bg-gray-50 dark:bg-transparent overflow-hidden" id="case-studies">
      


      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl space-y-24 md:space-y-40">
        
        {/* SVG Definitions for Advanced Curve Masking */}
        <svg width="0" height="0" className="absolute pointer-events-none">
          <defs>
            {/* Concave curve on the right edge (for image on left) */}
            <clipPath id="curve-right" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 L 1,0 Q 0.7,0.5 1,1 L 0,1 Z" />
            </clipPath>
            {/* Concave curve on the left edge (for image on right) */}
            <clipPath id="curve-left" clipPathUnits="objectBoundingBox">
              <path d="M 0,0 Q 0.3,0.5 0,1 L 1,1 L 1,0 Z" />
            </clipPath>
          </defs>
        </svg>

        {caseStudies.map((study, index) => {
          const isEven = index % 2 === 0;
          const clipMask = isEven ? "url(#curve-right)" : "url(#curve-left)";
          
          return (
            <motion.div 
              key={study.id}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
              
              {/* Image/Visual Column */}
              <motion.div 
                variants={fadeUp}
                className="w-full lg:w-1/2 drop-shadow-2xl dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div 
                  className={`relative w-full aspect-[4/3] bg-gradient-to-br ${study.imageColor} flex items-center justify-center group`}
                  style={{ clipPath: clipMask }}
                >
                  {/* High-end luxury hotel stock image with sharp Tilt crop */}
                  <Image 
                    src={study.imageUrl}
                    alt={study.headline}
                    fill
                    className="object-cover transform-gpu group-hover:scale-105 transition-transform duration-[1.5s] ease-out will-change-transform"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Holographic "Holosphere" Sparkle Effect Overlay - Hardware Accelerated */}
                  <div className="absolute inset-0 z-10 mix-blend-screen opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden transform-gpu will-change-opacity backface-hidden">
                    {/* Glowing Iridescent Orbs */}
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4], x: [0, 30, 0] }} 
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#8a2be2]/40 rounded-full blur-[80px] md:blur-[100px] transform-gpu will-change-transform backface-hidden" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3], y: [0, -40, 0] }} 
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#00ffff]/40 rounded-full blur-[80px] md:blur-[100px] transform-gpu will-change-transform backface-hidden" 
                    />
                    
                    {/* Floating Sparkles */}
                    <motion.div animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="absolute top-[20%] left-[25%] text-white/80 transform-gpu will-change-transform backface-hidden">
                      <Sparkles className="w-6 h-6" />
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.5, 0.8], rotate: [0, 90, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1.2 }} className="absolute bottom-[35%] right-[20%] text-white/60 transform-gpu will-change-transform backface-hidden">
                      <Sparkles className="w-8 h-8" />
                    </motion.div>
                    <motion.div animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, delay: 2 }} className="absolute top-[45%] left-[60%] text-white/90 transform-gpu will-change-transform backface-hidden">
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Content Column */}
              <motion.div 
                variants={fadeUp}
                className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center"
              >
                <div className="space-y-3">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-gray-900 dark:text-white tracking-tight">
                    {study.headline}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-gray-200">Challenge & Solution: </strong> 
                    {study.challengeSolution}
                  </p>
                </div>

                {/* Results Grid */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="text-xs md:text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-4">
                    Key Results
                  </h4>
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {study.results.map((result, i) => (
                      <div key={i} className="space-y-1">
                        <div className={`text-2xl md:text-3xl font-black ${result.highlight ? study.themeColor : "text-gray-900 dark:text-white"}`}>
                          {result.metric}
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing Copy Blockquote */}
                <div className="relative pt-4">
                  <div className={`absolute left-0 top-4 bottom-0 w-1 rounded-full bg-gradient-to-b ${study.imageColor.replace('/20', '/100')}`} />
                  <p className="pl-5 text-base md:text-lg font-medium text-gray-800 dark:text-gray-300 italic">
                    &quot;{study.closingCopy}&quot;
                  </p>
                </div>
              </motion.div>

            </motion.div>
          );
        })}
        
      </div>
    </section>
  );
}
