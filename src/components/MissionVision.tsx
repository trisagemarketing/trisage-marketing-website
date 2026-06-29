"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionWrapperRef = useRef<HTMLDivElement>(null);
  
  const missionTextRef = useRef<HTMLButtonElement>(null);
  const visionTextRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isMobile } = context.conditions as { isMobile?: boolean };

      // We animate the Mission card scaling down AS the Vision card scrolls over it.
      // Native CSS 'sticky' handles the actual stacking physics with ZERO artificial gaps.
    
      gsap.set(visionTextRef.current, { opacity: 0.3 });
    
      // Calculate the top offset based on sticky position to perfectly sync the animation
      const topOffset = isMobile ? "32px" : "48px";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: visionWrapperRef.current,
          start: "top bottom", // Animation starts when Vision enters viewport from bottom
          end: `top top+=${topOffset}`, // Animation ends exactly when Vision sticks over Mission
          scrub: true,
        }
      });

      // Animate Mission Card pushing BACK natively under the stacking Vision card.
      // Mobile avoids filter blur because it repaints during touch scroll.
      tl.to(missionRef.current, {
        scale: isMobile ? 0.96 : 0.9,
        yPercent: isMobile ? -1 : -2,
        opacity: isMobile ? 0.65 : 0.4,
        ...(isMobile ? {} : { filter: "blur(4px)" }),
        ease: "none"
      }, 0)
    
      // Crossfade headers smoothly based on Vision card position
      .to(missionTextRef.current, { opacity: 0.3, ease: "none" }, 0)
      .to(visionTextRef.current, { opacity: 1, ease: "none" }, 0);
    });

    return () => mm.revert();

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="relative pt-12 pb-4 md:pt-20 md:pb-8 bg-white dark:bg-[#050b14]"
    >
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header - Not Sticky */}
        <div className="relative z-30 py-4 md:py-6 mb-8 md:mb-12 transition-all overflow-hidden">
          <div className="text-center relative">
            <h2 className="font-sans font-bold text-[6.5vw] sm:text-4xl md:text-5xl lg:text-6xl tracking-tight flex flex-row items-center gap-2 sm:gap-4 md:gap-6 justify-center whitespace-nowrap w-full">
              <button 
                ref={missionTextRef}
                className="text-primary-600 dark:text-primary-400 relative transition-opacity duration-300 cursor-default"
              >
                Our Mission
              </button>
              <span className="text-gray-200 dark:text-gray-800 font-light opacity-50">/</span>
              <button 
                ref={visionTextRef}
                className="text-secondary-600 dark:text-secondary-400 relative transition-opacity duration-300 cursor-default"
              >
                Our Vision
              </button>
            </h2>
          </div>
        </div>

        {/* Magazine Cards Stack Wrapper */}
        <div className="relative w-full pb-4 md:pb-8">
          
          {/* ─── BASE CARD (OUR MISSION) ─── */}
          {/* Sticks natively to the screen without GSAP pin logic */}
          <div 
            className="sticky top-8 md:top-12 z-10 w-full"
          >
            <div 
              ref={missionRef}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 items-center bg-primary-50 dark:bg-primary-950 rounded-2xl md:rounded-3xl will-change-transform origin-top border border-primary-100 dark:border-primary-800 p-5 md:p-8 lg:p-12 shadow-sm"
            >
              {/* Text Content (Left) */}
              <div className="flex flex-col items-start justify-center h-full">
                <div className="font-sans font-medium text-lg sm:text-xl lg:text-[2rem] leading-snug lg:leading-[1.3] uppercase tracking-tight text-balance">
                  <span className="inline-block text-primary-600 dark:text-primary-400 mb-2">
                    Our mission is to empower <strong className="font-black">hospitality brands</strong> with <strong className="font-black">innovative marketing</strong>, <strong className="font-black">branding</strong>, and <strong className="font-black">revenue-focused solutions</strong>.
                  </span>
                  <br/>
                  <span className="inline-block text-gray-900 dark:text-white mt-4">
                    We aim to provide businesses with strategies that are <strong className="font-black">creative</strong>, <strong className="font-black">practical</strong>, <strong className="font-black">performance-driven</strong>, and tailored to their <strong className="font-black">unique goals</strong>.
                  </span>
                </div>
              </div>

              {/* Checkerboard Collage Content (Right) */}
              <div className="relative w-full lg:max-w-none mx-auto aspect-square grid grid-cols-[2fr_1fr_1fr] grid-rows-3 gap-2 md:gap-4">

                {/* BIG Video — tall left column (col 1, row 1-2), no overlap with center image */}
                <div className="col-start-1 col-span-1 row-start-1 row-span-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  {/* Brand gradient overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary-900/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Corner slash inside video tile */}
                  <div
                    className="absolute bottom-0 right-0 w-[45%] h-[45%] pointer-events-none z-10 opacity-[0.18]"
                    style={{
                      clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                      background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    }}
                  />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475042/WhatsApp_Image_2026-06-26_at_5.22.31_PM_nazxmy.jpg" alt="Mission campaign preview" fill sizes="(max-width: 768px) 50vw" className="object-cover md:hidden" />
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 md:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  >
                    <source src="https://res.cloudinary.com/dgoclgj0u/video/upload/v1782477285/Akshaya_Tritiya_Comfort_Inn_qlap7z.mp4" type="video/mp4" />
                  </video>
                </div>

                {/* Top Right */}
                <div className="col-start-3 row-start-1 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475042/WhatsApp_Image_2026-06-26_at_5.22.31_PM_nazxmy.jpg" alt="Mission 1" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
                {/* Center */}
                <div className="col-start-2 row-start-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475041/WhatsApp_Image_2026-06-26_at_5.22.31_PM_1_ht8793.jpg" alt="Mission 2" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Bottom Left */}
                <div className="col-start-1 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_2_s6srlm.jpg" alt="Mission 3" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Bottom Right */}
                <div className="col-start-3 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_5_xg4qut.jpg" alt="Mission 4" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                
              </div>
            </div>
          </div>

          {/* Native Spacer to create scroll distance between cards */}
          <div className="h-[25vh] md:h-[60vh] w-full pointer-events-none"></div>

          {/* ─── TOP CARD (OUR VISION) ─── */}
          {/* Also sticky! Naturally scrolls over the base card and sticks, before they both scroll away together */}
          <div 
            ref={visionWrapperRef}
            className="sticky top-8 md:top-12 z-20 w-full shadow-[0_-40px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_-40px_80px_rgba(0,0,0,0.6)] rounded-2xl md:rounded-3xl overflow-hidden bg-primary-50 dark:bg-primary-950 border border-primary-100 dark:border-primary-800 p-5 md:p-8 lg:p-12"
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 items-center">
              
              {/* Checkerboard Collage Content — identical layout to Mission (Left on Desktop) */}
              <div className="order-2 lg:order-1 relative w-full lg:max-w-none mx-auto aspect-square grid grid-cols-[2fr_1fr_1fr] grid-rows-3 gap-2 md:gap-4">

                {/* BIG Video — tall left column (col 1, row 1-2) — identical to Mission */}
                <div className="col-start-1 col-span-1 row-start-1 row-span-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  {/* Brand gradient overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-secondary-900/50 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {/* Corner slash inside video tile */}
                  <div
                    className="absolute bottom-0 right-0 w-[45%] h-[45%] pointer-events-none z-10 opacity-[0.18]"
                    style={{
                      clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                      background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                    }}
                  />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_7_tnh25f.jpg" alt="Vision campaign preview" fill sizes="(max-width: 768px) 50vw" className="object-cover md:hidden" />
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="absolute inset-0 md:block w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  >
                    <source src="https://res.cloudinary.com/dgoclgj0u/video/upload/v1782477449/Reel_1_Taste_Tales_v2_wp7aat.mp4" type="video/mp4" />
                  </video>
                </div>

                {/* Top Right — col 3, row 1 */}
                <div className="col-start-3 row-start-1 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_7_tnh25f.jpg" alt="Vision 1" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Center — col 2, row 2 */}
                <div className="col-start-2 row-start-2 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_6_rabmdp.jpg" alt="Vision 2" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Bottom Left — col 1, row 3 */}
                <div className="col-start-1 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_3_vyfqfg.jpg" alt="Vision 3" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

                {/* Bottom Right — col 3, row 3 */}
                <div className="col-start-3 row-start-3 relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-linear-to-tr from-secondary-900/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <Image src="https://res.cloudinary.com/dgoclgj0u/image/upload/v1782475040/WhatsApp_Image_2026-06-26_at_5.22.31_PM_4_dm8j8b.jpg" alt="Vision 4" fill sizes="(max-width: 768px) 33vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>

              </div>

              {/* Text Content (Right on Desktop, Top on Mobile) */}
              <div className="order-1 lg:order-2 flex flex-col items-start justify-center h-full">
                <div className="font-sans font-medium text-lg sm:text-xl lg:text-[2rem] leading-snug lg:leading-[1.3] uppercase tracking-tight text-balance">
                  <span className="inline-block text-secondary-600 dark:text-secondary-400 mb-2">
                    To become one of the most <strong className="font-black">trusted hospitality marketing partners</strong> by delivering <strong className="font-black">impactful digital experiences</strong>.
                  </span>
                  <br/>
                  <span className="inline-block text-gray-900 dark:text-white mt-4">
                    We envision helping brands transform their digital presence into <strong className="font-black">powerful business opportunities</strong> through <strong className="font-black">strategic execution</strong>.
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
