"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useTransform, useSpring, useReducedMotion, useMotionTemplate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { teamMembers } from "@/data/teamMembers";
import { fadeUp } from "@/lib/animations";

const Card = ({ member, index, total, globalRotation }: { member: any, index: number, total: number, globalRotation: any }) => {
  const prefersReducedMotion = useReducedMotion();

  // The angle increment perfectly divides 360 degrees by the number of cards
  // to create a fully closed, physical 3D ring!
  const angleIncrement = 360 / total;
  
  // Calculate this card's fixed position on the cylinder.
  // Center card (e.g. index 7 in a 14-item array) gets 0deg. 
  const centerIndex = Math.floor(total / 2);
  const cardAngle = (index - centerIndex) * angleIncrement;

  // The card's true physical angle is its fixed position PLUS the global manual rotation.
  const rotateYRaw = useTransform(globalRotation, (y: number) => y + cardAngle);
  
  // Spring physics for buttery smooth easing of the physical rotation
  const rotateY = useSpring(rotateYRaw, { stiffness: 400, damping: 50 });

  // CRITICAL FIX: The infinite loop causes rotateYRaw to grow infinitely (e.g. -360, -720).
  // We must normalize it to [-180, 180] before calculating opacity and brightness!
  const normalizedAngle = useTransform(rotateYRaw, (y: number) => {
    let normalized = y % 360;
    if (normalized > 180) normalized -= 360;
    if (normalized < -180) normalized += 360;
    return normalized;
  });

  // Dynamic Lighting: Images stay bright and clear! The center pops slightly.
  const brightnessRaw = useTransform(normalizedAngle, [-60, 0, 60], [0.9, 1.1, 0.9]);
  const brightness = useSpring(brightnessRaw, { stiffness: 400, damping: 50 });
  
  // Opacity Fading: Gracefully hide cards that rotate too far past the edges so they don't clip behind the camera.
  const opacityRaw = useTransform(normalizedAngle, [-90, -70, 0, 70, 90], [0, 1, 1, 1, 0]);
  const opacity = useSpring(opacityRaw, { stiffness: 400, damping: 50 });

  // Create a dynamic CSS filter string using Framer Motion's template literal
  const filter = useMotionTemplate`brightness(${brightness})`;

  return (
    <motion.div
      style={{
        rotateY,
        opacity,
        filter,
        // SENIOR FIX: Restoring the intended "concave bowl" design!
        // To prevent the side cards from overlapping and suffocating the center card's text,
        // we must mathematically ensure the cylinder radius is large enough.
        // For 21 cards, Radius > CardWidth / sin(17.14deg). Minimum safe radius is 700px!
        // Max radius is clamped to 1250px so desktop cards have a tight 20px gap instead of a massive void!
        transformOrigin: "center center clamp(700px, 150vw, 1250px)",
        transformStyle: "preserve-3d"
      }}
      className="group absolute inset-0 w-full h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] will-change-transform [mask-image:-webkit-radial-gradient(white,black)] [-webkit-mask-image:-webkit-radial-gradient(white,black)]"
    >
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 320px, 350px"
        className="object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110"
        priority={Math.abs(index - Math.floor(total / 2)) <= 2}
        loading={Math.abs(index - Math.floor(total / 2)) > 2 ? "lazy" : undefined}
      />
      
      {/* Ultra-soft Micro Gradient (Bottom 30% only for text readability) */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none opacity-100 rounded-b-2xl md:rounded-b-3xl" />
      
      {/* Name and Designation Content with Text Shadows */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 text-left pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white text-lg md:text-2xl font-bold tracking-tight mb-1 drop-shadow-md leading-tight">{member.name}</h3>
        <p className="text-gray-200 text-xs md:text-sm font-medium uppercase tracking-wider drop-shadow-md">{member.role}</p>
      </div>
    </motion.div>
  );
};

export default function TeamShowcase() {
  // We need exactly 21 items (3 copies of 7) to tighten the gap between cards.
  // This physically squeezes them closer together, perfectly showing 3+ images on screen!
  const loopedMembers = [...teamMembers, ...teamMembers, ...teamMembers];
  
  const angleIncrement = 360 / loopedMembers.length;

  // Standalone physics spring for manual control (starts at 0)
  const globalRotation = useSpring(0, { stiffness: 300, damping: 30 });

  // Native DOM Reference for non-passive event listeners
  const trackpadRef = useRef<HTMLDivElement>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  // CRITICAL BUG FIX: We must use a native DOM listener instead of React's onWheel.
  // React's onWheel is 'passive' by default, meaning it cannot block the browser's
  // default back/forward history swipe gesture on Mac trackpads!
  useEffect(() => {
    const element = trackpadRef.current;
    if (!element) return;

    const handleNativeWheel = (e: WheelEvent) => {
      // Only hijack horizontal two-finger swipes
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // THIS physically blocks the browser's back/forward swipe navigation!
        e.preventDefault(); 
        
        // Rotate the bowl continuously based on the trackpad swipe speed
        globalRotation.set(globalRotation.get() - e.deltaX * 0.15);

        // Detect when the user STOPS swiping
        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
        
        wheelTimeout.current = setTimeout(() => {
          // Snap perfectly to the nearest photo when they finish swiping!
          const current = globalRotation.get();
          const nearestAngle = Math.round(current / angleIncrement) * angleIncrement;
          globalRotation.set(nearestAngle);
        }, 150);
      }
    };

    // { passive: false } is mandatory to allow e.preventDefault()
    element.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleNativeWheel);
  }, [globalRotation, angleIncrement]);

  const handleNext = () => {
    // Subtract angleIncrement to rotate the bowl left infinitely
    globalRotation.set(globalRotation.get() - angleIncrement);
  };

  const handlePrev = () => {
    // Add angleIncrement to rotate the bowl right infinitely
    globalRotation.set(globalRotation.get() + angleIncrement);
  };

  return (
    <section className="relative min-h-[90vh] py-12 md:py-16 bg-white dark:bg-gray-950 transition-colors duration-300 flex flex-col justify-center items-center overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-80 dark:opacity-40 pointer-events-none" />

      {/* Section Header */}
      <div className="container mx-auto px-4 md:px-8 text-center relative z-20 mb-10 md:mb-20 mt-6 md:mt-1">
        <motion.span 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-primary-600 dark:text-primary-400 font-semibold tracking-wider uppercase text-sm"
        >
          Leadership Team
        </motion.span>
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-4 md:mb-6 leading-tight"
        >
          Team Work Makes the Dream Work
        </motion.h2>
        <motion.p 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-gray-600 dark:text-gray-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          Meet the brilliant minds behind our award-winning campaigns. We combine data-driven precision with world-class creativity to scale your brand.
        </motion.p>
      </div>

      {/* 3D Cylinder Wrapper - Pure Gallery */}
      <div 
        className="w-full relative flex flex-col items-center justify-center z-10"
        style={{ perspective: "1500px" }}
      >
        {/* This is the physical "Center Stage". All cards are absolutely positioned inside it. */}
        <motion.div 
          ref={trackpadRef}
          className="relative w-[65vw] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[4/5] sm:aspect-[3/4] mb-8 md:mb-12 cursor-grab active:cursor-grabbing"
          style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }} // Don't let the container itself move
          dragElastic={0} 
          onDrag={(e, info) => {
            // Real-time 3D spinning as you drag!
            globalRotation.set(globalRotation.get() + info.delta.x * 0.15);
          }}
          onDragEnd={(e, info) => {
            // Add throw momentum
            const momentum = info.velocity.x * 0.05;
            const target = globalRotation.get() + momentum;
            
            // Snap perfectly to the nearest photo!
            const nearestAngle = Math.round(target / angleIncrement) * angleIncrement;
            globalRotation.set(nearestAngle);
          }}
        >
          {loopedMembers.map((member, i) => (
            <Card 
              key={`${member.id}-${i}`} 
              member={member} 
              index={i} 
              total={loopedMembers.length} 
              globalRotation={globalRotation} 
            />
          ))}
        </motion.div>

        {/* Manual Apple-Style Glass Controls - Infinite Loop (Hidden on Mobile due to Swipe) */}
        <div className="hidden md:flex items-center gap-6 mt-4 relative z-50">
          <button 
            onClick={handlePrev} 
            className="w-14 h-14 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-sm hover:scale-105 active:scale-95"
            aria-label="Previous team member"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-all shadow-sm hover:scale-105 active:scale-95"
            aria-label="Next team member"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </section>
  );
}
