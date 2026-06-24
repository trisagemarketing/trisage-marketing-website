"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";
import { fadeUp, blurIn, scaleIn, staggerContainer } from "@/lib/animations";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="relative py-6 md:py-16 bg-white dark:bg-[#050b14]/50 overflow-hidden ">
      
      {/* Kepler Exoplanet (Hidden in Light Mode) */}
      <div className="absolute hidden dark:block right-[-10%] top-[10%] w-[120px] h-[120px] md:w-[320px] md:h-[320px] pointer-events-none z-0" style={{
        animation: "planetBounce 22s infinite",
        animationDelay: "-5s",
        transformStyle: "preserve-3d"
      }}>
        {/* Exo-Rings */}
        <div className="absolute top-1/2 left-1/2 w-[240%] h-[240%] pointer-events-none" style={{
          transform: "translate(-50%, -50%) rotateZ(-25deg) rotateX(70deg)",
          transformStyle: "preserve-3d"
        }}>
          <div className="absolute inset-0 animate-[planetSpin_25s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0 border-[4px] border-cyan-400/20 rounded-full" />
            <div className="absolute inset-4 border-[2px] border-dashed border-teal-300/30 rounded-full" />
            <div className="absolute inset-10 border-[1px] border-blue-500/40 rounded-full" />
          </div>
        </div>
        {/* Planet Sphere */}
        <div className="absolute inset-0 rounded-full" style={{
          transform: "translateZ(1px)",
          background: "radial-gradient(circle at 30% 30%, #67e8f9 0%, #0891b2 40%, #0f172a 100%)",
          boxShadow: "0 0 40px 10px rgba(6, 182, 212, 0.2), inset -20px -20px 40px rgba(0, 0, 0, 0.8)",
        }}>
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
             <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%) rotate(-25deg)" }}>
                <div className="absolute top-0 left-0 h-full w-[200%] animate-[planetPan_30s_linear_infinite]">
                  <div className="absolute w-[50%] h-full left-0">
                    <div className="absolute w-full h-[20%] bg-teal-900/40 top-[20%] filter blur-[3px]" />
                    <div className="absolute w-full h-[15%] bg-cyan-200/10 top-[60%] filter blur-[2px]">
                       <div className="absolute w-[15%] h-[200%] bg-white/20 rounded-full left-[30%] blur-[2px]" />
                    </div>
                  </div>
                  <div className="absolute w-[50%] h-full left-[50%]">
                    <div className="absolute w-full h-[20%] bg-teal-900/40 top-[20%] filter blur-[3px]" />
                    <div className="absolute w-full h-[15%] bg-cyan-200/10 top-[60%] filter blur-[2px]">
                       <div className="absolute w-[15%] h-[200%] bg-white/20 rounded-full left-[30%] blur-[2px]" />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={blurIn}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Client Success Stories
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-lg"
          >
            Don't just take our word for it. Here's what our partners have to say about working with Trisage.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={scaleIn}
              className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-primary-900/10 transition-shadow"
            >
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed">
                "{testimonial.review}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random&color=fff&size=100`}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
