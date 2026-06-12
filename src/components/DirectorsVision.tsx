"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react"; // Using lucide-react Quote icon as a fallback if custom SVG isn't desired, but custom SVG is better for exact match.

// Custom SVG for the exact quote marks in the image
const QuoteMark = ({ className }: { className?: string }) => (
  <svg 
    width="48" height="48" viewBox="0 0 24 24" fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 9C10 7.34315 8.65685 6 7 6C5.34315 6 4 7.34315 4 9C4 11.2091 5.79086 13 8 13V15C4.68629 15 2 12.3137 2 9C2 6.23858 4.23858 4 7 4C9.76142 4 12 6.23858 12 9V14H10V9ZM22 9C22 7.34315 20.6569 6 19 6C17.3431 6 16 7.34315 16 9C16 11.2091 17.7909 13 20 13V15C16.6863 15 14 12.3137 14 9C14 6.23858 16.2386 4 19 4C21.7614 4 24 6.23858 24 9V14H22V9Z" />
  </svg>
);

export default function DirectorsVision() {
  return (
    <section className="pt-12 pb-4 md:pt-16 md:pb-8 bg-gray-50 dark:bg-[#050b14] transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-primary-900 shadow-2xl"
        >
          {/* Topographical Wavy Background Pattern (CSS SVG generation) */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,150 Q150,100 300,150 T600,150 T900,150 T1200,150' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,250 Q200,200 400,250 T800,250 T1200,250' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,350 Q100,300 200,350 T400,350 T600,350 T800,350 T1000,350 T1200,350' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,450 Q250,400 500,450 T1000,450 T1200,450' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,550 Q150,500 300,550 T600,550 T900,550 T1200,550' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,650 Q200,600 400,650 T800,650 T1200,650' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3Cpath d='M0,750 Q100,700 200,750 T400,750 T600,750 T800,750 T1000,750 T1200,750' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <div className="relative z-10 py-10 px-5 sm:px-8 md:py-16 md:px-16 lg:px-24 flex flex-col items-center">
            
            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-16 text-center">
              Director's Vision
            </h2>

            <div className="w-full relative px-0 sm:px-4 md:px-12 mt-4 md:mt-0">
              {/* Top Left Quote */}
              <div className="absolute -top-10 -left-1 md:-top-12 md:-left-6 text-white">
                <QuoteMark className="w-10 h-10 md:w-16 md:h-16 opacity-90" />
              </div>

              {/* Main Text Content */}
              <div className="text-white space-y-5 md:space-y-8 text-center text-[15px] sm:text-base md:text-lg lg:text-xl font-medium leading-[1.7] md:leading-relaxed px-2 sm:px-4 md:px-8">
                <p>
                  At Trisage Marketing, we believe every hotel has a unique story, experience, and identity that deserves to be presented in the best possible way.
                </p>
                <p>
                  Our vision is to help hospitality brands create stronger digital identities, connect better with their audience, and achieve consistent business growth through strategic marketing and revenue-focused solutions.
                </p>
                <p>
                  We aim to transform hospitality brands through innovation, creativity, and data-driven execution while maintaining the essence of hospitality and guest experience.
                </p>
              </div>

              {/* Bottom Right Quote */}
              <div className="absolute -bottom-8 -right-1 md:-bottom-12 md:-right-6 text-white rotate-180">
                <QuoteMark className="w-10 h-10 md:w-16 md:h-16 opacity-90" />
              </div>
            </div>

            {/* Bottom Signatures */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-0 mt-16 md:mt-24 px-0 md:px-8">
              <div className="text-center sm:text-left">
                <h4 className="text-white font-bold text-lg md:text-xl mb-1">Sachin Dubey</h4>
                <p className="text-white/60 text-xs md:text-sm font-medium">Director</p>
              </div>
              <div className="text-center sm:text-right">
                <h4 className="text-white font-bold text-lg md:text-xl mb-1">Harsh Raj Parmar</h4>
                <p className="text-white/60 text-xs md:text-sm font-medium">Director</p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
