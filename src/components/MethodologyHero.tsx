"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function MethodologyHero() {
  return (
    <div className="relative pt-40 pb-24 text-center overflow-hidden">
      {/* Background Group Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80" 
          alt="Trisage Methodology and Strategy" 
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
        {/* Opacity Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/80 z-10" />
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
          className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg tracking-tight"
        >
          The Zero Gap Advantage
        </motion.h1>
        <motion.p 
          variants={fadeUp}
          className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto drop-shadow-md font-medium"
        >
          Trisage is uniquely structured to connect guest psychology directly with hotel profitability. We combine 360° touchpoint control with hospitality-centric data so every piece of creative content is engineered to drive targeted yield and long-term asset value.
        </motion.p>
      </motion.div>
    </div>
  );
}
