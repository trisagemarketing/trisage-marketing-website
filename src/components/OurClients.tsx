"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";

export default function OurClients() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#050b14] transition-colors duration-300" id="our-clients">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-[#2A3F64] dark:text-white"
          >
            Our Clients
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="w-full bg-[#EAF3F1] md:my-10 dark:bg-gray-900 rounded-4xl md:rounded-[3rem] py-8 md:py-12 shadow-sm overflow-hidden flex items-center relative"
        >
          {/* Gradient masks for smooth fade-in/fade-out at the edges (Fixed Safari hard-edge bug) */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-linear-to-r from-[#EAF3F1] to-[#EAF3F1]/0 dark:from-gray-900 dark:to-gray-900/0 z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-linear-to-l from-[#EAF3F1] to-[#EAF3F1]/0 dark:from-gray-900 dark:to-gray-900/0 z-10 pointer-events-none" />

          {/* Infinite Marquee Wrapper */}
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // 30 seconds for a smooth, readable scroll
            }}
            className="flex w-max items-center"
          >
            {/* First Set of Logos */}
            <div className="flex items-center justify-center pr-8 md:pr-12">
              <img
                src="/Frame 31.svg"
                alt="Our Clients"
                loading="lazy"
                decoding="async"
                className="h-20 md:h-28 w-auto max-w-none"
              />
            </div>
            
            {/* Duplicate Set of Logos for Seamless Looping */}
            <div className="flex items-center justify-center pr-8 md:pr-12">
              <img
                src="/Frame 31.svg"
                alt="Our Clients Duplicate"
                loading="lazy"
                decoding="async"
                className="h-20 md:h-28 w-auto max-w-none"
              />
            </div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
