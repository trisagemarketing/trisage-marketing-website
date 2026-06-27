"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Puzzle, Network, CheckCircle2, XCircle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const challenges = [
  "Low Occupancy",
  "Inconsistent Branding",
  "Weak Guest Engagement",
  "Heavy OTA Dependence"
];

const solutions = [
  "Higher Visibility",
  "Stronger Brand Presence",
  "More Direct Bookings",
  "Long-Term Brand Value"
];

const SplitWords = ({ text }: { text: string }) => {
  let isBoldContext = false;
  
  return (
    <>
      {text.split(" ").map((word, wordIndex) => {
        let cleanWord = word;
        let shouldBeBold = isBoldContext;
        
        const boldStarts = cleanWord.startsWith("**");
        
        if (boldStarts) {
          isBoldContext = true;
          shouldBeBold = true;
          cleanWord = cleanWord.replace("**", "");
        }
        
        if (cleanWord.includes("**")) {
          isBoldContext = false;
          shouldBeBold = true;
          cleanWord = cleanWord.replace("**", "");
        }

        return (
          <span 
            key={wordIndex} 
            className={`reveal-word inline-block opacity-50 transition-opacity duration-100 mr-[0.25em] ${shouldBeBold ? 'font-black' : 'font-medium'}`}
          >
            {cleanWord}
          </span>
        );
      })}
    </>
  );
};

