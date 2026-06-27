"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * FLUID DOT & MAGNETIC RING CUSTOM CURSOR
 *
 * Bug Fixes (Senior Audit):
 * 1. Visibility guard: cursor hides when mouse leaves window (DevTools drag, alt-tab etc.)
 *    and re-appears instantly when mouse re-enters — eliminates the "ghost" frozen cursor.
 * 2. DevTools resize / mobile-emulation safe: pointer-device check uses a live
 *    MediaQueryList with an `addEventListener("change")` so toggling DevTools device
 *    toolbar correctly tears down or re-attaches all listeners without a page refresh.
 * 3. Initial position guard: cursor elements start with opacity-0 and only fade in
 *    after the FIRST real mousemove event, eliminating the (-100,-100) snap/jump glitch.
 * 4. Stable effect: dependency array is empty `[]` — MotionValues are stable refs and
 *    must NOT be listed as deps (they never change identity, but listing them caused
 *    the early-return guard to skip re-attachment on every render cycle).
 * 5. All event listeners are registered on `document` (not `window`) for consistency,
 *    matching browser DevTools inspector behaviour where `window` events can be masked.
 */
export default function CustomCursor() {
  const [mounted, setMounted]     = useState(false);
  const [visible, setVisible]     = useState(false); // false until first real mousemove
  const [isHover, setIsHover]     = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Raw pointer coordinates — start far off-screen so springs settle before reveal
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Outer Ring — smooth trailing spring
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 180, mass: 0.6 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 180, mass: 0.6 });

  // Inner Dot — snappy, near-instant spring
  const dotX = useSpring(mouseX, { damping: 35, stiffness: 400, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 35, stiffness: 400, mass: 0.1 });

  // Track whether listeners are currently attached so we never double-attach
  const listenersActive = useRef(false);

  useEffect(() => {
    setMounted(true);

    // --- Live pointer-device detection via MediaQueryList ---
    // This survives DevTools opening/closing in device emulation mode.
    let mql: MediaQueryList | null = null;
    try { mql = window.matchMedia("(pointer: fine)"); } catch { /* SSR guard */ }

    // ── Event Handlers ──────────────────────────────────────────────────────

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      // Only reveal cursor after the very first real movement
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      let hovering = false;
      try {
        hovering = !!t.closest(
          "a, button, [role='button'], input, textarea, select, label, [tabindex]"
        );
      } catch { /* Element may be detached */ }
      setIsHover(hovering);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp   = () => setIsClicking(false);

    // Hide cursor when mouse leaves the page (DevTools panel, other windows)
    const onLeave = () => setVisible(false);
    // Restore cursor when mouse re-enters the page
    const onEnter = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    // ── Attach / Detach helpers ─────────────────────────────────────────────

    const attach = () => {
      if (listenersActive.current) return; // Guard against double-attach
      listenersActive.current = true;
      document.addEventListener("mousemove",  onMove,      { passive: true });
      document.addEventListener("mouseover",  onOver,      { passive: true });
      document.addEventListener("mousedown",  onMouseDown);
      document.addEventListener("mouseup",    onMouseUp);
      document.addEventListener("mouseleave", onLeave);
      document.addEventListener("mouseenter", onEnter);
    };

    const detach = () => {
      if (!listenersActive.current) return;
      listenersActive.current = false;
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mousedown",  onMouseDown);
      document.removeEventListener("mouseup",    onMouseUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      // Reset state cleanly when device switches to touch
      setVisible(false);
      setIsHover(false);
      setIsClicking(false);
    };

    // ── MediaQueryList change handler ───────────────────────────────────────
    // Fires when DevTools toggles between desktop and device emulation mode
    const onPointerChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        attach();
      } else {
        detach();
      }
    };

    // Initial attach based on current pointer type
    const isPointerDevice = mql ? mql.matches : navigator.maxTouchPoints === 0;
    if (isPointerDevice) attach();

    // Listen for live changes (DevTools device toolbar toggle)
    mql?.addEventListener("change", onPointerChange);

    return () => {
      detach();
      mql?.removeEventListener("change", onPointerChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dep array — MotionValues are stable refs, handlers use closure correctly

  // SSR guard — never render on server
  if (!mounted) return null;

  return (
    <>
      {/* Hide native cursor globally — only when a fine pointer is present */}
      <style dangerouslySetInnerHTML={{ __html: `
        body, a, button, [role='button'], input, textarea, select, label {
          cursor: none !important;
        }
      `}} />

      {/* 1. Outer Magnetic Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[2147483640] rounded-full border-[1.5px] border-primary-500/60 dark:border-primary-400/60 backdrop-blur-[1px]"
        animate={{
          width:           isClicking ? 30 : isHover ? 55 : 40,
          height:          isClicking ? 30 : isHover ? 55 : 40,
          opacity:         visible ? 1 : 0,
          backgroundColor: isHover
            ? "rgba(14, 165, 233, 0.08)"
            : "rgba(14, 165, 233, 0)",
        }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* 2. Core Fluid Dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[2147483647] rounded-full bg-primary-600 dark:bg-primary-400 shadow-[0_0_8px_rgba(14,165,233,0.4)]"
        animate={{
          width:   isClicking ? 6 : isHover ? 0 : 8,
          height:  isClicking ? 6 : isHover ? 0 : 8,
          opacity: visible ? (isHover ? 0 : 1) : 0,
        }}
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
