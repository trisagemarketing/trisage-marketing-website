"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/data/testimonials";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!containerRef.current || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const totalCards = cards.length;
    
    // Initial State: First card visible, rest hidden below viewport
    gsap.set(cards, {
      y: (i) => (i === 0 ? 0 : window.innerHeight + 200),
      scale: 1,
      opacity: (i) => (i === 0 ? 1 : 0),
      zIndex: (i) => i
    });

    const pinDuration = (containerRef.current?.offsetHeight || 400) * 1.0;
    gsap.set(spacerRef.current, { height: pinDuration });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 15%", // Pin when container reaches near top of screen
        // Reduced pin duration significantly to eliminate the huge empty gap below the section
        end: () => `+=${pinDuration}`,
        pin: true,
        pinSpacing: false, // Use native DOM spacer instead of GSAP pinSpacing to fix mobile gaps
        scrub: 1,
        invalidateOnRefresh: true, // Recalculate on window resize
      }
    });

    // First card entrance animation (happens as user scrolls down to the section, before pin)
    const firstCard = cards[0];
    if (firstCard) {
      gsap.fromTo(firstCard.querySelector('.avatar-anim'),
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 70%" } }
      );
      gsap.fromTo(firstCard.querySelectorAll('.stagger-elem'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 70%" } }
      );
    }

    // Layered Stacking Animation (Cinematic GSAP Deck)
    cards.forEach((card, index) => {
      if (index === 0) return; // Base card already in place

      // Next card slides up seamlessly
      tl.to(card, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power4.out", // Premium cinematic easing
      }, (index - 1) * 1.5);

      // Scrubbed subtle internal animations for Profile & Content
      tl.fromTo(card.querySelector('.avatar-anim'),
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
        (index - 1) * 1.5 + 0.3 // Trigger shortly after card starts moving
      );

      tl.fromTo(card.querySelectorAll('.stagger-elem'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" },
        (index - 1) * 1.5 + 0.4
      );

      // Previous cards recede into the background creating deep stacking effect
      for (let j = 0; j < index; j++) {
        tl.to(cards[j], {
          scale: 1 - ((index - j) * 0.05), // Scale down 5% per layer
          y: -((index - j) * 30), // Push upward slightly for physical stacking feel
          opacity: 1 - ((index - j) * 0.4), // Fade out
          duration: 1.5,
          ease: "power4.out",
        }, (index - 1) * 1.5);
      }
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative pt-24 pb-4 md:pb-12 bg-white dark:bg-[#050b14] overflow-hidden">
      {/* Background Planets/Stars logic (Hidden on Light Mode) */}
      <div className="absolute hidden dark:block right-[-10%] top-[10%] w-[120px] h-[120px] md:w-[320px] md:h-[320px] pointer-events-none z-0" style={{
        animation: "planetBounce 22s infinite",
        animationDelay: "-5s",
        transformStyle: "preserve-3d"
      }}>
        <div className="absolute top-1/2 left-1/2 w-[240%] h-[240%] pointer-events-none" style={{ transform: "translate(-50%, -50%) rotateZ(-25deg) rotateX(70deg)", transformStyle: "preserve-3d" }}>
          <div className="absolute inset-0 animate-[planetSpin_25s_linear_infinite]" style={{ transformStyle: "preserve-3d" }}>
            <div className="absolute inset-0 border-[4px] border-cyan-400/20 rounded-full" />
            <div className="absolute inset-4 border-[2px] border-dashed border-teal-300/30 rounded-full" />
            <div className="absolute inset-10 border-[1px] border-blue-500/40 rounded-full" />
          </div>
        </div>
        <div className="absolute inset-0 rounded-full" style={{
          transform: "translateZ(1px)",
          background: "radial-gradient(circle at 30% 30%, #67e8f9 0%, #0891b2 40%, #0f172a 100%)",
          boxShadow: "0 0 40px 10px rgba(6, 182, 212, 0.2), inset -20px -20px 40px rgba(0, 0, 0, 0.8)",
        }}>
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
             <div className="absolute w-[150%] h-[150%] top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%) rotate(-25deg)" }}>
                <div className="absolute top-0 left-0 h-full w-[200%] animate-[planetPan_30s_linear_infinite]">
                  <div className="absolute w-[50%] h-full left-0">
                    <div className="absolute w-full h-[20%] bg-teal-900/40 top-[20%] filter blur-[3px]" />
                    <div className="absolute w-full h-[15%] bg-cyan-200/10 top-[60%] filter blur-[2px]" />
                  </div>
                  <div className="absolute w-[50%] h-full left-[50%]">
                    <div className="absolute w-full h-[20%] bg-teal-900/40 top-[20%] filter blur-[3px]" />
                    <div className="absolute w-full h-[15%] bg-cyan-200/10 top-[60%] filter blur-[2px]" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-[1200px]">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16 lg:mb-20">
          <h2 className="text-[8vw] sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 uppercase tracking-tight flex flex-wrap justify-center gap-2">
            <span className="text-primary-950 dark:text-white">Client Success </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 dark:from-primary-400 dark:to-secondary-400">Stories</span>
          </h2>
          <p className="font-sans font-medium text-lg sm:text-xl lg:text-3xl leading-snug lg:leading-[1.3] uppercase tracking-tight text-balance text-primary-700 dark:text-primary-200">
            Don't just take our word for it. Here's what our <strong className="font-black">partners</strong> have to say about working with <strong className="font-black text-primary-950 dark:text-white">Trisage</strong>.
          </p>
        </div>

        {/* Stacked Cards Container - CSS Grid implicitly sets dynamic height based on tallest card */}
        <div 
          ref={containerRef}
          className="relative grid grid-cols-1 w-full mx-auto" 
          style={{ gridTemplateRows: "1fr", gridTemplateColumns: "1fr" }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="col-start-1 row-start-1 w-full will-change-transform transform-style-3d"
            >
              {/* Full Width Premium Card */}
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 bg-white dark:bg-primary-950 rounded-3xl lg:rounded-[2.5rem] p-5 sm:p-6 md:p-10 lg:p-12 border-2 border-primary-100 dark:border-primary-800 shadow-[0_20px_60px_rgba(45,65,100,0.08)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden relative group">

                {/* ── IDEA 1: Dual Mesh Orbs ── */}
                {/* Primary orb — top-left, drifts slowly */}
                <div
                  className="absolute -top-1/4 -left-[5%] w-[55%] h-[140%] rounded-full pointer-events-none animate-[pulse_8s_ease-in-out_infinite] will-change-opacity transform-gpu"
                  style={{ background: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)" }}
                />
                {/* Secondary orb — bottom-right, drifts with delay */}
                <div
                  className="absolute -bottom-1/4 -right-[5%] w-[50%] h-[130%] rounded-full pointer-events-none animate-[pulse_10s_ease-in-out_infinite_reverse] will-change-opacity transform-gpu"
                  style={{ background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)" }}
                />

                {/* ── IDEA 3: Geometric Corner Slash ── */}
                {/* Hard-edged triangle floods bottom-right corner */}
                <div
                  className="absolute bottom-0 right-0 w-[45%] h-[60%] pointer-events-none opacity-[0.07] dark:opacity-[0.12] transition-opacity duration-700 group-hover:opacity-[0.14] dark:group-hover:opacity-[0.20]"
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  }}
                />
                {/* Thinner accent slash layered on top — secondary color */}
                <div
                  className="absolute bottom-0 right-0 w-[28%] h-[45%] pointer-events-none opacity-[0.12] dark:opacity-[0.18] transition-opacity duration-700 group-hover:opacity-[0.22] dark:group-hover:opacity-[0.30]"
                  style={{
                    clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
                    background: "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                  }}
                />

                {/* Left Side: Avatar & Identity */}
                <div className="flex-shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/3 relative z-10">
                  <div className="avatar-anim relative w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 mb-4 lg:mb-6 rounded-full overflow-hidden border-[3px] lg:border-[4px] border-white dark:border-primary-800 shadow-2xl transition-transform duration-700 group-hover:scale-105 ring-4 ring-primary-100 dark:ring-primary-900">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random&color=fff&size=400`}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      loading="lazy"
                      unoptimized
                    />
                  </div>
                  <h3 className="stagger-elem text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 dark:from-white dark:via-primary-100 dark:to-primary-400 drop-shadow-sm">{testimonial.name}</h3>
                  <p className="stagger-elem font-bold uppercase tracking-widest text-[10px] sm:text-xs lg:text-sm mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-primary-500 dark:from-secondary-400 dark:to-primary-300">{testimonial.company}</p>
                </div>

                {/* Right Side: Rating & Quote */}
                <div className="flex-grow flex flex-col justify-center relative z-10">

                  
                  {/* Rating Badge */}
                  <div className="stagger-elem flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-primary-50 to-white dark:from-primary-900/80 dark:to-primary-950 border border-primary-200 dark:border-primary-800 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 w-max mb-4 lg:mb-8 shadow-[0_8px_20px_rgba(6,182,212,0.08)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                    <div className="flex gap-1 text-yellow-500 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
                      ))}
                    </div>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-950 to-primary-700 dark:from-white dark:to-primary-300 text-[10px] sm:text-sm tracking-widest uppercase border-l border-primary-200 dark:border-primary-700 pl-2 sm:pl-3">
                      5.0 Rating
                    </span>
                  </div>

                  {/* MissionVision-style Two-Tone Quote */}
                  <div className="stagger-elem font-sans text-lg sm:text-xl lg:text-[1.6rem] leading-snug lg:leading-[1.35] font-medium uppercase tracking-tight text-balance">
                    {/* Part 1 — primary accent color */}
                    <span className="text-primary-600 dark:text-primary-400">
                      {testimonial.reviewPart1}{" "}
                      <strong className="font-black">{testimonial.reviewHighlight1}</strong>{" "}
                    </span>
                    {/* Part 2 — secondary accent color + base */}
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {testimonial.reviewPart2}{" "}
                      <strong className="font-black text-primary-950 dark:text-white">{testimonial.reviewHighlight2}</strong>{" "}
                    </span>
                    {/* Part 3 — base text with final powerful highlight */}
                    <span className="text-gray-800 dark:text-gray-200">
                      {testimonial.reviewPart3}{" "}
                      <strong className="font-black text-primary-600 dark:text-primary-400">{testimonial.reviewHighlight3}</strong>
                    </span>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
        {/* DYNAMIC SPACER: Replaces GSAP pinSpacing to perfectly eliminate overlap without leaving massive gaps */}
        <div ref={spacerRef} className="w-full pointer-events-none" />
      </div>
    </section>
  );
}
