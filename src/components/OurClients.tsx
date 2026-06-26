/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp } from "@/lib/animations";

export default function OurClients() {
  return (
    <section className="relative py-[4px] md:py-[4px] bg-transparent overflow-hidden" id="our-clients">
      


      {/* Skyblue Cosmic Beams */}
      <div className="absolute hidden dark:block left-[-20%] top-[40%] w-[150%] h-[150px] pointer-events-none z-0 rotate-[-10deg]">
         {/* Main diffuse beam */}
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent animate-[pulse_8s_infinite]" />
         {/* Intense core beam */}
         <div className="absolute inset-y-1/3 inset-x-0 bg-gradient-to-r from-transparent via-sky-300/20 to-transparent animate-[pulse_5s_infinite_reverse]" />
         {/* Laser thin beam */}
         <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-200/40 to-transparent" />
      </div>

      {/* Cosmic Creative Stuff: Floating Skyblue Orbs & Twinkling Stars */}
      <div className="absolute hidden dark:block inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Skyblue Glowing Orb 1 */}
        <div className="absolute left-[8%] top-[20%] w-[100px] h-[100px] bg-sky-500/10 rounded-full animate-[planetBounce_12s_infinite]" />
        {/* Skyblue Glowing Orb 2 */}
        <div className="absolute right-[15%] bottom-[10%] w-[150px] h-[150px] bg-cyan-400/5 rounded-full animate-[planetBounce_15s_infinite_reverse]" />
        
        {/* Twinkling Stars */}
        <div className="absolute left-[20%] top-[30%] w-1 h-1 bg-sky-100 rounded-full animate-[pulse_3s_infinite]" />
        <div className="absolute right-[30%] top-[50%] w-1.5 h-1.5 bg-white rounded-full animate-[pulse_4s_infinite]" />
        <div className="absolute left-[40%] bottom-[20%] w-1 h-1 bg-cyan-100 rounded-full animate-[pulse_5s_infinite]" />
        <div className="absolute right-[10%] top-[15%] w-2 h-2 bg-sky-200 rounded-full animate-[pulse_6s_infinite_reverse]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-6 md:mb-8">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp}
            className="text-3xl md:text-5xl font-bold text-[#2A3F64] dark:text-white"
          >
            Our Valued Clients
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="w-full bg-transparent md:my-4 rounded-4xl md:rounded-[3rem] py-4 md:py-6 flex items-center relative overflow-hidden"
        >
          {/* Infinite Marquee Wrapper */}
          <motion.div
            animate={{ x: [0, "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30, // 30 seconds for a smooth, readable scroll
            }}
            className="flex w-max items-center"
          >
            {/* First Set of Logos */}
            <div className="flex items-center justify-center pr-4 sm:pr-8 md:pr-12">
              <img
                src="/Frame 31.svg"
                alt="Our Clients"
                loading="lazy"
                decoding="async"
                className="h-[60px] sm:h-[80px] md:h-[120px] lg:h-[161px] w-auto max-w-none dark:drop-shadow-none md:dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              />
            </div>
            
            {/* Duplicate Set of Logos for Seamless Looping */}
            <div className="flex items-center justify-center pr-4 sm:pr-8 md:pr-12">
              <img
                src="/Frame 31.svg"
                alt="Our Clients Duplicate"
                loading="lazy"
                decoding="async"
                className="h-[60px] sm:h-[80px] md:h-[120px] lg:h-[161px] w-auto max-w-none dark:drop-shadow-none md:dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              />
            </div>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
