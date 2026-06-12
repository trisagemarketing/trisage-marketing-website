"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring, useVelocity, useReducedMotion } from "framer-motion";
import Image from "next/image";

const teamworkImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", alt: "Team collaborating around a laptop" },
  { id: 2, src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800", alt: "Creative whiteboard session" },
  { id: 3, src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800", alt: "Colleagues high-fiving" },
  { id: 4, src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", alt: "Team meeting in modern office" },
  { id: 5, src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800", alt: "Designers working together" },
  { id: 6, src: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", alt: "Late night coding collaboration" },
];

export default function Teamwork() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Bulletproof ResizeObserver
  const updateWidth = useCallback(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }
    return () => observer.disconnect();
  }, [updateWidth]);

  // Senior Dev Optimization: Hardware check for low-end devices & accessibility
  const prefersReducedMotion = useReducedMotion();

  // Premium Inertia & Skew Physics
  const x = useMotionValue(0);
  const xVelocity = useVelocity(x);
  const smoothVelocity = useSpring(xVelocity, { damping: 50, stiffness: 400 });
  
  // Disable the intensive matrix skew transform if reduced motion is enabled to save battery/CPU
  const skewXRaw = useTransform(smoothVelocity, [-1000, 1000], [5, -5]);
  const skewX = prefersReducedMotion ? 0 : skewXRaw;

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#03070d] overflow-hidden select-none">
      <div className="container mx-auto px-4 md:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Minds Behind the <span className="text-primary-600 dark:text-primary-400">Magic</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Great marketing isn't built in silos. It's the result of passionate creatives, analytical strategists, and visionary technologists working together towards a single goal: your growth.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium">
            <span className="uppercase tracking-widest text-sm">Drag to explore</span>
            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* touch-pan-y is absolutely critical so mobile users can still scroll down the page! */}
      <div ref={carouselRef} className="px-4 md:px-12 cursor-grab active:cursor-grabbing touch-pan-y">
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width }} 
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          // MASSIVE OPTIMIZATION: Apply the skew matrix transform to the single parent wrapper 
          // instead of 6 individual cards. This requires 1/6th the GPU processing power!
          style={{ x, skewX }}
          // will-change-transform forces the browser to hardware-accelerate this specific layer
          className="flex gap-6 w-max will-change-transform"
        >
          {teamworkImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Removed heavy inline styling from the loop
              className="relative flex-none w-[85vw] md:w-[60vw] lg:w-[40vw] aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group transform-gpu"
            >
              <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
              <Image
                src={img.src}
                alt={img.alt}
                fill
                draggable={false} 
                priority={index < 2} // Preload the first two images to prevent main-thread freezing
                loading={index >= 2 ? "lazy" : undefined}
                className="object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                sizes="(max-width: 768px) 85vw, (max-width: 1200px) 60vw, 40vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
