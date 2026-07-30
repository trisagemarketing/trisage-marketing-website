"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const shouldUseNativeScroll = window.matchMedia(
      "(pointer: coarse), (max-width: 767px), (prefers-reduced-motion: reduce)"
    ).matches;

    if (shouldUseNativeScroll) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // 1. Synchronize Lenis scroll updates directly into GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis through GSAP's master ticker to guarantee 100% frame synchronization
    const updateLenisWithGsap = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenisWithGsap);
    gsap.ticker.lagSmoothing(0); // Prevents lag spikes from causing scroll jumps

    return () => {
      gsap.ticker.remove(updateLenisWithGsap);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