export default function HomeServices() {
  const containerRef = useRef<HTMLElement>(null);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);
  const panWrapperRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  
  const mobileLineRef = useRef<HTMLDivElement>(null);
  const problemLineRef = useRef<HTMLDivElement>(null);
  const solutionLineRef = useRef<HTMLDivElement>(null);
  const problemPlanetRef = useRef<HTMLDivElement>(null);
  const solutionPlanetRef = useRef<HTMLDivElement>(null);
  
  const problemCardRef = useRef<HTMLDivElement>(null);
  const solutionCardRef = useRef<HTMLDivElement>(null);
  
  const headingReveal1Ref = useRef<HTMLSpanElement>(null);
  const headingReveal2Ref = useRef<HTMLSpanElement>(null);
  const headingReveal3Ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // 1. UNIVERSAL TEXT READING SCRUB (Before Pin)
    const textTl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerWrapperRef.current,
        start: "top 85%", 
        end: "center center", 
        scrub: 1,
      }
    });

    textTl.to(headingReveal1Ref.current, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.25 })
      .to(headingReveal2Ref.current, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.05 })
      .to(headingReveal3Ref.current, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: 0.20 })
      .to(".reveal-word", { opacity: 1, stagger: 0.05, ease: "none", duration: 0.50 });

    mm.add({
      isDesktop: "(min-width: 1024px)", // Desktop & Large Tablet
      isMobile: "(max-width: 1023px)"   // Mobile & Small Tablet
    }, (context) => {
      const { isDesktop } = context.conditions as any;
      
      if (isDesktop) {
        // ----------------------------------------------------------------------
        // DESKTOP: FULL 3D FLIP WITH NATIVE PINNING
        // ----------------------------------------------------------------------
        const flipScroll = 800; 
        const readDelay = 300; 
        const totalScroll = readDelay + flipScroll;
        
        // Setup initial 3D states explicitly for desktop
        gsap.set(cardsContainerRef.current, { 
          transformOrigin: `50% ${triggerWrapperRef.current?.offsetHeight! / 2}px`,
          rotateX: 180 
        });
        
        // Reset mobile layout overrides
        gsap.set(blockRef.current, { clearProps: "transform,rotateX,scale,yoyo,repeat" });
        gsap.set(problemCardRef.current, { clearProps: "opacity,y" });
        gsap.set(solutionCardRef.current, { clearProps: "opacity,y" });

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerWrapperRef.current,
            start: "top 15%", 
            end: `+=${totalScroll}`,
            pin: true,
            pinSpacing: true, // Native GSAP compositor-friendly spacing
            scrub: 1,
          }
        });

        masterTl.add("flipStart", readDelay);

        masterTl.to(blockRef.current, {
          rotateX: 180,
          ease: "none",
          duration: flipScroll * 0.7,
          force3D: true, // GPU Acceleration
        }, "flipStart");
        
        masterTl.to(blockRef.current, {
          scale: 0.85,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
          duration: flipScroll * 0.35,
          force3D: true,
        }, "flipStart");

        masterTl.add("linesStart", readDelay + flipScroll * 0.4);
        
        masterTl.fromTo(problemLineRef.current, 
          { clipPath: "circle(0% at 0% 0%)", opacity: 1 }, 
          { clipPath: "circle(150% at 0% 0%)", ease: "none", duration: flipScroll * 0.5 }, 
          "linesStart"
        );
        
        masterTl.set({}, {}, totalScroll);

        // Independent Solution Line
        gsap.fromTo(solutionLineRef.current, 
          { clipPath: "circle(0% at 100% 100%)", opacity: 1 }, 
          { 
            clipPath: "circle(150% at 100% 100%)", 
            ease: "power2.out", 
            scrollTrigger: {
              trigger: solutionCardRef.current,
              start: "top 75%",
              end: "top 25%", 
              scrub: 1,
            }
          }
        );

        // Planet Parallax
        gsap.to(problemPlanetRef.current, {
          yPercent: 40,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });

        gsap.to(solutionPlanetRef.current, {
          yPercent: -50,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });

      } else {
        // ----------------------------------------------------------------------
        // MOBILE: GRACEFUL DEGRADATION (ZERO JITTER)
        // ----------------------------------------------------------------------
        // No pinning, no 3D flip. Stacked layout for perfect native scroll.
        gsap.set(cardsContainerRef.current, { rotateX: 0 });
        gsap.set(blockRef.current, { rotateX: 0 });

        // Slide Up Header Text for Mobile
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          { 
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true,
            scrollTrigger: {
              trigger: triggerWrapperRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Slide In Problem Card (From Left)
        gsap.fromTo(problemCardRef.current,
          { opacity: 0, x: -50 },
          { 
            opacity: 1, x: 0, duration: 0.8, ease: "power3.out", force3D: true,
            scrollTrigger: {
              trigger: problemCardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Slide In Solution Card (From Right)
        gsap.fromTo(solutionCardRef.current,
          { opacity: 0, x: 50 },
          { 
            opacity: 1, x: 0, duration: 0.8, ease: "power3.out", force3D: true,
            scrollTrigger: {
              trigger: solutionCardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
        
        // Smooth mobile line draw
        gsap.fromTo(mobileLineRef.current, 
          { scaleY: 0 }, 
          { 
            scaleY: 1, 
            ease: "none", 
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1
            }
          }
        );
      }
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative pt-4 pb-12 md:pb-16 lg:pt-8 bg-primary-50 dark:bg-primary-950 overflow-x-hidden overflow-y-visible transition-colors duration-700"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-8 w-full">
        
        {/* STABLE WRAPPER (Prevents GSAP ScrollTrigger Glitching during 3D rotations) */}
        <div ref={triggerWrapperRef} className="relative w-full">
          
          {/* PAN WRAPPER (Moves the block up while pinned to reveal bottom cards) */}
          <div ref={panWrapperRef} className="relative w-full" style={{ perspective: "3000px" }}>
            
            {/* THE FLIPPING MASTER BLOCK */}
            <div 
              ref={blockRef} 
              className="grid grid-cols-1 w-full relative" 
            style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
          >
            
            {/* FRONT FACE: HEADER BLOCK */}
            <div 
              ref={headerRef} 
              className="col-start-1 row-start-1 relative text-center max-w-3xl mx-auto w-full lg:h-full z-20 flex flex-col justify-start pb-12 lg:pb-0" 
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Vela Pulsar Star */}
              <div className="absolute hidden dark:block right-[-10%] md:right-[-20%] top-[40%] md:top-[50%] w-[120px] h-[120px] md:w-[220px] md:h-[220px] pointer-events-none z-[-1]" style={{ transform: "translateY(-50%)" }}>
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[30px] animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-0 animate-[planetSpin_15s_linear_infinite]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[2px] opacity-80" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-[4px] rotate-90 opacity-60" />
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] bg-white rounded-full blur-[2px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] bg-cyan-300 rounded-full blur-[8px] animate-ping opacity-60" style={{ animationDuration: '1.5s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-blue-500 rounded-full blur-[15px] animate-pulse" style={{ animationDuration: '0.8s' }} />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 tracking-tight flex flex-wrap justify-center gap-x-2 md:gap-x-3">
                <span className="relative inline-block whitespace-nowrap">
                  <span className="opacity-50 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-300">
                    From Hotel Challenges
                  </span>
                  <span ref={headingReveal1Ref} className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-300" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>
                    From Hotel Challenges
                  </span>
                </span>
                <span className="relative inline-block whitespace-nowrap">
                  <span className="opacity-50">to</span>
                  <span ref={headingReveal2Ref} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>to</span>
                </span>
                <br className="md:hidden w-full basis-full h-0" />
                <span className="relative inline-block whitespace-nowrap">
                  <span className="opacity-50 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300">
                    Hospitality Growth
                  </span>
                  <span ref={headingReveal3Ref} className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-300" style={{ clipPath: "inset(0 100% 0 0)", WebkitClipPath: "inset(0 100% 0 0)" }}>
                    Hospitality Growth
                  </span>
                </span>
              </h2>
              
              <div className="font-sans font-medium text-lg sm:text-xl lg:text-[2rem] leading-snug lg:leading-[1.3] uppercase tracking-tight text-balance px-2">
                <span className="inline-block text-primary-600 dark:text-primary-400 mb-2">
                  <SplitWords text="Most **hospitality brands** struggle not because the property lacks potential, but because the digital ecosystem around the brand is incomplete." />
                </span>
                <br/>
                <span className="inline-block text-gray-900 dark:text-white mt-4">
                  <SplitWords text="**Weak visibility**, **inconsistent branding**, **low guest engagement**, and **high OTA dependency** can quietly reduce revenue opportunities." />
                </span>
              </div>
            </div>

            {/* BACK FACE: TIMELINE CARDS */}
            <div 
              ref={cardsContainerRef} 
              className="col-start-1 row-start-2 lg:row-start-1 w-full z-10 flex flex-col items-center" 
              style={{ 
                backfaceVisibility: "hidden", 
                transformStyle: "preserve-3d", // Prevent rendering glitches for nested 3D planets
              }}
            >

              {/* Mobile/Tablet Vertical Dotted Line */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] lg:hidden z-0 opacity-50">
                <div ref={mobileLineRef} className="w-full h-full border-l-[2px] border-dashed border-gray-300 dark:border-gray-700 origin-top"></div>
              </div>

              {/* Card 1: PROBLEM */}
              <div 
                ref={problemCardRef}
                className="relative z-10 w-[84%] sm:w-fit sm:min-w-[400px] lg:max-w-[60%] mx-auto lg:mx-0 lg:mr-auto lg:ml-12 xl:ml-16 mb-6 md:mb-16 lg:mb-20"
              >
                <div className="relative w-full mt-4 md:mt-8">
                  
                  {/* Problem Card Exo-Planet */}
                  <div ref={problemPlanetRef} className="absolute hidden dark:block -top-20 -right-16 md:-top-32 md:-right-24 w-32 h-32 md:w-48 md:h-48 pointer-events-none z-[-2]" style={{
                    animation: "planetFloat 12s ease-in-out infinite",
                    transformStyle: "preserve-3d"
                  }}>
                    <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] pointer-events-none" style={{
                      transform: "translate(-50%, -50%) rotateZ(-20deg) rotateX(65deg)",
                      transformStyle: "preserve-3d"
                    }}>
                      <div className="absolute inset-0 animate-[planetSpin_15s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
                        <div className="absolute inset-0 border-[3px] border-red-500/30 rounded-full" />
                        <div className="absolute inset-4 border-[1px] border-dashed border-orange-400/40 rounded-full" />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full" style={{
                      transform: "translateZ(1px)",
                      background: "radial-gradient(circle at 30% 30%, #ef4444 0%, #7f1d1d 50%, #000000 100%)",
                      boxShadow: "0 0 25px 5px rgba(239,68,68,0.3), inset -12px -12px 25px rgba(0,0,0,0.9)"
                    }}>
                       <div className="absolute inset-0 rounded-full border-[2px] border-red-400/20 mix-blend-screen" />
                       <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden mix-blend-overlay opacity-60">
                         <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%) rotate(-15deg)" }}>
                           <div className="absolute inset-0 animate-[planetSpin_25s_linear_infinite]">
                             <div className="absolute top-[20%] left-[10%] w-[15%] h-[15%] bg-black/60 rounded-full blur-[2px] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.2)]" />
                             <div className="absolute top-[40%] left-[60%] w-[25%] h-[20%] bg-black/50 rounded-full blur-[3px] shadow-[inset_3px_3px_6px_rgba(255,255,255,0.1)]" />
                             <div className="absolute top-[70%] left-[30%] w-[10%] h-[10%] bg-black/70 rounded-full blur-[1px] shadow-[inset_1px_1px_3px_rgba(255,255,255,0.3)]" />
                             <div className="absolute top-[30%] left-[40%] w-[40%] h-[5%] bg-black/40 rotate-[35deg] blur-[1px] shadow-[0_1px_2px_rgba(255,255,255,0.2)] rounded-full" />
                             <div className="absolute top-[60%] left-[15%] w-[30%] h-[4%] bg-black/50 -rotate-[20deg] blur-[1px] shadow-[0_1px_2px_rgba(255,255,255,0.2)] rounded-full" />
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="absolute bg-[#243384] z-0 shadow-[0_15px_40px_rgba(36,51,132,0.2)] rounded-3xl lg:rounded-[2.5rem] -top-2 -bottom-2 -left-4 -right-4 sm:-top-3 sm:-bottom-3 sm:-left-6 sm:-right-6 lg:-top-[15px] lg:-bottom-[15px] lg:-left-[35px] lg:-right-[35px] -skew-x-6 -rotate-3 sm:-skew-x-[10deg] sm:-rotate-[4deg] lg:-skew-x-[15deg] lg:-rotate-[6deg] transition-transform duration-300"></div>
                  
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl lg:rounded-[1.25rem] pt-5 pb-6 pr-6 sm:pt-6 sm:pb-8 sm:pr-8 lg:pt-7 lg:pb-10 lg:pr-10 pl-[70px] sm:pl-[90px] lg:pl-[120px] z-10 dark:border dark:border-gray-800 shadow-xl">
                    {/* Dynamic Dotted Swoosh Line */}
                    <div 
                      ref={problemLineRef}
                      className="absolute top-1/2 left-full w-[80px] lg:w-[150px] xl:w-[250px] h-[150px] border-t-[2px] border-r-[2px] border-dashed border-gray-400 dark:border-gray-600 rounded-tr-[50px] -z-10 hidden lg:block pointer-events-none opacity-0"
                      style={{ maskImage: "linear-gradient(to bottom, black 10%, transparent 90%)", WebkitMaskImage: "linear-gradient(to bottom, black 10%, transparent 90%)" }}
                    ></div>
                    {/* Right Edge Connection Dot */}
                    <div className="absolute top-1/2 -translate-y-1/2 -right-[7px] w-[14px] h-[14px] rounded-full bg-white dark:bg-gray-900 border-[3px] border-[#243384] dark:border-[#5c7ae0] hidden lg:block shadow-sm z-20"></div>

                    <div className="absolute top-0 left-4 sm:left-6 w-[45px] sm:w-[55px] lg:w-[75px] h-[75px] sm:h-[90px] lg:h-[120px] bg-[#243384] flex justify-center pt-3 sm:pt-4 lg:pt-6" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}>
                      <Puzzle className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white transform -rotate-12" strokeWidth={2.5} />
                    </div>

                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-4 sm:mb-5">PROBLEM</h3>
                    
                    <div className="flex flex-col gap-2 sm:gap-3 max-h-[35vh] lg:max-h-[40vh] overflow-y-auto hide-scrollbar pointer-events-auto pb-2">
                      {challenges.map((challenge, i) => (
                        <div key={i} className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300">
                          <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 shrink-0" />
                          <span className="font-medium text-[13px] sm:text-[15px] lg:text-base leading-tight">{challenge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: SOLUTION */}
              <div 
                ref={solutionCardRef}
                className="relative z-10 w-[84%] sm:w-fit sm:min-w-[400px] lg:max-w-[60%] mx-auto lg:mx-0 lg:ml-auto lg:mr-12 xl:mr-16 mt-4 md:mt-8 lg:mt-[56px] mb-6"
              >
                <div className="relative w-full mt-4 md:mt-8">
                  
                  {/* Solution Card Exo-Planet */}
                  <div ref={solutionPlanetRef} className="absolute hidden dark:block -bottom-20 -right-16 md:-bottom-32 md:-right-28 w-36 h-36 md:w-56 md:h-56 pointer-events-none z-[-2]" style={{
                    animation: "planetFloat 18s ease-in-out infinite reverse",
                    transformStyle: "preserve-3d"
                  }}>
                    <div className="absolute top-1/2 left-1/2 w-[180%] h-[180%] pointer-events-none" style={{
                      transform: "translate(-50%, -50%) rotateZ(-15deg) rotateX(65deg)",
                      transformStyle: "preserve-3d"
                    }}>
                      <div className="absolute inset-0 animate-[planetSpin_15s_linear_infinite_reverse]" style={{ transformStyle: "preserve-3d" }}>
                        <div className="absolute inset-0 border-[2px] border-cyan-400/40 rounded-full" />
                        <div className="absolute inset-8 border-[1px] border-dashed border-teal-300/30 rounded-full" />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full" style={{
                      transform: "translateZ(1px)",
                      background: "radial-gradient(circle at 30% 30%, #22d3ee 0%, #155e75 60%, #000000 100%)",
                      boxShadow: "0 0 25px 8px rgba(6,182,212,0.15), inset -12px -12px 25px rgba(0,0,0,0.8)"
                    }}>
                       <div className="absolute inset-0 rounded-full border-[2px] border-cyan-300/20 mix-blend-screen" />
                       <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden mix-blend-overlay opacity-50">
                         <div className="absolute w-[200%] h-[200%] top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%) rotate(15deg)" }}>
                           <div className="absolute inset-0 animate-[planetSpin_20s_linear_infinite_reverse]">
                             <div className="absolute top-[30%] left-[20%] w-[80%] h-[15%] bg-white/40 rounded-full blur-[8px] rotate-[10deg]" />
                             <div className="absolute top-[60%] left-[10%] w-[90%] h-[20%] bg-cyan-900/60 rounded-full blur-[10px] -rotate-[5deg]" />
                             <div className="absolute top-[45%] left-[50%] w-[20%] h-[20%] bg-white/60 rounded-full blur-[5px]" />
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="absolute bg-[#243384] z-0 shadow-[0_15px_40px_rgba(36,51,132,0.2)] rounded-3xl lg:rounded-[2.5rem] -top-2 -bottom-2 -left-4 -right-4 sm:-top-3 sm:-bottom-3 sm:-left-6 sm:-right-6 lg:-top-[15px] lg:-bottom-[15px] lg:-left-[35px] lg:-right-[35px] skew-x-6 rotate-3 sm:skew-x-[10deg] sm:rotate-[4deg] lg:skew-x-[15deg] lg:rotate-[6deg] transition-transform duration-300"></div>
                  
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl lg:rounded-[1.25rem] pt-5 pb-6 pr-6 sm:pt-6 sm:pb-8 sm:pr-8 lg:pt-7 lg:pb-10 lg:pr-10 pl-[70px] sm:pl-[90px] lg:pl-[120px] z-10 dark:border dark:border-gray-800 shadow-xl">
                    {/* Dynamic Dotted Swoosh Line */}
                    <div 
                      ref={solutionLineRef}
                      className="absolute bottom-1/2 right-full w-[80px] lg:w-[150px] xl:w-[250px] h-[150px] border-b-[2px] border-l-[2px] border-dashed border-gray-400 dark:border-gray-600 rounded-bl-[50px] -z-10 hidden lg:block pointer-events-none opacity-0"
                      style={{ maskImage: "linear-gradient(to top, black 10%, transparent 90%)", WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)" }}
                    ></div>
                    {/* Left Edge Connection Dot */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-[7px] w-[14px] h-[14px] rounded-full bg-white dark:bg-gray-900 border-[3px] border-[#243384] dark:border-[#5c7ae0] hidden lg:block shadow-sm z-20"></div>

                    <div className="absolute top-0 left-4 sm:left-6 w-[45px] sm:w-[55px] lg:w-[75px] h-[75px] sm:h-[90px] lg:h-[120px] bg-[#243384] flex justify-center pt-3 sm:pt-4 lg:pt-6" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}>
                      <Network className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
                    </div>

                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] lg:tracking-[0.2em] mb-4 sm:mb-5">SOLUTION</h3>
                    
                    <div className="flex flex-col gap-2 sm:gap-3 max-h-[35vh] lg:max-h-[40vh] overflow-y-auto hide-scrollbar pointer-events-auto pb-2">
                      {solutions.map((solution, i) => (
                        <div key={i} className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 shrink-0" />
                          <span className="font-medium text-[13px] sm:text-[15px] lg:text-base leading-tight">{solution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
