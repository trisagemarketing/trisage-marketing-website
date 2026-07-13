"use client";

import { useEffect, useState } from "react";
import { DESTINATIONS, DestinationStory } from "../data/destinations";
// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Autoplay, Mousewheel } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

export default function GlobalPresence() {
  const [destinations, setDestinations] = useState<DestinationStory[]>([]);
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedProps, setExpandedProps] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedProps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    setMounted(true);
    // Murphy's Law: Never trust external/static data blindly.
    try {
      if (!DESTINATIONS || typeof DESTINATIONS !== 'object') {
        throw new Error("DESTINATIONS data is invalid or missing.");
      }
      const dataArray = Object.values(DESTINATIONS).filter(
        dest => dest && dest.id && dest.title // Ensure critical fields exist
      );
      setDestinations(dataArray);
    } catch (err) {
      console.error("[GlobalPresence] Failed to parse destinations:", err);
      setHasError(true);
    }
  }, []);

  // Handle fatal errors gracefully
  if (hasError || destinations.length === 0) {
    // Graceful degradation: If data fails, don't crash the whole homepage.
    return (
      <section className="relative w-full py-24 bg-transparent flex items-center justify-center">
        <p className="text-primary-900/50 dark:text-white/50 font-mono tracking-widest uppercase">Global Network Loading...</p>
      </section>
    );
  }

  return (
    <section className="relative w-full pt-24 pb-0 bg-transparent overflow-hidden">
      {/* Background Ambience (Adaptive) - Positioned behind the Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] pointer-events-none -z-10 opacity-40 dark:opacity-20 blur-[80px] flex items-center justify-between px-10">
        <div className="w-75 h-75 bg-secondary-300/60 dark:bg-secondary-500/40 rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="w-[400px] h-[400px] bg-primary-200/60 dark:bg-primary-600/30 rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-20 text-center md:text-left">
        <h4 className="flex items-center justify-center md:justify-start gap-4 text-secondary-600 dark:text-secondary-400 font-mono tracking-[0.2em] text-sm uppercase mb-6" aria-label="Section Title">
          <span className="w-8 h-px bg-secondary-600/50 dark:bg-secondary-400/50"></span>
          India Presence
        </h4>
        
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-phudu font-bold text-primary-950 dark:text-white leading-[1.1] tracking-tight mb-8">
          Premium Destinations. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary-600 to-primary-600 dark:from-secondary-300 dark:to-primary-300">
            Unparalleled Experiences.
          </span>
        </h2>
        
        <p className="max-w-2xl mx-auto md:mx-0 text-primary-800/80 dark:text-gray-300 font-rubik text-lg md:text-xl font-light leading-relaxed">
          Empowering luxury hospitality across the subcontinent. From the spiritual sanctuaries of Haridwar to the serene valleys of Dehradun, explore our exclusive Indian portfolio of premium resorts and elite hotels.
        </p>
      </div>

      {/* CSS Marquee Implementation matching Business Partner Logic */}
      <style>
        {`
          @keyframes card-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-card-marquee {
            animation: card-marquee 35s linear infinite;
          }
          .animate-card-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="relative z-10 w-full pb-16 overflow-hidden">
        {/* We quadruple the array to ensure the scroll is perfectly seamless and covers the entire 50% translation width smoothly */}
        <div className="animate-card-marquee flex w-max">
          {[...destinations, ...destinations, ...destinations, ...destinations].map((dest, i) => (
            <div key={`${dest.id}-${i}`} className="shrink-0 w-[85vw] md:w-[420px] pr-8">
              <div className="group relative w-full h-[580px] rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-700 hover:shadow-[0_12px_48px_0_rgba(31,38,135,0.15)] dark:hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.5)]">
                
                {/* Image Container with Parallax effect */}
                <div className="absolute inset-0 m-3 rounded-[1.5rem] overflow-hidden bg-primary-100 dark:bg-[#0c162d]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform scale-[1.03] group-hover:scale-110 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ backgroundImage: `url(${dest.heroImage || '/assets/placeholder-dest.jpg'})` }}
                  />
                  {/* Adaptive Overlays for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/40 to-transparent dark:from-black/95 dark:via-black/50 dark:to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content Container */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end z-10 pointer-events-none">
                  
                  {/* Header: Visible by default */}
                  <div className="transform translate-y-6 group-hover:-translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto">
                    <h4 className="text-secondary-300 dark:text-secondary-400 font-mono tracking-widest text-[10px] uppercase mb-3 flex items-center gap-2 drop-shadow-md">
                      <span className="w-4 h-[1px] bg-secondary-300 dark:bg-secondary-400"></span>
                      {dest.subtitle || 'Premium Hub'}
                    </h4>
                    <h3 className="text-4xl font-phudu font-bold text-white drop-shadow-lg tracking-wide">
                      {dest.title}
                    </h3>
                  </div>

                  {/* Expanding Details: Reveals gracefully on hover */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 group-hover:opacity-100 mt-4 pointer-events-auto">
                    <div className="overflow-hidden">
                      
                      {/* Properties List */}
                      {dest.hospitalityHighlights && dest.hospitalityHighlights.length > 0 && (
                        <div className="pt-2 pb-4">
                          <p className="text-[10px] text-gray-300 uppercase font-mono tracking-widest mb-3">Key Properties</p>
                          <ul className="space-y-1.5 transition-all duration-300">
                            {dest.hospitalityHighlights
                              .slice(0, expandedProps[`${dest.id}-${i}`] ? dest.hospitalityHighlights.length : 4)
                              .map((highlight, idx) => (
                              <li key={idx} className="text-[13px] text-white/95 font-rubik font-light flex items-start gap-2">
                                <span className="text-secondary-400 mt-[4px] text-[10px]">♦</span>
                                <span className={expandedProps[`${dest.id}-${i}`] ? "break-words" : "line-clamp-1"}>{highlight}</span>
                              </li>
                            ))}
                            {dest.hospitalityHighlights.length > 4 && (
                              <li>
                                <button 
                                  onClick={(e) => toggleExpand(`${dest.id}-${i}`, e)}
                                  className="text-[11px] text-secondary-400 hover:text-secondary-300 font-rubik italic mt-1 bg-transparent border-none cursor-pointer focus:outline-none transition-colors"
                                >
                                  {expandedProps[`${dest.id}-${i}`] ? '- Show less' : `+ ${dest.hospitalityHighlights.length - 4} more properties`}
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/20 dark:border-white/10 mt-2">
                        {(dest.statistics || []).slice(0, 2).map((stat, idx) => (
                          <div key={`stat-${idx}`} className="flex flex-col">
                            <span className="text-xl text-white font-phudu font-light mb-1">{stat.value || '-'}</span>
                            <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-gray-300 dark:text-gray-400">{stat.label || 'Metric'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
