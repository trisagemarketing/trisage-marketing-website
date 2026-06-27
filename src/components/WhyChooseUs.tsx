"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { 
    id: 1, 
    label: "Clients", 
    value: 100, 
    suffix: "+",
    bgClass: "bg-gradient-to-br from-primary-800/80 to-primary-900/90 border-primary-600/30"
  },
  { 
    id: 2, 
    label: "Projects", 
    value: 250, 
    suffix: "+",
    bgClass: "bg-gradient-to-bl from-secondary-900/70 to-primary-900/90 border-secondary-700/30"
  },
  { 
    id: 3, 
    label: "Client Satisfaction", 
    value: 95, 
    suffix: "%",
    bgClass: "bg-gradient-to-tr from-primary-700/60 via-primary-800/80 to-secondary-900/80 border-primary-500/20"
  },
];

const SplitChars = ({ text }: { text: string }) => {
  const words = text.split(" ");
  let isBoldContext = false;

  return (
    <>
      {words.map((word, wordIndex) => {
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
          <span key={wordIndex} className="inline-block mr-[0.25em] whitespace-nowrap">
            {cleanWord.split("").map((char, charIndex) => (
              <span 
                key={charIndex} 
                className={`inline-block char-drop ${shouldBeBold ? 'font-black text-secondary-300' : 'font-medium'}`}
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
};

function AnimatedCounter({ value, suffix, animate }: { value: number; suffix: string; animate: boolean }) {
  const [count, setCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Murphy's Law guard: clear any running timer before starting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    if (!animate) {
      setCount(0);
      return;
    }

    // Respect prefers-reduced-motion — snap to final value instantly
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setCount(value);
      return;
    }

    let start = 0;
    const duration = 1800;
    const fps = 60;
    const totalFrames = (duration / 1000) * fps;
    const increment = value / totalFrames;

    timerRef.current = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / fps);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [animate, value]);

  return (
    <div className="text-5xl md:text-7xl font-bold text-white mb-2 tabular-nums">
      {count}{suffix}
    </div>
  );
}

export default function WhyChooseUs() {
  const containerRef      = useRef<HTMLDivElement>(null);
  const headingRef        = useRef<HTMLHeadingElement>(null);
  const paraRef           = useRef<HTMLParagraphElement>(null);
  const listRef           = useRef<HTMLUListElement>(null);
  const lineRef           = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Tracks whether each stat card is "in view" so AnimatedCounter knows when to fire
  const [animatedCards, setAnimatedCards] = useState<boolean[]>([false, false, false]);

  useGSAP(() => {
    if (!headingRef.current) return;
    
    // 3D Magnetic Word Reveal (Optimized for 60fps)
    gsap.fromTo(
      headingRef.current.querySelectorAll('.heading-word'),
      {
        y: 50,
        opacity: 0,
        rotateX: -60,
        willChange: "transform, opacity",
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out", // Smoother for scrubbing
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 95%", // Start as soon as it enters the bottom of the screen
          end: "top 50%", // Finish exactly when it reaches the middle of the screen
          scrub: 1.5, // 1.5 second smoothing effect ties the animation perfectly to the scroll wheel!
        }
      }
    );

    if (!paraRef.current) return;

    // Character Drop from Sky Animation (Optimized)
    gsap.fromTo(
      paraRef.current.querySelectorAll('.char-drop'),
      {
        y: -150,
        opacity: 0,
        scale: 1.2,
        willChange: "transform, opacity",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: paraRef.current,
          start: "top 95%",
          end: "top 65%",
          scrub: 1.5,
        }
      }
    );

    if (!listRef.current) return;

    // List Timeline Animation (Bouncing Line + Staggered Items)
    const listTl = gsap.timeline({
      scrollTrigger: {
        trigger: listRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse", // Play when scrolling down, reverse on scroll up
      }
    });

    // 1. Draw the vertical connecting line with a spring bounce
    listTl.fromTo(
      lineRef.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 1, ease: "back.out(1.5)", transformOrigin: "top" }
    );

    // 2. Pop the checkmarks in
    listTl.fromTo(
      listRef.current.querySelectorAll('.list-icon'),
      { scale: 0, rotation: -90 },
      { scale: 1, rotation: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)" },
      "-=0.7" // Start slightly after the line starts drawing
    );

    // 3. Slide in the text
    listTl.fromTo(
      listRef.current.querySelectorAll('.list-text'),
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" },
      "-=0.7"
    );

    if (!cardsContainerRef.current) return;

    const cards = cardsContainerRef.current.querySelectorAll<HTMLElement>('.stat-card');
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── QUANTUM BOUNCE ENTRY ─────────────────────────────────────────────────
    // Phase 1: Cards launch from below with elastic overshoot
    gsap.fromTo(
      cards,
      {
        y: 100,
        opacity: 0,
        scale: 0.85,
        rotateX: -20,
        willChange: "transform, opacity",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: prefersReduced ? 0 : 1.1,
        stagger: {
          each: 0.18,           // cascade delay between cards
          ease: "power1.inOut", // smoothly space the waterfall
        },
        ease: "elastic.out(1, 0.55)", // signature quantum elastic bounce
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: "top 88%",
          toggleActions: "play none none reset", // re-bounces every time section enters
          onEnter: () => setAnimatedCards([true, true, true]),   // fire counters
          onLeaveBack: () => setAnimatedCards([false, false, false]), // reset counters on scroll back
        },
      }
    );

    // Phase 2: Staggered number suffix "pop" bounce after cards land
    gsap.fromTo(
      cardsContainerRef.current.querySelectorAll('.stat-suffix'),
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: prefersReduced ? 0 : 0.7,
        stagger: 0.2,
        ease: "back.out(3.5)",  // hard snap with pronounced overshoot
        scrollTrigger: {
          trigger: cardsContainerRef.current,
          start: "top 80%",
          toggleActions: "play none none reset",
        },
      }
    );

    // Phase 3: Hover micro-bounce (Murphy's Law: guard against cards that unmount)
    cards.forEach((card) => {
      let hoverTween: gsap.core.Tween | null = null;

      const onEnter = () => {
        if (hoverTween) hoverTween.kill();
        hoverTween = gsap.to(card, {
          y: -10,
          scale: 1.03,
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
          duration: 0.35,
          ease: "back.out(2.5)",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        if (hoverTween) hoverTween.kill();
        hoverTween = gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
          duration: 0.5,
          ease: "elastic.out(1, 0.6)", // spring back to rest
          overwrite: "auto",
        });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);

      // Murphy's Law cleanup — remove listeners when GSAP context cleans up
      return () => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
        hoverTween?.kill();
      };
    });

  }, { scope: containerRef });

  return (
    <section id="why-choose-us" ref={containerRef} className="py-12 md:py-16 bg-primary-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 ref={headingRef} className="text-3xl md:text-5xl font-bold mb-6 [perspective:1000px]">
              <span className="inline-block text-primary-300">
                {"Why leading brands ".split(" ").map((word, i) => (
                  <span key={`w1-${i}`} className="inline-block mr-[0.25em] heading-word origin-bottom">{word}</span>
                ))}
              </span>
              <span className="inline-block text-secondary-400 mt-2 md:mt-0">
                {"choose Trisage".split(" ").map((word, i) => (
                  <span key={`w2-${i}`} className="inline-block mr-[0.25em] heading-word origin-bottom">{word}</span>
                ))}
              </span>
            </h2>
            <p ref={paraRef} className="text-primary-100 text-lg leading-relaxed mb-8">
              <SplitChars text="We don't guess. We **test, measure, and optimize**. Our **data-driven approach** ensures every marketing dollar you spend is an investment towards **scalable growth**. We pride ourselves on **transparency**, **relentless execution**, and delivering **measurable ROI**." />
            </p>
            <div className="relative pl-4 mt-6">
              {/* Connecting vertical line */}
              <div 
                ref={lineRef} 
                className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary-400/50 via-secondary-400/50 to-transparent" 
              />
              
              <ul ref={listRef} className="space-y-6 relative">
                {[
                  "**Data-driven strategies** tailored to your goals",
                  "**Transparent reporting** and real-time analytics",
                  "**Award-winning design** and development team",
                  "**Proven track record** across multiple industries"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-4 text-primary-50 relative z-10">
                    <div className="list-icon shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 shadow-[0_0_15px_rgba(45,212,191,0.4)] flex items-center justify-center text-white">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="list-text text-lg">
                      <SplitChars text={item} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div ref={cardsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-8 [perspective:1000px]">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`stat-card p-8 rounded-2xl border backdrop-blur-md shadow-[0_15px_40px_rgba(0,0,0,0.4)] ${stat.bgClass} ${
                  index === 2 ? "sm:col-span-2 text-center" : ""
                }`}
              >
                {/* Number + suffix split so suffix can pop independently */}
                <div className="text-5xl md:text-7xl font-bold text-white mb-2 tabular-nums flex items-end gap-1 justify-start" style={index === 2 ? { justifyContent: 'center' } : {}}>
                  <AnimatedCounter value={stat.value} suffix="" animate={animatedCards[index]} />
                  <span className="stat-suffix inline-block text-secondary-300" style={{ lineHeight: 1.1 }}>{stat.suffix}</span>
                </div>
                <p className="text-primary-200 font-medium uppercase tracking-widest text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
