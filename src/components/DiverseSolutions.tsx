"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

const solutions = [
  {
    title: "Home Stay Marketing",
    description: "Rank locally on Google & drive direct bookings",
    // Cozy homestay bedroom image
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942566/Home_stay_svbqch.png",
  },
  {
    title: "Airbnb Marketing",
    description: "Attract more guests & reduce commission costs",
    // Unique Airbnb style A-frame cabin
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942095/AirBnb_v049qo.png",
  },
  {
    title: "Villas Marketing",
    description: "Promote luxury stays & attract high-value travelers",
    // Luxury modern villa with pool
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942133/Villa_k9r6xf.png",
  },
  {
    title: "Glamping Marketing",
    description: "Elevate your outdoor luxury experience & capture unique stays",
    // Glamping tent
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942096/Glamping_ytuzqc.png",
  },
  {
    title: "Cafe Marketing",
    description: "Drive foot traffic and build local community engagement",
    // Cozy aesthetic cafe
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942105/Cafe_zauqxf.png",
  },
  {
    title: "Restaurant Marketing",
    description: "Fill tables consistently and enhance your dining brand",
    // Premium restaurant interior
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942124/Restaurant_olk1we.png",
  },
  {
    title: "Hotel Marketing",
    description: "Maximize occupancy rates across all seasons",
    // Premium hotel facade / lobby
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942105/Hotel_v34crc.png",
  },
  {
    title: "Resort Marketing",
    description: "Increase occupancy & build premium brand value",
    // Premium resort view
    image: "https://res.cloudinary.com/dgoclgj0u/image/upload/v1783942106/Resort_efcohk.png",
  }
];

export default function DiverseSolutions() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrev = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  const handleNext = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  if (!mounted) return null; // Prevent SSR hydration mismatch with Swiper

  return (
    <section className="relative w-full pt-16 pb-8 md:pt-24 md:pb-12 bg-white dark:bg-[#050b14] overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 dark:text-white leading-[1.2] tracking-tight">
              Marketing Solutions for Every Type of <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-300">Hospitality Business</span>
            </h2>
          </motion.div>
        </div>

        {/* CSS Marquee Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative w-full pb-8 overflow-hidden"
        >
          <style>
            {`
              @keyframes marketing-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marketing-marquee {
                animation: marketing-marquee 40s linear infinite;
              }
              .animate-marketing-marquee:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className="animate-marketing-marquee flex w-max">
            {/* Double the array for seamless scrolling of the 50% width */}
            {[...solutions, ...solutions].map((solution, index) => (
              <div key={index} className="shrink-0 w-[85vw] sm:w-[340px] md:w-[400px] lg:w-[420px] pr-6 h-auto">
                {/* Perfect Rectangle Aspect Ratio (4:5) */}
                <div className="group relative w-full aspect-[4/5] rounded-[24px] overflow-hidden flex flex-col justify-between transform-gpu will-change-transform bg-gray-900 shadow-sm hover:shadow-xl transition-shadow duration-300">
                  
                  {/* Background Image with Parallax & Hover Scaling */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transform-gpu transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                      quality={90}
                    />
                  </div>

                  {/* Gradient Overlay for Top & Bottom Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-black/80 z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Glassmorphism Inner Glow */}
                  <div className="absolute inset-0 border border-white/10 rounded-[24px] z-20 pointer-events-none" />

                  {/* Content Container */}
                  <div className="relative z-30 p-6 md:p-8 flex flex-col h-full justify-between pointer-events-none">
                    
                    {/* Top Content: Title */}
                    <div className="pointer-events-auto transform translate-y-0">
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight drop-shadow-lg leading-[1.3]">
                        <span className="text-secondary-400">{solution.title.split(' ')[0]}</span>{' '}
                        <span className="text-white">{solution.title.split(' ').slice(1).join(' ')}</span>
                      </h3>
                    </div>

                    {/* Bottom Content: Description */}
                    <div className="pointer-events-auto translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <p className="text-sm md:text-[15px] font-medium leading-relaxed drop-shadow-md opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="text-secondary-400">{solution.description.split(' ')[0]}</span>{' '}
                        <span className="text-white">{solution.description.split(' ').slice(1).join(' ')}</span>
                      </p>
                    </div>
                    
                  </div>

                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
