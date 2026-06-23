"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { services } from "@/data/services";
import { fadeUp, staggerContainer } from "@/lib/animations";

function ServiceFlipCard({ service, isFlipped, onFlip }: { service: typeof services[0], isFlipped: boolean, onFlip: () => void }) {
  return (
    <div 
      className="relative w-full h-full min-h-[320px] cursor-pointer group mt-8"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* ====== FRONT FACE ====== */}
        <div 
          className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-gray-800 flex flex-col pt-12 pb-6 px-6 text-center"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          {/* Top Overlapping Tab */}
          <div className="absolute -top-[28px] left-1/2 -translate-x-1/2 w-[80px] h-[56px] drop-shadow-sm z-10">
            <svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white dark:text-gray-900">
              <path d="M0 0 H80 L65 56 H15 Z" fill="currentColor" />
              <path d="M0 0 H80 L65 56 H15 Z" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pb-2 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
              <service.icon size={26} strokeWidth={2} />
            </div>
          </div>

          <div className="flex flex-col flex-grow items-center justify-center mt-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">{service.title}</h3>
            
            {service.subheading && (
              <h4 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3 leading-snug">
                {service.subheading}
              </h4>
            )}
            
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {service.description}
            </p>

            <div className="w-10 h-10 mt-auto rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-secondary-600 dark:group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md shrink-0">
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* ====== BACK FACE ====== */}
        <div 
          className="absolute inset-0 w-full h-full bg-primary-600 dark:bg-primary-900 text-white rounded-2xl shadow-xl p-6 flex flex-col justify-between overflow-hidden"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          {/* Faint Background Icon */}
          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
             <service.icon size={160} />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="shrink-0 border-b border-white/20 pb-3 mb-3">
              <h3 className="text-lg font-bold mb-1">{service.title}</h3>
              {service.subheading && (
                <h4 className="text-sm font-medium text-primary-200 leading-snug">
                  {service.subheading}
                </h4>
              )}
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-2 flex flex-col gap-2 text-primary-50">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">Includes:</span>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm leading-snug">
                    <span className="text-white opacity-50 mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-white/20">
             <Link 
               href={`/services/${service.slug}`} 
               className="text-sm font-semibold hover:text-white text-primary-100 flex items-center gap-1 group/link"
               onClick={(e) => e.stopPropagation()}
             >
               View Service <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
             </Link>
             
             <button 
               className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
               onClick={(e) => {
                 e.stopPropagation();
                 onFlip();
               }}
               aria-label="Flip back"
             >
               <RotateCcw size={14} />
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const [flippedCardId, setFlippedCardId] = useState<string | number | null>(null);

  return (
    <section className="py-12 md:py-16 bg-[#fafbfc] dark:bg-gray-950 transition-colors duration-300" id="services">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-5xl mx-auto mb-10 lg:mb-16">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm"
          >
            Our Services
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6"
          >
            Build a Brand Guests Remember
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-lg"
          >
            From branding to revenue management, we handle every aspect of your digital growth journey.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14"
        >
          {services.map((service) => (
            <motion.div key={service.id} variants={fadeUp} className="h-full">
              <ServiceFlipCard 
                service={service} 
                isFlipped={flippedCardId === service.id}
                onFlip={() => setFlippedCardId(flippedCardId === service.id ? null : service.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
