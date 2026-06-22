"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function MissionVision() {
  const [missionExpanded, setMissionExpanded] = useState(false);
  const [visionExpanded, setVisionExpanded] = useState(false);

  return (
    <section className="pt-12 pb-8 md:pt-16 md:pb-12 bg-white dark:bg-[#050b14] overflow-hidden transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Block 1: Our Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24 md:mb-32">
          
          {/* Text Content (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Our Mission
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 w-full">
              <p>
                Our mission is to empower hospitality brands with innovative marketing, branding, and revenue-focused solutions that help them achieve sustainable growth, stronger customer relationships, and improved market positioning
                {!missionExpanded && (
                  <>
                    <span className="text-gray-400">...</span>{" "}
                    <button 
                      onClick={() => setMissionExpanded(true)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold focus:outline-none transition-colors inline"
                    >
                      See more
                    </button>
                  </>
                )}
                {missionExpanded && "."}
              </p>
              
              <AnimatePresence>
                {missionExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <p>
                      We aim to provide hospitality businesses with strategies that are creative, practical, performance-driven, and tailored according to their unique business goals.{" "}
                      <button 
                        onClick={() => setMissionExpanded(false)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold focus:outline-none transition-colors inline"
                      >
                        See less
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Image Content (Right) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full max-w-md lg:max-w-lg mx-auto aspect-[16/9] lg:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
              alt="Our Mission"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Block 2: Our Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Collage Content (Left on Desktop, Bottom on Mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1 relative h-[350px] md:h-[400px] lg:h-[450px] w-full max-w-md lg:max-w-lg mx-auto"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-6 h-full w-full">
              {/* Tall Left Image */}
              <div className="relative h-full w-full rounded-tl-[2rem] rounded-bl-[2rem] md:rounded-tl-[3rem] md:rounded-bl-[3rem] overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop"
                  alt="Vision Strategy"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Stacked Right Images */}
              <div className="grid grid-rows-2 gap-4 md:gap-6 h-full w-full">
                <div className="relative w-full h-full rounded-tr-[2rem] md:rounded-tr-[3rem] overflow-hidden shadow-xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop"
                    alt="Vision Data"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative w-full h-full rounded-br-[2rem] md:rounded-br-[3rem] overflow-hidden shadow-xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                    alt="Vision Teamwork"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content (Right on Desktop, Top on Mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 flex flex-col items-start"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Our Vision
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 w-full">
              <p>
                To become one of the most trusted hospitality marketing and revenue management partners by delivering impactful digital experiences, stronger hotel branding, and long-term business growth solutions
                {!visionExpanded && (
                  <>
                    <span className="text-gray-400">...</span>{" "}
                    <button 
                      onClick={() => setVisionExpanded(true)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold focus:outline-none transition-colors inline"
                    >
                      See more
                    </button>
                  </>
                )}
                {visionExpanded && "."}
              </p>
              
              <AnimatePresence>
                {visionExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <p>
                      We envision helping hospitality brands transform their digital presence into powerful business opportunities through creativity, innovation, and strategic execution.{" "}
                      <button 
                        onClick={() => setVisionExpanded(false)}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold focus:outline-none transition-colors inline"
                      >
                        See less
                      </button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
