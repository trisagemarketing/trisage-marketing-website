"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { caseStudies } from "@/data/caseStudies";
import { fadeUp } from "@/lib/animations";
import { ArrowRight } from "lucide-react";

export default function CaseStudies() {
  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" id="case-studies">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6 lg:gap-8">
          <div className="max-w-2xl text-left">
            <motion.h2 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight"
            >
              Proven Results
            </motion.h2>
            <motion.p 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed"
            >
              Explore how we've helped leading brands overcome challenges and achieve unprecedented growth.
            </motion.p>
          </div>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-2 lg:mt-0"
          >
            <a 
              href="/case-studies"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium px-6 py-3.5 md:py-3 rounded-full transition-all duration-300 w-full sm:w-auto shadow-md hover:shadow-lg active:scale-95"
            >
              View All Case Studies <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-950 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group cursor-pointer hover:shadow-xl dark:hover:shadow-primary-900/10 transition-all"
            >
              <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src="/case-study-placeholder.png"
                  alt={study.client}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 md:p-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{study.client}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-2">{study.problem}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 pt-6 border-t border-gray-100 dark:border-gray-800 mt-6">
                  {study.metrics.map((metric, i) => (
                    <div key={i}>
                      <p className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">{metric.value}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mt-1">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
