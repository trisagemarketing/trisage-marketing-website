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
    <section className="relative pt-8 pb-20 md:pt-16 md:pb-32 bg-gray-50 dark:bg-[#050b14]/40 transition-colors duration-300 overflow-hidden" id="case-studies">
      
      {/* Majestic Spiral Galaxy Background (Hidden in Light Mode) */}
      <div className="absolute hidden dark:block left-[-20%] top-[10%] w-[600px] h-[600px] md:w-[1200px] md:h-[1200px] pointer-events-none z-0 opacity-40 mix-blend-screen" style={{
        transform: "rotateX(60deg) rotateY(15deg) rotateZ(-20deg)",
        transformStyle: "preserve-3d"
      }}>
        {/* Rotating Galaxy Core */}
        <div className="absolute inset-0 animate-[planetSpin_60s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
           {/* Core Glow */}
           <div className="absolute top-1/2 left-1/2 w-[30%] h-[30%] -translate-x-1/2 -translate-y-1/2 bg-rose-500/80 rounded-full blur-[60px]" />
           <div className="absolute top-1/2 left-1/2 w-[15%] h-[15%] -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full blur-[20px]" />
           
           {/* Spiral Arms (Using conic gradients & borders) */}
           <div className="absolute top-1/2 left-1/2 w-[80%] h-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[20px] border-t-purple-500/40 border-r-transparent border-b-fuchsia-500/30 border-l-transparent blur-[15px] animate-[planetSpin_40s_linear_infinite_reverse]" />
           <div className="absolute top-1/2 left-1/2 w-[100%] h-[100%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[40px] border-t-transparent border-r-indigo-500/20 border-b-transparent border-l-blue-500/20 blur-[25px] animate-[planetSpin_50s_linear_infinite]" />
           
           {/* Stardust particles in galaxy */}
           <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-white/20 blur-[1px] animate-[planetSpin_30s_linear_infinite]" />
           <div className="absolute inset-8 rounded-full border-[3px] border-dotted border-pink-300/30 blur-[2px] animate-[planetSpin_25s_linear_infinite_reverse]" />
        </div>
      </div>

      {/* 3D Gas Giant Planet (Right Side Blank Space Filler for Avyanta) */}
      <div className="absolute hidden dark:block right-[2%] bottom-[5%] w-[200px] h-[200px] md:w-[350px] md:h-[350px] pointer-events-none z-0" style={{
        animation: "planetFloat 8s ease-in-out infinite",
        transformStyle: "preserve-3d"
      }}>
        {/* Exo-Rings */}
        <div className="absolute top-1/2 left-1/2 w-[220%] h-[220%] pointer-events-none" style={{
          transform: "translate(-50%, -50%) rotateZ(15deg) rotateX(75deg)",
          transformStyle: "preserve-3d"
        }}>
          <div className="absolute inset-0 animate-[planetSpin_40s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0 border-[8px] border-purple-500/30 rounded-full blur-[2px]" />
            <div className="absolute inset-8 border-[2px] border-solid border-pink-400/40 rounded-full" />
            <div className="absolute inset-16 border-[1px] border-dashed border-fuchsia-300/50 rounded-full" />
          </div>
        </div>
        {/* Planet Sphere */}
        <div className="absolute inset-0 rounded-full" style={{
          transform: "translateZ(1px)",
          background: "radial-gradient(circle at 35% 35%, #e879f9 0%, #a21caf 40%, #030712 100%)",
          boxShadow: "0 0 60px 15px rgba(192, 38, 211, 0.2), inset -25px -25px 50px rgba(0, 0, 0, 0.9)",
        }}>
          {/* Atmospheric Swirls (Spinning on axis) */}
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden opacity-50 mix-blend-overlay">
             <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
                <div className="absolute inset-0 animate-[planetSpin_25s_linear_infinite]">
                  <div className="absolute top-[20%] left-[-10%] w-[120%] h-[30%] bg-white blur-[12px] transform rotate-12 rounded-[50%]" />
                  <div className="absolute top-[50%] left-[-10%] w-[120%] h-[20%] bg-purple-300 blur-[8px] transform -rotate-6 rounded-[50%]" />
                  <div className="absolute top-[75%] left-[10%] w-[120%] h-[15%] bg-pink-300 blur-[6px] transform rotate-6 rounded-[50%]" />
                  
                  {/* Great Storm */}
                  <div className="absolute top-[55%] left-[60%] w-[30%] h-[20%] bg-fuchsia-900 blur-[5px] rounded-full mix-blend-multiply" />
                  <div className="absolute top-[58%] left-[62%] w-[15%] h-[10%] bg-purple-400 blur-[3px] rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl space-y-24 md:space-y-40">
        
        {caseStudies.map((study, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div 
              key={study.id}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
              
              {/* Image/Visual Column */}
              <motion.div 
                variants={fadeUp}
                className="w-full lg:w-1/2 drop-shadow-2xl dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                <div 
                  className={`relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br ${study.imageColor} flex items-center justify-center group`}
                  style={{ 
                    clipPath: isEven 
                      ? "polygon(0 0, 100% 0, 100% 85%, 0 100%)" 
                      : "polygon(0 0, 100% 0, 100% 100%, 0 85%)",
                    borderTopLeftRadius: "2rem",
                    borderTopRightRadius: "2rem"
                  }}
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
                className="w-full lg:w-1/2 space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {study.headline}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-gray-200">Challenge & Solution: </strong> 
                    {study.challengeSolution}
                  </p>
                </div>

                {/* Results Grid */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <h4 className="text-sm uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-6">
                    Key Results
                  </h4>
                  <div className="grid grid-cols-2 gap-6 md:gap-8">
                    {study.results.map((result, i) => (
                      <div key={i} className="space-y-2">
                        <div className={`text-3xl md:text-4xl font-black ${result.highlight ? study.themeColor : "text-gray-900 dark:text-white"}`}>
                          {result.metric}
                        </div>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                          {result.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing Copy Blockquote */}
                <div className="relative pt-6">
                  <div className={`absolute left-0 top-6 bottom-0 w-1 rounded-full bg-gradient-to-b ${study.imageColor.replace('/20', '/100')}`} />
                  <p className="pl-6 text-lg md:text-xl font-medium text-gray-800 dark:text-gray-300 italic">
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
