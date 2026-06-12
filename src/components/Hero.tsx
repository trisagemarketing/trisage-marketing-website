"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="relative min-h-screen lg:min-h-[70vh] flex flex-col justify-center pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
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

            
            <motion.h1 variants={fadeUp} className="poppins-bold text-4xl md:text-5xl lg:text-[4rem] tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
              Crafting Content <br />
              that drives <br />
              <span className="text-primary-600 dark:text-primary-500 relative inline-block mt-2 md:mt-0">
                Revenue
              </span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Trisage Marketing is a 360° hospitality marketing partner helping hotels, resorts, restaurants, and hospitality brands grow visibility, direct bookings, guest engagement, and long-term revenue.
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5">
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
            <div className="relative aspect-square md:aspect-4/3 lg:aspect-4/3 w-full mt-10 lg:mt-0">
              {/* Top Right Image */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[60%] h-[75%] z-10 rounded-sm md:rounded-md overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800"
              >
                <Image
                  src="/Image 1.svg"
                  alt="Interior Design"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              {/* Bottom Left Image with offset border */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[5%] left-0 w-[80%] h-[55%] z-20"
              >
                {/* Decorative outline */}
                <div className="absolute -top-4 -left-4 md:-top-5 md:-left-5 w-full h-full border border-gray-800 dark:border-gray-400 z-0 rounded-sm md:rounded-md" />
                
                <div className="relative w-full h-full overflow-hidden shadow-2xl z-10 bg-gray-100 dark:bg-gray-800 rounded-sm md:rounded-md">
                  <Image
                    src="/Image 2.svg"
                    alt="Interior Design Couch"
                    fill
                    className="object-cover"
                    priority
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
