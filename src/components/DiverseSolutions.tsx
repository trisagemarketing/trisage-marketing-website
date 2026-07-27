"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const solutions = [
  {
    title: "HomeStay Marketing",
    category: "HOMESTAY",
    description: "Rank locally on Google & drive direct bookings",
    image: "https://ik.imagekit.io/rrcdbevrb/homestay_market",
  },
  {
    title: "Airbnb Marketing",
    category: "AIRBNB",
    description: "Attract more guests & reduce commission costs",
    image: "https://ik.imagekit.io/rrcdbevrb/airbnb_img",
  },
  {
    title: "Villas Marketing",
    category: "VILLAS",
    description: "Promote luxury stays & attract high-value travelers",
    image: "https://ik.imagekit.io/rrcdbevrb/vilias_market",
  },
  {
    title: "Glamping Marketing",
    category: "GLAMPING",
    description: "Elevate your outdoor luxury experience & capture unique stays",
    image: "https://ik.imagekit.io/rrcdbevrb/glamping_market",
  },
  {
    title: "Cafe Marketing",
    category: "CAFE",
    description: "Drive foot traffic and build local community engagement",
    image: "https://ik.imagekit.io/rrcdbevrb/cafe_marketing",
  },
  {
    title: "Restaurant Marketing",
    category: "RESTAURANT",
    description: "Fill tables consistently and enhance your dining brand",
    image: "https://ik.imagekit.io/rrcdbevrb/restro_makret",
  },
  {
    title: "Hotel Marketing",
    category: "HOTEL",
    description: "Maximize occupancy rates across all seasons",
    image: "https://ik.imagekit.io/rrcdbevrb/hotel_market",
  },
  {
    title: "Resort Marketing",
    category: "RESORT",
    description: "Increase occupancy & build premium brand value",
    image: "https://ik.imagekit.io/rrcdbevrb/resort_market",
  }
];

/* Apple visionOS Liquid Glass Capsule Component */
function AppleLiquidGlassTag({ title }: { title: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const tagRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tagRef.current) return;
    const rect = tagRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const firstWord = title.split(' ')[0].toUpperCase();
  const restWord = title.split(' ').slice(1).join(' ').toUpperCase();

  return (
    <motion.div
      ref={tagRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative inline-flex items-center justify-center px-5 py-2.5 rounded-full select-none cursor-pointer overflow-hidden transform-gpu",
        "apple-liquid-glass-tag",
        "shadow-[0_15px_35px_-5px_rgba(0,0,0,0.5)]"
      )}
    >
      {/* Top Glass Rim Specular Highlight */}
      <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none rounded-full opacity-90" />

      {/* Internal Liquid Reflection Gliding Beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        <div className="w-[40%] h-[300%] bg-gradient-to-r from-transparent via-white/40 to-transparent -top-[100%] animate-[specular-sheen_7s_cubic-bezier(0.16,1,0.3,1)_infinite] pointer-events-none" />
      </div>

      {/* Interactive Cursor Proximity Light Spot */}
      {isHovered && (
        <div 
          className="absolute -inset-px pointer-events-none transition-opacity duration-300 rounded-full"
          style={{
            background: `radial-gradient(90px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.45), transparent 80%)`,
          }}
        />
      )}

      {/* Water Drop Embedded Typography (Strictly using Design System Tokens) */}
      <div className="relative z-10 flex items-center gap-1.5 font-black tracking-tight text-xs sm:text-sm uppercase">
        <span className="text-secondary-400 dark:text-secondary-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {firstWord}
        </span>
        <span className="text-white dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          {restWord}
        </span>
      </div>
    </motion.div>
  );
}

export default function DiverseSolutions() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full pt-16 pb-12 md:pt-24 md:pb-16 bg-white dark:bg-[#050b14] overflow-hidden" id="hospitality-solutions">
      
      {/* ── Cool Glassmorphic Ambient Background Aura ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[550px] bg-secondary-500/10 dark:bg-secondary-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Floating Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/3 w-96 h-96 bg-primary-500/10 dark:bg-primary-600/15 rounded-full blur-[120px] animate-[planetFloat_16s_infinite]" />
        <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-secondary-400/10 dark:bg-secondary-500/15 rounded-full blur-[120px] animate-[planetFloat_20s_infinite_reverse]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-350 relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="text-secondary-600 dark:text-secondary-400 font-extrabold tracking-widest uppercase text-xs sm:text-sm block mb-3">
              Specialized Industry Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-[1.2] tracking-tight">
              MARKETING SOLUTIONS FOR EVERY TYPE OF{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 via-teal-400 to-primary-500 dark:from-secondary-400 dark:to-teal-300">
                HOSPITALITY BUSINESS
              </span>
            </h2>
          </motion.div>
        </div>

        {/* CSS Marquee Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full pb-8 overflow-hidden"
        >
          <style>
            {`
              @keyframes marketing-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marketing-marquee {
                animation: marketing-marquee 40s linear infinite;
              }
              .animate-marketing-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className="animate-marketing-marquee flex w-max">
            {/* Double array for seamless infinite marquee loop */}
            {[...solutions, ...solutions].map((solution, index) => (
              <div key={index} className="shrink-0 w-[85vw] sm:w-85 md:w-100 lg:w-105 pr-6 h-auto">
                {/* 4:5 Aspect Ratio Glass Card Shell */}
                <div className="group relative w-full aspect-4/5 rounded-[2.2rem] overflow-hidden flex flex-col justify-between transform-gpu will-change-transform bg-gray-900 border border-white/20 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500">
                  
                  {/* Background Image with Hover Scale */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transform-gpu transition-transform duration-[1.5s] ease-out group-hover:scale-[1.05]"
                      quality={90}
                    />
                  </div>

                  {/* Gradient Contrast Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 z-10 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                  {/* Glassmorphism Inner Bevel Glow */}
                  <div className="absolute inset-0 border border-white/20 rounded-[2.2rem] z-20 pointer-events-none" />

                  {/* Content Container */}
                  <div className="relative z-30 p-6 md:p-8 flex flex-col h-full justify-between">
                    
                    {/* Top Content: Apple Liquid Glass Tag */}
                    <div className="flex justify-start items-center">
                      <AppleLiquidGlassTag title={solution.title} />
                    </div>

                    {/* Bottom Content: Description */}
                    <div className="translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-sm md:text-[15px] font-semibold leading-relaxed text-gray-200 drop-shadow-md">
                        <span className="text-teal-300 font-bold">{solution.description.split(' ')[0]}</span>{' '}
                        <span className="text-white">{solution.description.split(' ').slice(1).join(' ')}</span>
                      </p>
                    </div>
                    
                  </div>

                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
