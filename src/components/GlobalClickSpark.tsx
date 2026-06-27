"use client";

import { useEffect, useRef } from "react";
import { Hotel, MapPin, Wine, Plane, Palmtree, UtensilsCrossed } from "lucide-react";

/**
 * GLOBAL CLICK SPARK EFFECT
 * 
 * Architecture:
 * ─ Listens globally for pointerdown on the window object (capturing phase).
 * ─ Uses pure Vanilla JS DOM manipulation inside a React container to bypass 
 *   React's rendering cycle entirely (Zero-Lag).
 * ─ Animates using the Web Animations API (runs entirely on the GPU compositor thread).
 * ─ Clones pre-rendered SVG hospitality icons instead of re-rendering them.
 */

export default function GlobalClickSpark() {
  const containerRef = useRef<HTMLDivElement>(null);
  const templatesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const templates = templatesRef.current;
    if (!container || !templates) return;

    const onClick = (e: PointerEvent) => {
      // Ignore right clicks
      if (e.button !== 0) return;

      const x = e.clientX;
      const y = e.clientY;

      const burst = document.createElement("div");
      burst.className = "fixed pointer-events-none z-[999999]";
      burst.style.left = `${x}px`;
      burst.style.top = `${y}px`;

      const isMobile = window.innerWidth < 768;
      
      // 1. CHINGARI (Cutter Sparks)
      // Spawn fewer particles on mobile for ultra-performance
      const numSparks = isMobile 
        ? 4 + Math.floor(Math.random() * 3)  // 4-6 on mobile
        : 8 + Math.floor(Math.random() * 6); // 8-13 on desktop

      for (let i = 0; i < numSparks; i++) {
        const spark = document.createElement("div");
        // Distribute sparks evenly in a circle, plus some random jitter
        const angle = (Math.PI * 2 * i) / numSparks + (Math.random() * 0.5);
        const velocity = 50 + Math.random() * 100; // How far they shoot
        const length = 10 + Math.random() * 25;    // How long the spark lines are
        
        spark.className = "absolute origin-left rounded-full";
        spark.style.width = `${length}px`;
        spark.style.height = `2px`;
        
        // Hot "cutter" spark colors
        const colors = ["#FFD700", "#FF4500", "#FFA500", "#FFFFFF"];
        spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Mobile optimization: Remove expensive box-shadow on low-end devices
        if (!isMobile) {
          spark.style.boxShadow = `0 0 8px ${spark.style.backgroundColor}, 0 0 12px #FFFFFF`;
        }
        
        const angleDeg = angle * (180 / Math.PI);

        // Web Animations API: shoots out, scales down, and fades simultaneously
        spark.animate([
          { transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateX(0px) scaleX(0.2)`, opacity: 1 },
          { transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateX(${velocity * 0.5}px) scaleX(1)`, opacity: 1, offset: 0.3 },
          { transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateX(${velocity}px) scaleX(0)`, opacity: 0 }
        ], {
          duration: isMobile 
            ? 800 + Math.random() * 400  // Much slower mobile (800ms - 1200ms)
            : 5000 + Math.random() * 500, // Epic 5-second desktop float (5000ms - 5500ms)
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          fill: 'forwards'
        });

        burst.appendChild(spark);
      }

      // 2. HOSPITALITY ICONS POP-OUT
      const icons = Array.from(templates.children);
      if (icons.length > 0) {
        // Less icons on mobile to prevent DOM thrashing
        const numIcons = isMobile 
          ? 1 + Math.floor(Math.random() * 2) // 1-2 on mobile
          : 2 + Math.floor(Math.random() * 3); // 2-4 on desktop
        
        for (let i = 0; i < numIcons; i++) {
          const randomIcon = icons[Math.floor(Math.random() * icons.length)].cloneNode(true) as SVGElement;
          
          randomIcon.style.position = "absolute";
          
          // Theme-matching vibrant colors (Teal & Amber palettes)
          const colors = ["#14B8A6", "#FBBF24", "#0D9488", "#F59E0B"];
          randomIcon.style.color = colors[Math.floor(Math.random() * colors.length)];
          randomIcon.style.opacity = "0.9";
          randomIcon.style.filter = `drop-shadow(0 0 6px ${randomIcon.style.color})`;
          
          const angle = (Math.PI * 2 * i) / numIcons + Math.random();
          const velocity = 30 + Math.random() * 60;
          const tx = Math.cos(angle) * velocity;
          const ty = Math.sin(angle) * velocity;
          
          // Randomize rotation so they tumble out
          const rotStart = Math.random() * 90;
          const rotEnd = rotStart + (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 90);

          // Gravity effect: translateY increases at the end
          randomIcon.animate([
            { transform: `translate(-50%, -50%) scale(0) rotate(${rotStart}deg)`, opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty - 15}px)) scale(1.1) rotate(${(rotStart+rotEnd)/2}deg)`, opacity: 1, offset: 0.5 },
            { transform: `translate(calc(-50% + ${tx * 1.5}px), calc(-50% + ${ty + 35}px)) scale(0) rotate(${rotEnd}deg)`, opacity: 0 }
          ], {
            duration: isMobile
              ? 1200 + Math.random() * 600  // Much slower mobile (1200ms - 1800ms)
              : 5000 + Math.random() * 500, // Epic 5-second desktop float (5000ms - 5500ms)
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            fill: 'forwards'
          });

          burst.appendChild(randomIcon);
        }
      }

      container.appendChild(burst);

      // Instant garbage collection so DOM doesn't get flooded
      setTimeout(() => {
        burst.remove();
      }, isMobile ? 2500 : 6000);
    };

    // Use capture phase so it registers the click even if a child component calls stopPropagation
    window.addEventListener("pointerdown", onClick, { passive: true, capture: true });
    return () => window.removeEventListener("pointerdown", onClick, { capture: true });
  }, []);

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[999999]" />
      
      {/* Hidden templates to clone nodes from (much faster than React.createElement on click) */}
      <div ref={templatesRef} style={{ display: 'none' }}>
        <Hotel width={18} height={18} strokeWidth={1.5} />
        <MapPin width={18} height={18} strokeWidth={1.5} />
        <Wine width={18} height={18} strokeWidth={1.5} />
        <Plane width={18} height={18} strokeWidth={1.5} />
        <Palmtree width={18} height={18} strokeWidth={1.5} />
        <UtensilsCrossed width={18} height={18} strokeWidth={1.5} />
      </div>
    </>
  );
}
