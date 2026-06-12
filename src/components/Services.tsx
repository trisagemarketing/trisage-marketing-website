"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { services } from "@/data/services";
import { fadeUp, staggerContainer } from "@/lib/animations";

export default function Services() {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-950 transition-colors duration-300" id="services">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-5xl mx-auto mb-10 lg:mb-16">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm"
          >
            Our Services
          </motion.span>
          <motion.h1 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6"
          >
            End-to-End Solutions, Under One Roof
          </motion.h1>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-700 dark:text-gray-300 text-lg"
          >
            From branding to revenue management, we handle every aspect of your digital growth journey as a strategic long-term partner.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeUp}
            >
              <Link 
                href={`/services/${service.slug}`}
                className="group block bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 lg:p-8 hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-800 shadow-sm hover:shadow-2xl dark:hover:shadow-secondary-900/10 transition-all duration-300 relative overflow-hidden h-full hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 p-6 lg:p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-300 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 text-gray-900 dark:text-white">
                  <service.icon size={120} />
                </div>
                <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-xl shadow-sm flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 group-hover:bg-secondary-600 dark:group-hover:bg-secondary-600 group-hover:text-white dark:group-hover:text-white transition-all duration-300 relative z-10 border border-gray-100 dark:border-gray-700">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 relative z-10">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
