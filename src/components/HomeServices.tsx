"use client";

import { motion } from "framer-motion";
import { Puzzle, Network, CheckCircle2, XCircle } from "lucide-react";
import { fadeUp, fadeLeft, fadeRight, blurIn } from "@/lib/animations";

const challenges = [
  "Low Occupancy",
  "Inconsistent Branding",
  "Weak Guest Engagement",
  "Heavy OTA Dependence"
];

const solutions = [
  "Higher Visibility",
  "Stronger Brand Presence",
  "More Direct Bookings",
  "Long-Term Brand Value"
];

export default function HomeServices() {
  return (
    <section className="py-16 md:py-16 lg:py-16 bg-[#fafbfc] dark:bg-[#03070d] transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 lg:mb-32">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={blurIn}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight"
          >
           From Hotel Challenges to <br className="md:hidden" />
           <span className="text-[#324b96] dark:text-[#5c7ae0]">Hospitality Growth</span>
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-gray-600 dark:text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed px-2"
          >
            Most hospitality brands struggle not because the property lacks potential, but because the digital ecosystem around the brand is incomplete. Weak visibility, inconsistent branding, low guest engagement, and high OTA dependency can quietly reduce revenue opportunities.
          </motion.p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-5xl mx-auto lg:pb-12">
          
          {/* Mobile/Tablet Vertical Dotted Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-[2px] border-dashed border-gray-300 dark:border-gray-700 lg:hidden z-0 opacity-50"></div>



          {/* Card 1: PROBLEM */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeLeft}
            className="relative z-10 w-[92%] sm:w-fit sm:min-w-[400px] lg:max-w-[60%] mx-auto lg:mx-0 lg:mr-auto mb-16 md:mb-24 lg:mb-32"
          >
            <div className="relative w-full mt-4 md:mt-8">
              {/* Tilted Blue Layer (23 deg left) */}
              <div 
                className="absolute bg-[#243384] z-0 shadow-[0_15px_40px_rgba(36,51,132,0.2)] rounded-3xl lg:rounded-[2.5rem]
                           -top-2 -bottom-2 -left-4 -right-4 
                           sm:-top-3 sm:-bottom-3 sm:-left-6 sm:-right-6 
                           lg:-top-[15px] lg:-bottom-[15px] lg:-left-[35px] lg:-right-[35px]
                           -skew-x-6 -rotate-3 sm:-skew-x-[10deg] sm:-rotate-[4deg] lg:-skew-x-[15deg] lg:-rotate-[6deg] transition-transform duration-300"
              ></div>
              
              {/* Main White Card */}
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl lg:rounded-[1.25rem] py-5 pr-6 sm:py-6 sm:pr-8 lg:py-7 lg:pr-10 pl-[70px] sm:pl-[90px] lg:pl-[120px] z-10 dark:border dark:border-gray-800">
                {/* Dynamic Dotted Swoosh Line */}
                <div 
                  className="absolute top-1/2 left-full w-[80px] lg:w-[150px] xl:w-[250px] h-[150px] border-t-[2px] border-r-[2px] border-dashed border-gray-400 dark:border-gray-600 rounded-tr-[50px] -z-10 hidden lg:block pointer-events-none"
                  style={{ maskImage: "linear-gradient(to bottom, black 10%, transparent 90%)", WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 90%)" }}
                ></div>
                {/* Right Edge Connection Dot */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-[7px] w-[14px] h-[14px] rounded-full bg-white dark:bg-gray-900 border-[3px] border-[#243384] dark:border-[#5c7ae0] hidden lg:block shadow-sm z-20"></div>

                {/* Ribbon */}
                <div 
                  className="absolute top-0 left-4 sm:left-6 w-[45px] sm:w-[55px] lg:w-[75px] h-[75px] sm:h-[90px] lg:h-[120px] bg-[#243384] flex justify-center pt-3 sm:pt-4 lg:pt-6"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}
                >
                  <Puzzle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white transform -rotate-12" strokeWidth={2.5} />
                </div>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-4 sm:mb-5">PROBLEM</h3>
                
                <div className="flex flex-col gap-2 sm:gap-3">
                  {challenges.map((challenge, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 shrink-0" />
                      <span className="font-medium text-[13px] sm:text-[15px] lg:text-base leading-tight">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: SOLUTION */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeRight}
            className="relative z-10 w-[92%] sm:w-fit sm:min-w-[400px] lg:max-w-[60%] mx-auto lg:mx-0 lg:ml-auto mt-8 lg:mt-[56px]"
          >
            <div className="relative w-full mt-4 md:mt-8">
              {/* Tilted Blue Layer (23 deg left) */}
              <div 
                className="absolute bg-[#243384] z-0 shadow-[0_15px_40px_rgba(36,51,132,0.2)] rounded-3xl lg:rounded-[2.5rem]
                           -top-2 -bottom-2 -left-4 -right-4 
                           sm:-top-3 sm:-bottom-3 sm:-left-6 sm:-right-6 
                           lg:-top-[15px] lg:-bottom-[15px] lg:-left-[35px] lg:-right-[35px]
                           skew-x-6 rotate-3 sm:skew-x-[10deg] sm:rotate-[4deg] lg:skew-x-[15deg] lg:rotate-[6deg] transition-transform duration-300"
              ></div>
              
              {/* Main White Card */}
              <div className="relative bg-white dark:bg-gray-900 rounded-2xl lg:rounded-[1.25rem] py-5 pr-6 sm:py-6 sm:pr-8 lg:py-7 lg:pr-10 pl-[70px] sm:pl-[90px] lg:pl-[120px] z-10 dark:border dark:border-gray-800">
                {/* Dynamic Dotted Swoosh Line */}
                <div 
                  className="absolute bottom-1/2 right-full w-[80px] lg:w-[150px] xl:w-[250px] h-[150px] border-b-[2px] border-l-[2px] border-dashed border-gray-400 dark:border-gray-600 rounded-bl-[50px] -z-10 hidden lg:block pointer-events-none"
                  style={{ maskImage: "linear-gradient(to top, black 10%, transparent 90%)", WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)" }}
                ></div>
                {/* Left Edge Connection Dot */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-[7px] w-[14px] h-[14px] rounded-full bg-white dark:bg-gray-900 border-[3px] border-[#243384] dark:border-[#5c7ae0] hidden lg:block shadow-sm z-20"></div>

                {/* Ribbon */}
                <div 
                  className="absolute top-0 left-4 sm:left-6 w-[45px] sm:w-[55px] lg:w-[75px] h-[75px] sm:h-[90px] lg:h-[120px] bg-[#243384] flex justify-center pt-3 sm:pt-4 lg:pt-6"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}
                >
                  <Network className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
                </div>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-4 sm:mb-5">SOLUTION</h3>
                
                <div className="flex flex-col gap-2 sm:gap-3">
                  {solutions.map((solution, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 shrink-0" />
                      <span className="font-medium text-[13px] sm:text-[15px] lg:text-base leading-tight">{solution}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
