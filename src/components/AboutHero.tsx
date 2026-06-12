"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function AboutHero() {
  return (
    <div className="relative pt-40 pb-24 text-center overflow-hidden">
      {/* Background Group Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
          alt="Trisage Team working together" 
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Opacity Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 dark:bg-black/80 z-10" />
      </div>

      {/* Content */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-50px" }}
        className="relative z-20 container mx-auto px-4 md:px-8"
      >
        <motion.h1 
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
        >
          About Trisage
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-md font-medium"
        >
          We are a team of data-driven marketers, creative thinkers, and growth engineers dedicated to your success.
        </motion.p>
      </motion.div>
    </div>
  );
}
