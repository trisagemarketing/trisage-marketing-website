"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, blurIn, springUp } from "@/lib/animations";
import HeroBack from "../../public/hero-back.jpg";
import HeroFront from "../../public/hero-front.jpg";

export default function Hero() {
  return (
    <section className="relative min-h-screen lg:min-h-[70vh] flex flex-col justify-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-transparent ">
      {/* Background Decor - Extremely subtle proper gradient for pure white/dark */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-125 bg-linear-to-b from-primary-50/50 dark:from-primary-900/10 to-transparent" />
        <div className="absolute top-20 right-10 w-150 h-150 bg-primary-400/5 dark:bg-primary-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-125 h-125 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >

            
            <motion.h1 variants={blurIn} className="poppins-bold text-4xl md:text-5xl lg:text-[4rem] tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
              Crafting Content <br />
              that drives <br />
              <span className="text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-amber-500 via-teal-500 to-amber-500 animate-[bgPan_6s_linear_infinite] dark:text-primary-500 dark:bg-none relative inline-block mt-2 md:mt-0 pb-2">
                Revenue
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Trisage Marketing is a 360° hospitality marketing partner helping hotels, resorts, restaurants, and hospitality brands grow visibility, direct bookings, guest engagement, and long-term revenue.
            </motion.p>
            
            <motion.div variants={springUp} className="flex flex-col sm:flex-row gap-5">
              <a 
                href="#why-choose-us" 
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 rounded-full transition-all shadow-lg hover:shadow-secondary-600/25 dark:hover:shadow-secondary-500/25 hover:-translate-y-1"
              >
                Know More
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:ml-auto w-full max-w-lg xl:max-w-xl mx-auto lg:mx-0 lg:ml-auto"
          >
            <div className="relative w-full mt-12 lg:mt-0 pb-[15%] md:pb-[20%] lg:pb-[15%]">
              {/* Top Right Image (Relative to dictate height naturally) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative ml-auto w-[85%] md:w-[80%] lg:w-[75%] z-10"
              >
                <Image
                  src={HeroBack}
                  alt="Hero Back"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto drop-shadow-[0_20px_40px_rgba(245,158,11,0.3)] dark:drop-shadow-[0_20px_40px_rgba(92,122,224,0.15)] rounded-sm md:rounded-md"
                  placeholder="blur"
                  priority
                  fetchPriority="high"
                  decoding="async"
                />
              </motion.div>
              
              {/* Bottom Left Image (Absolute to overlap, forced rectangle) */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-5%] md:bottom-[-15%] left-0 w-[95%] md:w-[90%] lg:w-[90%] z-20"
              >
                {/* Decorative outline */}
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-full h-full border-2 border-gray-800 dark:border-gray-400 z-0 rounded-sm md:rounded-md" />
                
                <div className="relative w-full aspect-[4/3] md:aspect-[16/10] z-10 overflow-hidden shadow-[0_30px_60px_rgba(20,184,166,0.25)] dark:shadow-[0_30px_60px_rgba(92,122,224,0.2)] rounded-sm md:rounded-md">
                  <Image
                    src={HeroFront}
                    alt="Hero Front"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    placeholder="blur"
                    priority
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
