"use client";

import { motion } from "framer-motion";
import { fadeUp, blurIn, scaleUp, staggerContainer } from "@/lib/animations";
import { Sparkles, Megaphone, Heart, CalendarCheck, Handshake } from "lucide-react";

const journeyPoints = [
  {
    title: "Stronger Branding",
    description: "Through strategic positioning",
    icon: Sparkles,
  },
  {
    title: "Increased Visibility",
    description: "Through creative digital solutions",
    icon: Megaphone,
  },
  {
    title: "Guest Engagement",
    description: "Through innovative execution",
    icon: Heart,
  },
  {
    title: "More Direct Bookings",
    description: "Through measurable campaigns",
    icon: CalendarCheck,
  },
  {
    title: "Long-Term Partnerships",
    description: "Focused on sustainable revenue",
    icon: Handshake,
  }
];

export default function CaseStudies() {
  return (
    <section className="py-12 md:py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" id="growth-journey">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-12">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={blurIn}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Growth <span className="text-[#243384] dark:text-[#5c7ae0]">Journey</span>
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A proven path to elevating your hospitality brand and driving sustainable, long-term revenue.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center"
        >
          {journeyPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={scaleUp}
              className={`bg-white dark:bg-gray-950 p-8 md:p-10 rounded-[2rem] shadow-sm hover:shadow-xl dark:shadow-none dark:border dark:border-gray-800 transition-all group ${
                index === 3 ? "lg:col-start-1 lg:ml-auto lg:mr-4 lg:w-[calc(100%-1rem)]" : ""
              } ${
                index === 4 ? "lg:col-start-2 lg:col-span-2 lg:mr-auto lg:ml-4 lg:w-[calc(50%-1rem)]" : ""
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#243384]/10 dark:bg-[#5c7ae0]/20 flex items-center justify-center mb-8 text-[#243384] dark:text-[#5c7ae0] group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <point.icon className="w-8 h-8" strokeWidth={2} />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">{point.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
