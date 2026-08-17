"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function IndianFlagPlanes() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Background Color Splash Dispersion */}
      <motion.div 
        animate={{ 
          opacity: [0.15, 0.45, 0.15],
          scale: [0.98, 1.02, 0.98]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-[50vh] bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none blur-3xl"
      />
      
      {/* Top Jet - Saffron (Orange) */}
      <FighterJet 
        color="#FF9933" 
        glowColor="rgba(255, 153, 51, 0.6)"
        top="8%" 
        scale={0.85}
        duration={14} 
        delay={0}
      />
      
      {/* Middle Jet - White / Silver */}
      <FighterJet 
        color="#FFFFFF" 
        glowColor="rgba(255, 255, 255, 0.7)"
        top="18%" 
        scale={1.1}
        duration={13}
        delay={0.3}
      />
      
      {/* Bottom Jet - Green */}
      <FighterJet 
        color="#138808" 
        glowColor="rgba(19, 136, 8, 0.6)"
        top="28%" 
        scale={0.85}
        duration={15}
        delay={0.6}
      />
    </div>
  );
}

function FighterJet({ 
  color, 
  glowColor, 
  top, 
  scale, 
  duration, 
  delay 
}: { 
  color: string; 
  glowColor: string; 
  top: string; 
  scale: number; 
  duration: number; 
  delay: number; 
}) {
  return (
    <motion.div
      animate={{ 
        x: ["-130vw", "130vw", "130vw", "-130vw", "-130vw"],
        scaleX: [1, 1, -1, -1, 1], // Horizontally flip jet & smoke when flying left
      }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.46, 0.5, 0.96, 1]
      }}
      className="absolute flex items-center"
      style={{ top, scale }}
    >
      {/* Dynamic Color Splash & Smoke Burst Trail */}
      <div className="relative flex items-center transform -translate-y-1/2">
        {/* Core Dense Smoke Trail */}
        <motion.div 
          animate={{ 
            width: ["0vw", "95vw", "95vw", "95vw", "0vw"],
            opacity: [0, 0.9, 0, 0.9, 0]
          }}
          transition={{ 
            duration: duration, 
            delay: delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.46, 0.5, 0.96, 1]
          }}
          className="h-10 sm:h-16 rounded-full blur-[12px] sm:blur-[18px]"
          style={{ 
            background: `linear-gradient(to right, transparent 0%, ${color} 70%, ${color} 100%)`,
            marginRight: "-15px"
          }}
        />

        {/* Wide Dispersed Color Splash Cloud (Atmospheric Spray) */}
        <motion.div 
          animate={{ 
            width: ["0vw", "105vw", "105vw", "105vw", "0vw"],
            opacity: [0, 0.5, 0, 0.5, 0]
          }}
          transition={{ 
            duration: duration, 
            delay: delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.46, 0.5, 0.96, 1]
          }}
          className="absolute right-0 h-28 sm:h-44 rounded-full blur-[35px] sm:blur-[55px]"
          style={{ 
            background: `radial-gradient(ellipse at right, ${glowColor} 0%, transparent 80%)`,
          }}
        />

        {/* Smoke Burst Particles / Water Color Splash Embers */}
        <div className="absolute right-4 flex gap-6">
          <motion.div 
            animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full blur-[20px]"
            style={{ backgroundColor: color }}
          />
          <motion.div 
            animate={{ scale: [1.2, 0.6, 1.2], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full blur-[30px]"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>

      {/* Realistic Military Fighter Jet SVG (Nose pointing right when un-flipped) */}
      <div className="relative shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <svg 
          width="110" 
          height="110" 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "rotate(90deg)" }}
        >
          {/* Main Fuselage & Canopy */}
          <path d="M50 2 L54 28 L55 65 L45 65 L46 28 Z" fill="#1F2937" />
          <path d="M48.5 18 L51.5 18 L52.5 35 L47.5 35 Z" fill="#38BDF8" opacity="0.8" /> {/* Glass Cockpit */}
          
          {/* Main Delta Wings */}
          <path d="M45 38 L4 72 L12 76 L45 62 Z" fill="#111827" />
          <path d="M55 38 L96 72 L88 76 L55 62 Z" fill="#111827" />
          
          {/* Wing Panel Accents */}
          <path d="M45 42 L15 68 L22 71 L45 58 Z" fill="#374151" />
          <path d="M55 42 L85 68 L78 71 L55 58 Z" fill="#374151" />

          {/* Front Canard Wings */}
          <path d="M45 28 L24 38 L28 43 L45 36 Z" fill="#374151" />
          <path d="M55 28 L76 38 L72 43 L55 36 Z" fill="#374151" />

          {/* Twin Tail Fins */}
          <path d="M42 65 L32 88 L40 88 L44 72 Z" fill="#1F2937" />
          <path d="M58 65 L68 88 L60 88 L56 72 Z" fill="#1F2937" />

          {/* Afterburner Thruster Engines with Glowing Fire */}
          <circle cx="44" cy="89" r="4.5" fill="#EF4444" />
          <circle cx="44" cy="89" r="2.5" fill="#F59E0B" />
          <circle cx="44" cy="89" r="1" fill="#FFFFFF" />

          <circle cx="56" cy="89" r="4.5" fill="#EF4444" />
          <circle cx="56" cy="89" r="2.5" fill="#F59E0B" />
          <circle cx="56" cy="89" r="1" fill="#FFFFFF" />
        </svg>

        {/* Thruster Afterburner Heat Plume */}
        <motion.div 
          animate={{ scaleY: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-3 bg-gradient-to-l from-orange-500 via-yellow-300 to-transparent rounded-full blur-[2px]"
        />
      </div>
    </motion.div>
  );
}
