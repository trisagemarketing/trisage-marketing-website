"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bottomWordsRef = useRef<(HTMLHeadingElement | null)[]>([]);

  useGSAP(() => {
    // Media Query context for safe mobile degradation
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isMobile, isDesktop } = context.conditions as Record<string, boolean>;
      
      // Fallback state protection: ensure wrapper is visible 
      gsap.set(textWrapperRef.current, { opacity: 1 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Set initial states explicitly to hide text behind mask
      gsap.set(lettersRef.current, { 
        y: isMobile ? 80 : 160, 
        scaleY: isMobile ? 1.05 : 1.15, 
        skewY: isMobile ? 4 : 8, 
        opacity: 0 
      });
      // DIGITAL and MARKETING: Whole word center-to-origin bounce setup
      gsap.set(bottomWordsRef.current[0], { 
        x: isMobile ? "35vw" : "38vw",
        opacity: 0 
      });
      gsap.set(bottomWordsRef.current[1], { 
        x: isMobile ? "-35vw" : "-38vw",
        opacity: 0 
      });

      // Part 1 & 2: Initial Load Reveal with kinetic settling
      tl.to(lettersRef.current, {
        y: 0,
        scaleY: 1,
        skewY: 0,
        opacity: 1,
        duration: isMobile ? 1.0 : 1.4,
        stagger: 0.04,
        ease: "back.out(1.2)", // Elegant physical settling overshoot
        force3D: true,
      })
      // DIGITAL: Whole word center-to-origin bounce
      .to(bottomWordsRef.current[0], {
        x: 0,
        opacity: 1,
        duration: isMobile ? 1.5 : 2.0,
        ease: "bounce.out",
        force3D: true,
      }, "-=0.8")
      // MARKETING: Whole word center-to-origin bounce
      .to(bottomWordsRef.current[1], {
        x: 0,
        opacity: 1,
        duration: isMobile ? 1.5 : 2.0,
        ease: "bounce.out",
        force3D: true,
      }, "<0.15"); // Slight stagger between the two words

      // Part 3 & 4: Single Consolidated Scroll Timeline
      if (isDesktop) {
        const skewTo = gsap.quickTo(textWrapperRef.current, "skewX", { duration: 0.4, ease: "power3.out" });

        gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1, // Smooth interpolation
            onUpdate: (self) => {
              const velocity = self.getVelocity();
              let skew = velocity / 500;
              skew = Math.max(-3, Math.min(3, skew)); // Clamp between -3 and 3
              skewTo(skew);
            }
          }
        }).to(textWrapperRef.current, {
          y: -100,
          scale: 0.94,
          skewY: -2,
          ease: "none",
          force3D: true,
        });
      }
    });

  }, { scope: containerRef });

  return (
    <section className="relative w-full flex flex-col justify-center pt-32 pb-8 lg:pt-40 lg:pb-12 overflow-hidden bg-transparent">

      {/* Background Decor - Extremely subtle proper gradient for pure white/dark */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden dark:block">
        <div className="absolute top-0 right-0 w-full h-125 bg-linear-to-b from-primary-50/50 dark:from-primary-900/10 to-transparent" />
        <div className="absolute top-20 right-10 w-150 h-150 bg-primary-400/5 dark:bg-primary-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-125 h-125 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-[100px]" />
      </div>

      {/* --- Massive Typography Design (Light & Dark Mode) --- */}
      <div 
        ref={containerRef}
        className="w-full relative z-20 overflow-hidden flex flex-col justify-center items-center"
      >
        {/* Container-constrained layout for massive typography to align with Navbar on 4K */}
        <div className="container mx-auto px-4 md:px-8 flex flex-col justify-center">
          
          {/* Outer Wrapper: Dedicated Single Owner for Scroll Parallax (y, scale, skewY) */}
          <div ref={textWrapperRef} className="w-full flex flex-col transform-gpu opacity-0">
            {/* Top Giant Text - TRISAGE */}
            <h1 
              className="font-hero w-full flex justify-between items-center font-medium text-primary-500 dark:text-primary-300 uppercase cursor-default tracking-tighter"
              style={{ 
                fontSize: 'clamp(5rem, 27.5vw, 420px)',
                lineHeight: '1',
              }}
              aria-label="TRISAGE"
            >
              {['T', 'R', 'I', 'S', 'A', 'G', 'E'].map((letter, i) => (
                <div key={i} className="overflow-hidden inline-block px-16 -mx-16 pt-24 -mt-24 pb-24 -mb-24">
                  <span 
                    ref={el => { lettersRef.current[i] = el; }}
                    aria-hidden="true" 
                    className="inline-block transform-gpu opacity-0"
                  >
                    {letter}
                  </span>
                </div>
              ))}
            </h1>
            
            {/* Bottom Split Text - DIGITAL / MARKETING */}
            <div className="flex flex-row w-full justify-between items-end mt-2 md:mt-4 lg:mt-6">
              <h2 
                ref={el => { bottomWordsRef.current[0] = el; }}
                className="font-hero font-bold text-secondary-600 dark:text-secondary-400 uppercase flex transform-gpu opacity-0"
                style={{ 
                  fontSize: 'clamp(1.5rem, 5vw, 4rem)', 
                  lineHeight: '1', 
                  letterSpacing: '0.04em',
                }}
              >
                DIGITAL
              </h2>
              
              <h2 
                ref={el => { bottomWordsRef.current[1] = el; }}
                className="font-hero font-bold text-secondary-600 dark:text-secondary-400 uppercase text-right flex mt-0 transform-gpu opacity-0"
                style={{ 
                  fontSize: 'clamp(1.5rem, 5vw, 4rem)', 
                  lineHeight: '1', 
                  letterSpacing: '0.04em',
                }}
              >
                MARKETING
              </h2>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
