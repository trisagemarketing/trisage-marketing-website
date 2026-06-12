"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp, Globe, CalendarCheck, Users, MonitorSmartphone, Star, MessageCircle } from "lucide-react";
import { fadeUp, fadeRight, staggerContainer } from "@/lib/animations";
import SocratesImg from "../../public/socrates-handrawn-vector-illustration.png";

const outcomes = [
  {
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
    text: "Maximise Revenue Opportunities",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: <Globe className="w-5 h-5 text-blue-500" />,
    text: "Improve Hotel Visibility",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: <CalendarCheck className="w-5 h-5 text-orange-500" />,
    text: "Increase Direct Bookings",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: <Users className="w-5 h-5 text-purple-500" />,
    text: "Strengthen Guest Engagement",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: <MonitorSmartphone className="w-5 h-5 text-indigo-500" />,
    text: "Build Stronger Digital Presence",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    icon: <Star className="w-5 h-5 text-yellow-500" />,
    text: "Improve Brand Perception",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
];

export default function DeviceManagement() {
  return (
    <section className="py-12 md:py-12 bg-white dark:bg-[#050b14] overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-50px" }}
            className="flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <motion.h2 
                variants={fadeUp}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight"
              >
                Marketing That <br className="hidden lg:block" /> Solves <span className="text-primary-600 dark:text-primary-400">Problems</span>
              </motion.h2>
              <motion.p 
                variants={fadeUp}
                className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-xl"
              >
                We do not believe in generic marketing. Every hospitality brand has a unique guest experience, location advantage, revenue challenge, and audience behaviour. Our work begins by understanding these realities and then building practical, customised solutions that help brands grow.
              </motion.p>
            </div>

            <div className="pt-4 space-y-4">
              <motion.h3 
                variants={fadeUp}
                className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white"
              >
                Core Outcomes
              </motion.h3>
              
              <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {outcomes.map((outcome, index) => (
                  <motion.div 
                    key={index}
                    variants={fadeRight}
                    className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                  >
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${outcome.bg}`}>
                    {outcome.icon}
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 font-medium text-sm md:text-base leading-tight">
                    {outcome.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Image Placeholder & Wavy Background */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-50px" }}
            variants={fadeUp}
            className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0"
          >
            {/* Soft Gray Organic Blob Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-20 flex items-center justify-center">
              <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-125 md:scale-150 text-gray-100 dark:text-gray-800" fill="currentColor">
                <path d="M410.5,302.5Q372,355,311,385.5Q250,416,183.5,389.5Q117,363,89,306.5Q61,250,91,194.5Q121,139,185.5,108.5Q250,78,321,98.5Q392,119,420.5,184.5Q449,250,410.5,302.5Z" />
              </svg>
            </div>

            {/* The User's Socrates Vector Image */}
            <div className="relative z-10 w-full h-full min-h-[400px] flex items-center justify-center pointer-events-none lg:-translate-x-4">
              <Image 
                src={SocratesImg}
                alt="Philosophy of Marketing"
                className="object-contain w-full h-auto drop-shadow-2xl dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.05)] scale-105 sm:scale-110 lg:scale-125 origin-center transition-transform duration-500"
                placeholder="blur"
                decoding="async"
                loading="lazy"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
