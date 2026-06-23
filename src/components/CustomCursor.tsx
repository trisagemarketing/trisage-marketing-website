"use client";

import { useEffect, useRef, useState } from "react";

/**
 * NORTHERN LIGHTS CUSTOM CURSOR (IMAGE SPRITE)
 *
 * Architecture:
 * ─ Uses the EXACT cursor pack image requested by the user from:
 *   https://cdn.custom-cursor.com/packs/7182/starter-northern-lights-pack.png
 * ─ Implements CSS Sprite technique: seamlessly swaps between the Arrow and the Hand 
 *   pointer without requiring two separate image downloads.
 * ─ Maintains Zero-Lag Architecture: Direct DOM manipulation in a requestAnimationFrame loop.
 *   No React re-renders on mousemove or hover.
 * ─ Hotspots precisely calibrated down to the pixel based on a 1/8th scale of the original 800x400 image.
 */

export default function CustomCursor() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);
  const pos       = useRef({ x: -400, y: -400 });
  const rafId     = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    let isPointerDevice = false;
    try { isPointerDevice = window.matchMedia("(pointer: fine)").matches; } 
    catch { isPointerDevice = navigator.maxTouchPoints === 0; }
    if (!isPointerDevice) return;

    const wrap   = wrapRef.current;
    const sprite = spriteRef.current;
    if (!wrap || !sprite) return;

    // Initial hotspot state (Arrow)
    wrap.dataset.offsetX = "8";
    wrap.dataset.offsetY = "5";

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
    };

    const onLeave  = () => { wrap.style.opacity = "0"; };
    const onEnter  = () => { wrap.style.opacity = "1"; };

    // Zero-lag hover state swapping via direct DOM styling (No React state)
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      let isHover = false;
      try {
        isHover = !!t.closest("a, button, [role='button'], input, textarea, select, label, [tabindex]");
      } catch {}
      
      if (isHover) {
        // Switch to Hand Pointer
        wrap.dataset.offsetX = "10";
        wrap.dataset.offsetY = "4";
        sprite.style.backgroundPosition = "100% 0%";
        // Base scale is 0.08. 0.08 * 1.1 = 0.088
        sprite.style.transform = "scale(0.088) rotate(-3deg)";
      } else {
        // Switch to Normal Arrow
        wrap.dataset.offsetX = "8";
        wrap.dataset.offsetY = "5";
        sprite.style.backgroundPosition = "0% 0%";
        sprite.style.transform = "scale(0.08) rotate(0deg)";
      }
    };

    const tick = () => {
      const el = wrapRef.current;
      if (el) {
        const offsetX = parseFloat(el.dataset.offsetX || "8");
        const offsetY = parseFloat(el.dataset.offsetY || "5");
        // Translate using integer parsing for max CPU performance
        el.style.transform = `translate(${(pos.current.x | 0) - offsetX}px, ${(pos.current.y | 0) - offsetY}px)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    window.addEventListener("mousemove",   onMove, { passive: true });
    window.addEventListener("mouseover",   onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove",   onMove);
      window.removeEventListener("mouseover",   onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        pointerEvents: "none",
        zIndex:        99999,
        willChange:    "transform",
        transform:     "translate(-400px, -400px)",
        opacity:       0,
        transition:    "opacity 0.2s ease",
      }}
    >
      <div 
        ref={spriteRef}
        style={{
          /* 
            ANTI-PIXELATION ARCHITECTURE:
            Instead of shrinking the container and relying on CSS background-size (which uses low-quality CPU interpolation),
            we draw the image at its native 1:1 resolution (400x400) and use CSS transform scale(0.08) to shrink it down.
            This forces the GPU to use high-quality mipmap trilinear filtering, completely eliminating pixelation.
          */
          width:              "400px",
          height:             "400px",
          backgroundImage:    "url('https://cdn.custom-cursor.com/packs/7182/starter-northern-lights-pack.png')",
          backgroundSize:     "200% 100%", // 800x400
          backgroundPosition: "0% 0%",
          backgroundRepeat:   "no-repeat",
          transformOrigin:    "top left",
          // drop-shadow values multiplied by 12.5 to match the 0.08 scale
          filter:             "drop-shadow(25px 37px 50px rgba(0,0,0,0.3))",
          transform:          "scale(0.08) rotate(0deg)",
          transition:         "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-position 0.1s steps(1)", // Snappy switch
        }}
      />
    </div>
  );
}
