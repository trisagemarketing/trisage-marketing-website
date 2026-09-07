"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

/**
 * PREMIUM FLUID DOT & MAGNETIC RING CUSTOM CURSOR
 *
 * Architecture Improvements:
 * 1. 0ms Latency on Core Dot: Inner dot uses raw `mouseX/Y` directly (no spring physics).
 * 2. 100% GPU Accelerated: Uses `transform: translate3d` and `scale`. Zero width/height layout thrashing.
 * 3. Bypassed React State for Motion: Interaction states (hover, click) use `MotionValues` directly.
 * 4. CSS Containment: Applied `contain: layout paint style` to strictly isolate rendering.
 * 5. Coarse Pointer Guard: Component unmounts gracefully if touch device is detected.
 */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(true); // Tracks capability gracefully via React state

  const prefersReducedMotion = useReducedMotion();

  // ── Raw Pointer Coordinates ── (Started far off-screen)
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // ── Physics (Ring Only) ──
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  // ── High-Frequency Interaction States (Bypass React) ──
  // 0 = false, 1 = true
  const hoverState = useMotionValue(0);
  const clickState = useMotionValue(0);
  const visibleState = useMotionValue(0);

  // ── Smooth Transitions via useSpring ──
  // Damping controls the "bounciness" (higher = less bounce). Stiffness controls speed.
  const smoothHover = useSpring(hoverState, { damping: 25, stiffness: 400 });
  const smoothClick = useSpring(clickState, { damping: 25, stiffness: 400 });
  const smoothVisible = useSpring(visibleState, { damping: 20, stiffness: 300 });

  // ── Derived Continuous Transforms ──
  // By mathematically combining the smooth values instead of using if/else logic,
  // we guarantee buttery smooth interpolation on every single frame.
  const dotScale = useTransform([smoothHover, smoothClick], ([hover, click]: number[]) => {
    const base = 1;
    const hoverEffect = hover * -1;      // Dot shrinks to 0 on hover
    const clickEffect = click * -0.25;   // Dot shrinks slightly on click
    return Math.max(0, base + hoverEffect + clickEffect);
  });

  const ringScale = useTransform([smoothHover, smoothClick], ([hover, click]: number[]) => {
    const base = 1;
    const hoverEffect = hover * 0.6;     // Ring expands to 1.6 on hover
    const clickEffect = click * -0.25;   // Ring shrinks on click
    return Math.max(0, base + hoverEffect + clickEffect);
  });

  const ringOpacity = useTransform([smoothClick], ([click]: number[]) => {
    // Only visible during a click event for the click effect
    return click * 0.8; 
  });

  const dotOpacity = useTransform([smoothClick], ([click]: number[]) => {
    // Only visible during a click event
    return click;
  });
  
  // Make the background highly visible yet translucent cyan on click
  const ringBg = useTransform(smoothClick, [0, 1], ["rgba(14, 165, 233, 0)", "rgba(14, 165, 233, 0.15)"]);

  // Track if listeners are active
  const listenersActive = useRef(false);
  // Cache to avoid duplicate node checks
  const lastHoveredNode = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    let mql: MediaQueryList | null = null;
    try { mql = window.matchMedia("(pointer: fine)"); } catch { /* SSR guard */ }

    // ── Event Handlers ──
    const onMove = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (visibleState.get() === 0) visibleState.set(1);
    };

    // Use pointerover/pointerout for more efficient bubbling evaluation
    const onPointerOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      
      if (t === lastHoveredNode.current) return;
      lastHoveredNode.current = t;

      try {
        const isInteractive = !!t.closest(
          "a, button, [role='button'], input, textarea, select, label, [tabindex]"
        );
        hoverState.set(isInteractive ? 1 : 0);
      } catch { /* Node detached */ }
    };

    const onPointerOut = (e: PointerEvent) => {
      // Small reset if leaving an element
      const t = e.target as HTMLElement | null;
      if (t === lastHoveredNode.current) {
        lastHoveredNode.current = null;
        hoverState.set(0);
      }
    };

    const onPointerDown = () => clickState.set(1);
    const onPointerUp = () => clickState.set(0);

    const onLeave = () => visibleState.set(0);
    const onEnter = (e: PointerEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      visibleState.set(1);
    };

    // ── Attach/Detach Helpers ──
    const attach = () => {
      if (listenersActive.current) return;
      listenersActive.current = true;
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onPointerOver, { passive: true });
      document.addEventListener("pointerout", onPointerOut, { passive: true });
      document.addEventListener("pointerdown", onPointerDown, { passive: true });
      document.addEventListener("pointerup", onPointerUp, { passive: true });
      document.addEventListener("pointerleave", onLeave, { passive: true }); // Document leave
      document.addEventListener("pointerenter", onEnter, { passive: true }); // Document enter
    };

    const detach = () => {
      if (!listenersActive.current) return;
      listenersActive.current = false;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      
      visibleState.set(0);
      hoverState.set(0);
      clickState.set(0);
    };

    const onPointerChange = (e: MediaQueryListEvent) => {
      setIsPointer(e.matches);
      if (e.matches) attach();
      else detach();
    };

    const initialIsPointer = mql ? mql.matches : navigator.maxTouchPoints === 0;
    setIsPointer(initialIsPointer);
    
    if (initialIsPointer) attach();
    mql?.addEventListener("change", onPointerChange);

    return () => {
      detach();
      mql?.removeEventListener("change", onPointerChange);
    };
  }, [mouseX, mouseY, hoverState, clickState, visibleState]);

  // SSR & Mobile Guard
  if (!mounted || !isPointer) return null;

  return (
    <>

      {/* 1. Outer Magnetic Ring */}
      <motion.div
        className="fixed pointer-events-none z-[2147483640] rounded-full border-[1.5px] border-primary-500/60 dark:border-primary-400/60"
        style={{
          top: -16,
          left: -16,
          width: 32,
          height: 32,
          x: prefersReducedMotion ? mouseX : ringX,
          y: prefersReducedMotion ? mouseY : ringY,
          scale: ringScale,
          opacity: ringOpacity,
          backgroundColor: ringBg,
          contain: "layout paint style", // Strict rendering isolation
          willChange: "transform, opacity",
        }}
      />

      {/* 2. Core Fluid Dot (0ms Latency) */}
      <motion.div
        className="fixed pointer-events-none z-[2147483647] rounded-full bg-primary-600 dark:bg-primary-400 shadow-[0_0_8px_rgba(14,165,233,0.4)]"
        style={{
          top: -4,
          left: -4,
          width: 8,
          height: 8,
          x: mouseX, // Raw 1:1 hardware pointer
          y: mouseY, // Raw 1:1 hardware pointer
          scale: dotScale,
          opacity: dotOpacity,
          contain: "layout paint style", // Strict rendering isolation
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
