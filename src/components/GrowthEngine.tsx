"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { TrendingUp, CalendarDays, Smartphone, Star } from "lucide-react";

const growthDrivers = [
  {
    title: "Direct Booking Growth",
    description: "Drive reservations through brand-owned channels and reduce OTA dependency.",
    icon: TrendingUp
  },
  {
    title: "Seasonal Campaigns",
    description: "Plan demand-led campaigns for festivals, off-season, weddings, and MICE.",
    icon: CalendarDays
  },
  {
    title: "Guest-Facing Content",
    description: "Create reels, stories, menus, tours, and visual assets that convert.",
    icon: Smartphone
  },
  {
    title: "Reputation Engine",
    description: "Strengthen trust through review responses, listings, and on-property nudges.",
    icon: Star
  }
];

export default function GrowthEngine() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900 ">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
          <motion.span 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-primary-500 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4 block"
          >
            GROWTH ENGINE
          </motion.span>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Marketing That Fills Rooms and Tables
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-xl text-gray-700 dark:text-gray-300"
          >
            Our hospitality growth engine is designed to move guests from discovery to trust, engagement, and booking.
          </motion.p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {growthDrivers.map((driver, index) => {
            const Icon = driver.icon;
            return (
              <motion.div 
                key={index} 
                variants={fadeUp} 
                className="bg-white dark:bg-[#0a1220] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {driver.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {driver.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
