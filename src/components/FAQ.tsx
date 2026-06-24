"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/faqs";
import { ChevronDown } from "lucide-react";
import { fadeUp } from "@/lib/animations";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-12 md:py-16 bg-gray-50 dark:bg-[#050b14]/20 transition-colors duration-300 overflow-hidden">
      
      {/* Ice Giant Planet */}
      <div className="absolute hidden dark:block right-[5%] top-[15%] w-[100px] h-[100px] md:w-[200px] md:h-[200px] pointer-events-none z-0" style={{
        animation: "planetBounce 15s infinite",
        animationDelay: "-2s",
      }}>
         <div className="absolute inset-0 rounded-full" style={{
            background: "radial-gradient(circle at 35% 35%, #93c5fd 0%, #3b82f6 40%, #1e3a8a 100%)",
            boxShadow: "0 0 40px 10px rgba(59, 130, 246, 0.2), inset -15px -15px 30px rgba(0, 0, 0, 0.7)",
         }}>
            <div className="absolute inset-0 rounded-full overflow-hidden animate-[planetSpin_40s_linear_infinite]">
               <div className="absolute top-[40%] left-[20%] w-[40%] h-[20%] bg-blue-900/30 blur-[4px] rounded-full" />
               <div className="absolute top-[60%] left-[60%] w-[30%] h-[15%] bg-indigo-900/40 blur-[3px] rounded-full" />
            </div>
         </div>
      </div>

      {/* Supernova Remnant */}
      <div className="absolute hidden dark:block left-[-10%] bottom-[20%] w-[300px] h-[300px] pointer-events-none z-0 mix-blend-screen animate-[planetSpin_120s_linear_infinite]">
         <div className="absolute inset-0 rounded-full border-[40px] border-orange-500/10 border-t-red-500/20 blur-[20px]" />
         <div className="absolute inset-10 rounded-full border-[20px] border-yellow-500/10 border-b-amber-500/20 blur-[15px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                className="w-full px-6 py-6 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? "rotate-180 text-primary-600 dark:text-primary-400" : ""}`} 
                  size={20} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
