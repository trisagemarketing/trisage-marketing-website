"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";

const processSteps = [
  {
    num: "01",
    title: "Discovery",
    description: "Deep dive into your business model, target audience, and current digital footprint.",
  },
  {
    num: "02",
    title: "Strategy",
    description: "Develop a comprehensive, data-backed roadmap tailored to your specific growth objectives.",
  },
  {
    num: "03",
    title: "Execution",
    description: "Implement campaigns across chosen channels with precision and high-quality creative assets.",
  },
  {
    num: "04",
    title: "Optimization",
    description: "Continuous A/B testing, data analysis, and refinement to maximize ROI and lower CAC.",
  },
  {
    num: "05",
    title: "Growth",
    description: "Scale winning campaigns aggressively while exploring new avenues for expansion.",
  },
];

export default function Process() {
  return (
    <section className="pt-12 md:pt-16 pb-4 md:pb-6 bg-white dark:bg-[#050b14] overflow-hidden ">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm block mb-4"
          >
            How We Work
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Our Growth Methodology
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-lg"
          >
            A systematic, predictable approach to scaling your digital presence.
          </motion.p>
        </div>

        <div className="relative">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative"
          >
            {processSteps.map((step, index) => (
              <motion.div key={index} variants={fadeUp} className="relative group cursor-default bg-white dark:bg-gray-900/40 p-6 md:p-8 lg:p-4 lg:bg-transparent lg:dark:bg-transparent rounded-3xl lg:rounded-none border border-gray-100 dark:border-gray-800 lg:border-none shadow-sm lg:shadow-none hover:shadow-xl lg:hover:shadow-none transition-all duration-300">
                
                {/* Connecting Lines mapped perfectly to the center of the elements */}
                {index !== processSteps.length - 1 && (
                  <>
                    {/* Desktop Horizontal Line (Only show on desktop where cards are transparent) */}
                    <div className="hidden lg:block absolute top-12 left-1/2 w-[calc(100%+1.5rem)] h-[2px] border-t-2 border-dashed border-gray-200 dark:border-gray-800 z-0" />
                  </>
                )}

                {/* Number Circle */}
                <div className="bg-white dark:bg-[#050b14] w-16 h-16 rounded-full border-[3px] border-primary-50 dark:border-gray-800 group-hover:border-secondary-500 dark:group-hover:border-secondary-500 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl mx-auto shadow-[0_0_0_4px_rgba(255,255,255,1)] dark:shadow-[0_0_0_4px_#050b14] lg:shadow-none mb-6 group-hover:bg-secondary-600 group-hover:text-white dark:group-hover:bg-secondary-600 dark:group-hover:text-white group-hover:scale-110 transition-all duration-300 relative z-10">
                  {step.num}
                </div>
                
                {/* Content */}
                <div className="text-center relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors bg-white dark:bg-[#050b14] lg:bg-transparent inline-block px-2">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
