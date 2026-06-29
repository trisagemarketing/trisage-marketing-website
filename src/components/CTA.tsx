"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeLeft, springUp } from "@/lib/animations";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="cta-section" className="relative py-12 md:py-16 overflow-hidden bg-primary-600 dark:bg-primary-900 ">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay dark:mix-blend-lighten" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-700/80 to-primary-500/80 dark:from-primary-950/80 dark:to-primary-800/80" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeLeft}
            className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
          >
            Ready to scale your business to new heights?
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}
            className="text-xl text-primary-100 dark:text-primary-200 mb-10 max-w-2xl mx-auto"
          >
            Join the ambitious brands that trust Trisage Marketing to drive their digital growth. Let&apos;s build something exceptional together.
          </motion.p>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={springUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/clients" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-primary-900 dark:text-primary-900 bg-white dark:bg-gray-50 hover:bg-gray-50 dark:hover:bg-white rounded-full transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto">
              Book Your Free Consultation
            </Link>
            <Link href="/services" className="inline-flex justify-center items-center gap-2 px-8 py-4 text-base font-semibold text-white border border-primary-400 dark:border-primary-600 hover:bg-primary-700/50 dark:hover:bg-primary-800/50 rounded-full transition-all w-full sm:w-auto">
              Explore Services <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
