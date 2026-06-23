"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Track precise mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth trailing coordinates for the outer ring
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20, mass: 0.5 });

  useEffect(() => {
    // Robust detection: show cursor on mouse move, hide on touch start.
    // This perfectly handles DevTools mobile toggling and hybrid touchscreen laptops.
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleTouchStart = () => {
      setIsVisible(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* The precise inner dot */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-2 h-2 bg-primary-600 dark:bg-primary-500 rounded-full pointer-events-none z-[99999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* The trailing outer circle */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 w-8 h-8 border-[1.5px] border-primary-600/50 dark:border-primary-500/50 rounded-full pointer-events-none z-[99998]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
