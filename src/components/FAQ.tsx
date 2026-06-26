"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/data/faqs";
import { Plus, Minus } from "lucide-react";
import { fadeUp } from "@/lib/animations";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-16 md:py-24 bg-white dark:bg-[#050b14] overflow-hidden">

      {/* ── Mesh Orbs (same pattern as Testimonials) ── */}
      <div
        className="absolute -top-1/4 -left-[10%] w-[50%] h-[80%] rounded-full blur-3xl pointer-events-none animate-[pulse_9s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-[10%] w-[45%] h-[70%] rounded-full blur-3xl pointer-events-none animate-[pulse_11s_ease-in-out_infinite_reverse]"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)" }}
      />

      {/* Ice Giant Planet (dark only) */}
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

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-4xl">

        {/* ── Section Header ── */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="font-sans font-black text-[8vw] sm:text-4xl md:text-6xl uppercase tracking-tight flex flex-wrap justify-center gap-2 mb-4"
          >
            <span className="text-primary-950 dark:text-white">Frequently</span>
            <span className="text-primary-800 dark:text-white">Asked</span>
             <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">Questions</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="font-sans font-medium text-lg sm:text-xl uppercase tracking-tight text-primary-700 dark:text-primary-300"
          >
            Everything you need to know about working with <strong className="font-black text-primary-950 dark:text-white">Trisage</strong>.
          </motion.p>
        </div>

        {/* ── FAQ Items ── */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
          className="space-y-3 md:space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl md:rounded-3xl border-2 transition-all duration-500 ${
                  isOpen
                    ? "border-primary-200 dark:border-primary-700 shadow-[0_8px_40px_rgba(37,99,235,0.10)] dark:shadow-[0_8px_40px_rgba(37,99,235,0.15)]"
                    : "border-primary-100 dark:border-primary-900 shadow-sm hover:border-primary-200 dark:hover:border-primary-800"
                } bg-primary-50 dark:bg-primary-950`}
              >
                {/* Corner Slash (same pattern as Testimonials) */}
                <div
                  className={`absolute bottom-0 right-0 w-[35%] h-[80%] pointer-events-none transition-opacity duration-500 ${isOpen ? "opacity-[0.10] dark:opacity-[0.18]" : "opacity-[0.05] dark:opacity-[0.08]"}`}
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  }}
                />
                <div
                  className={`absolute bottom-0 right-0 w-[20%] h-[60%] pointer-events-none transition-opacity duration-500 ${isOpen ? "opacity-[0.15] dark:opacity-[0.25]" : "opacity-[0.07] dark:opacity-[0.12]"}`}
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                  }}
                />

                {/* Question Row */}
                <button
                  className="relative z-10 w-full px-5 py-5 sm:px-7 sm:py-6 text-left flex justify-between items-center gap-4 focus:outline-none group"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span
                    className={`font-sans font-black text-base sm:text-lg md:text-xl uppercase tracking-tight transition-colors duration-300 ${
                      isOpen
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-primary-950 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* +/- Icon */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isOpen
                        ? "bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500 text-white rotate-0"
                        : "bg-white dark:bg-primary-900 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 group-hover:border-primary-400 dark:group-hover:border-primary-500"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="relative z-10 px-5 pb-6 sm:px-7 sm:pb-7 border-t-2 border-primary-100 dark:border-primary-800 pt-4">
                        {/* Two-tone answer text — same MissionVision pattern */}
                        <p className="font-sans font-medium text-base sm:text-lg leading-relaxed uppercase tracking-tight text-balance">
                          <span className="text-secondary-600 dark:text-secondary-400">{faq.answer}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
