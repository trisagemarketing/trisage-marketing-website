"use client";

import { useEffect, useState } from "react";
import {
  Hotel, MapPin, Wine, ChefHat, Globe,
  Compass, Palmtree, Plane, Sparkles, MountainSnow,
} from "lucide-react";

/**
 * PERFORMANCE ARCHITECTURE:
 * ─ Removed `contain: strict`  (breaks fixed stacking context)
 * ─ Removed ALL boxShadow on animated elements (causes repaint on scale)
 * ─ Removed `willChange` on individual elements (VRAM overflow on low-end)
 * ─ Single `willChange: transform` on the ROOT container only
 * ─ Blob blur reduced: 80px → 50px (cheaper rasterization)
 * ─ Blobs reduced: 4 → 3 per mode
 * ─ Icons reduced: 12 → 8 (SVG render cost)
 * ─ Dots reduced: 15 → 8 per mode
 * ─ Bokeh reduced: 6 → 3 (each had blur(24px) + CSS animation)
 * ─ All animations: opacity + transform only (compositor-safe properties)
 */

// 8 icons max — enough atmosphere, minimal SVG overhead
const ICONS = [
  { Icon: Hotel,       x: "8%",  y: "7%",  size: 24, delay: "0s",   dur: "9s",  color: "#008080" },
  { Icon: MapPin,      x: "88%", y: "10%", size: 20, delay: "1.4s", dur: "10s", color: "#B45309" },
  { Icon: Wine,        x: "5%",  y: "42%", size: 20, delay: "0.6s", dur: "8s",  color: "#2D4164" },
  { Icon: ChefHat,     x: "78%", y: "45%", size: 18, delay: "2.1s", dur: "11s", color: "#008080" },
  { Icon: Globe,       x: "38%", y: "14%", size: 20, delay: "1.8s", dur: "10s", color: "#B45309" },
  { Icon: Compass,     x: "91%", y: "60%", size: 22, delay: "0.3s", dur: "9s",  color: "#2D4164" },
  { Icon: Plane,       x: "25%", y: "72%", size: 22, delay: "2.7s", dur: "12s", color: "#008080" },
  { Icon: MountainSnow,x: "60%", y: "85%", size: 20, delay: "1.0s", dur: "8s",  color: "#B45309" },
];

// 8 sparkle dots — no boxShadow, no blur, just radial-gradient + opacity animation
const DARK_DOTS = [
  { x:"7%",  y:"11%", s:3, d:"0s",   t:"7s"  },
  { x:"33%", y:"7%",  s:2, d:"1.2s", t:"9s"  },
  { x:"65%", y:"5%",  s:3, d:"0.6s", t:"6s"  },
  { x:"91%", y:"22%", s:2, d:"2.0s", t:"8s"  },
  { x:"12%", y:"55%", s:3, d:"0.9s", t:"7s"  },
  { x:"75%", y:"60%", s:2, d:"1.7s", t:"9s"  },
  { x:"44%", y:"82%", s:3, d:"3.0s", t:"6s"  },
  { x:"88%", y:"88%", s:2, d:"1.4s", t:"8s"  },
];

const LIGHT_DOTS = [
  { x:"8%",  y:"9%",  s:4, d:"0s",   t:"7s",  amber:true  },
  { x:"38%", y:"6%",  s:5, d:"0.5s", t:"9s",  amber:false },
  { x:"72%", y:"4%",  s:4, d:"1.1s", t:"6s",  amber:true  },
  { x:"93%", y:"28%", s:3, d:"2.0s", t:"8s",  amber:false },
  { x:"10%", y:"55%", s:4, d:"0.8s", t:"7s",  amber:true  },
  { x:"80%", y:"62%", s:3, d:"1.6s", t:"9s",  amber:false },
  { x:"48%", y:"80%", s:5, d:"3.2s", t:"6s",  amber:true  },
  { x:"22%", y:"90%", s:3, d:"1.3s", t:"8s",  amber:false },
];

export default function HomeBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      // Single willChange on the root only — not on every child
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      {/* ══════════════════════════════════
          DARK MODE (Pure CSS toggle, zero React re-render)
          ══════════════════════════════════ */}
      <div className="absolute inset-0 hidden dark:block pointer-events-none">
        
        {/* NASA-style Starry Background (Zero DOM overhead via CSS patterns) */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1.5px 1.5px at 75px 85px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 150px 120px, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 220px 250px, rgba(255,255,255,0.8), transparent)
          `,
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
          opacity: 0.6,
        }} />

        {/* Ultra-realistic glowing CSS Moon */}
        <div className="absolute rounded-full w-[80px] h-[80px] md:w-[220px] md:h-[220px]" style={{
          right: "12%", top: "10%",
          background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #e2e8f0 40%, #94a3b8 100%)",
          boxShadow: "0 0 40px 15px rgba(255, 255, 255, 0.15), inset -15px -15px 30px rgba(0, 0, 0, 0.4)",
          animation: "iconFloat 15s ease-in-out infinite"
        }}>
          {/* Moon Craters */}
          <div className="absolute rounded-full bg-slate-800/20" style={{ left: "20%", top: "35%", width: "18%", height: "18%", filter: "blur(2px)" }} />
          <div className="absolute rounded-full bg-slate-800/15" style={{ left: "55%", top: "60%", width: "25%", height: "25%", filter: "blur(3px)" }} />
          <div className="absolute rounded-full bg-slate-800/20" style={{ left: "65%", top: "25%", width: "12%", height: "12%", filter: "blur(1px)" }} />
        </div>

        {/* Mars */}
        <div className="absolute rounded-full w-[35px] h-[35px] md:w-[80px] md:h-[80px]" style={{
          left: "18%", top: "22%",
          background: "radial-gradient(circle at 30% 30%, #fca5a5 0%, #ef4444 50%, #7f1d1d 100%)",
          boxShadow: "inset -8px -8px 15px rgba(0, 0, 0, 0.6)",
          animation: "iconFloat 18s ease-in-out infinite"
        }}>
          <div className="absolute rounded-full bg-red-950/30" style={{ left: "30%", top: "40%", width: "25%", height: "25%", filter: "blur(1px)" }} />
          <div className="absolute rounded-full bg-red-950/30" style={{ left: "60%", top: "20%", width: "15%", height: "15%", filter: "blur(1px)" }} />
        </div>

        {/* Jupiter */}
        <div className="absolute rounded-full w-[60px] h-[60px] md:w-[160px] md:h-[160px]" style={{
          left: "65%", bottom: "15%",
          background: "linear-gradient(160deg, #fde68a 0%, #d97706 30%, #fcd34d 50%, #b45309 70%, #78350f 100%)",
          boxShadow: "0 0 20px rgba(217, 119, 6, 0.1), inset -15px -15px 30px rgba(0, 0, 0, 0.6)",
          animation: "iconFloat 22s ease-in-out infinite"
        }}>
           <div className="absolute rounded-full bg-orange-900/40" style={{ left: "50%", top: "60%", width: "30%", height: "15%", filter: "blur(2px)", transform: "rotate(-10deg)" }} />
        </div>

        {/* Icy Moon (Left Side) */}
        <div className="absolute rounded-full w-[45px] h-[45px] md:w-[110px] md:h-[110px]" style={{
          left: "8%", top: "45%",
          background: "radial-gradient(circle at 35% 35%, #e0f2fe 0%, #bae6fd 40%, #0369a1 100%)",
          boxShadow: "0 0 20px 5px rgba(186, 230, 253, 0.1), inset -10px -10px 20px rgba(0, 0, 0, 0.5)",
          animation: "iconFloat 20s ease-in-out infinite"
        }}>
          {/* Ice fissures/craters */}
          <div className="absolute rounded-full bg-cyan-900/20" style={{ left: "40%", top: "30%", width: "15%", height: "15%", filter: "blur(1px)" }} />
          <div className="absolute rounded-full bg-cyan-900/15" style={{ left: "20%", top: "60%", width: "25%", height: "20%", filter: "blur(1.5px)" }} />
        </div>

        {/* Shooting Stars / Comets */}
        <div className="absolute top-[10%] left-[0%] rotate-[35deg] opacity-0 animate-[cometFly_12s_2s_infinite_linear]">
          <div className="h-[2px] w-[150px] bg-gradient-to-r from-transparent to-white rounded-full drop-shadow-[0_0_4px_#fff]" />
        </div>
        <div className="absolute top-[30%] left-[-10%] rotate-[40deg] opacity-0 animate-[cometFly_18s_8s_infinite_linear]">
          <div className="h-[2px] w-[100px] bg-gradient-to-r from-transparent to-teal-300 rounded-full drop-shadow-[0_0_4px_#5eead4]" />
        </div>
        <div className="absolute top-[-5%] left-[40%] rotate-[30deg] opacity-0 animate-[cometFly_25s_14s_infinite_linear]">
          <div className="h-[3px] w-[200px] bg-gradient-to-r from-transparent to-white rounded-full drop-shadow-[0_0_6px_#fff]" />
        </div>

        {/* 3 blobs — zero GPU filter, pure paint */}
        <div className="absolute inset-0">
          <div className="absolute rounded-full animate-blob" style={{
            left:"-5%", top:"-5%", width:"52vw", height:"52vw",
            background:"radial-gradient(circle, rgba(73,108,144,0.20) 0%, transparent 60%)",
            animationDelay:"0s"
          }} />
          <div className="absolute rounded-full animate-blob" style={{
            left:"58%", top:"4%", width:"40vw", height:"40vw",
            background:"radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 60%)",
            animationDelay:"2s"
          }} />
          <div className="absolute rounded-full animate-blob" style={{
            left:"10%", top:"55%", width:"44vw", height:"44vw",
            background:"radial-gradient(circle, rgba(73,108,144,0.12) 0%, transparent 60%)",
            animationDelay:"3.5s"
          }} />
        </div>

        {/* 8 constellation dots — NO boxShadow, NO blur, just radial-gradient */}
        {DARK_DOTS.map((dot, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left:dot.x, top:dot.y, width:dot.s, height:dot.s,
            background: i%3===0
              ? `radial-gradient(circle, rgba(94,234,212,0.95) 0%, transparent 100%)`
              : i%3===1
                ? `radial-gradient(circle, rgba(156,177,199,0.85) 0%, transparent 100%)`
                : `radial-gradient(circle, rgba(255,255,255,0.75) 0%, transparent 100%)`,
            animation:`bokehPulse ${dot.t} ${dot.d} ease-in-out infinite`,
          }} />
        ))}

        {/* 8 floating icons */}
        {ICONS.map(({ Icon, x, y, size, delay, dur }, i) => (
          <div key={i} className="absolute" style={{
            left:x, top:y,
            animation:`iconFloat ${dur} ${delay} ease-in-out infinite`,
          }}>
            <Icon style={{ width:size, height:size, color:"rgba(156,177,199,0.20)" }} strokeWidth={1.1} />
          </div>
        ))}

        {/* Edge vignette — static, zero animation cost */}
        <div className="absolute inset-0" style={{
          background:"radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(5,11,20,0.55) 100%)"
        }} />
      </div>

      {/* ══════════════════════════════════
          LIGHT MODE (Pure CSS toggle, zero React re-render)
          ══════════════════════════════════ */}
      <div className="absolute inset-0 block dark:hidden pointer-events-none">
        {/* Warm base gradient — static, zero cost */}
        <div className="absolute inset-0" style={{
          background:"linear-gradient(135deg, rgba(254,243,199,0.65) 0%, rgba(255,252,248,0.4) 50%, rgba(240,253,250,0.55) 100%)"
        }} />

        {/* Static sunlight rays — no animation, zero CPU */}
        <div className="absolute inset-0" style={{
          background:`conic-gradient(from 195deg at 105% -5%,
            transparent 0deg, rgba(251,191,36,0.06) 10deg,
            transparent 20deg, rgba(251,191,36,0.04) 32deg,
            transparent 44deg)`
        }} />

        {/* Shooting Stars / Golden Daytime Flares */}
        <div className="absolute top-[10%] left-[0%] rotate-[35deg] opacity-0 animate-[cometFly_12s_2s_infinite_linear]">
          <div className="h-[2px] w-[150px] bg-gradient-to-r from-transparent to-amber-300 rounded-full drop-shadow-[0_0_4px_#fcd34d]" />
        </div>
        <div className="absolute top-[30%] left-[-10%] rotate-[40deg] opacity-0 animate-[cometFly_18s_8s_infinite_linear]">
          <div className="h-[2px] w-[100px] bg-gradient-to-r from-transparent to-teal-400 rounded-full drop-shadow-[0_0_4px_#2dd4bf]" />
        </div>
        <div className="absolute top-[-5%] left-[40%] rotate-[30deg] opacity-0 animate-[cometFly_25s_14s_infinite_linear]">
          <div className="h-[3px] w-[200px] bg-gradient-to-r from-transparent to-amber-200 rounded-full drop-shadow-[0_0_6px_#fde68a]" />
        </div>

        {/* 3 bokeh orbs — zero GPU filter, pure paint */}
        <div className="absolute rounded-full" style={{
          left:"10%", top:"5%", width:110, height:110,
          background:"radial-gradient(circle, rgba(251,191,36,0.28) 0%, transparent 60%)",
          animation:"bokehPulse 6s 0s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          left:"82%", top:"35%", width:85, height:85,
          background:"radial-gradient(circle, rgba(20,184,166,0.20) 0%, transparent 60%)",
          animation:"bokehPulse 7.5s 1.5s ease-in-out infinite",
        }} />
        <div className="absolute rounded-full" style={{
          left:"30%", top:"72%", width:95, height:95,
          background:"radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 60%)",
          animation:"bokehPulse 5.5s 2.8s ease-in-out infinite",
        }} />

        {/* 8 sparkle dots — NO boxShadow, NO blur */}
        {LIGHT_DOTS.map((dot, i) => (
          <div key={i} className="absolute rounded-full" style={{
            left:dot.x, top:dot.y, width:dot.s, height:dot.s,
            background: dot.amber
              ? `radial-gradient(circle, rgba(217,119,6,0.95) 0%, transparent 100%)`
              : `radial-gradient(circle, rgba(20,184,166,0.85) 0%, transparent 100%)`,
            animation:`bokehPulse ${dot.t} ${dot.d} ease-in-out infinite`,
          }} />
        ))}

        {/* 8 floating icons */}
        {ICONS.map(({ Icon, x, y, size, delay, dur, color }, i) => (
          <div key={i} className="absolute" style={{
            left:x, top:y,
            animation:`iconFloat ${dur} ${delay} ease-in-out infinite`,
          }}>
            <Icon style={{ width:size, height:size, color, opacity:0.20 }} strokeWidth={1.3} />
          </div>
        ))}

        {/* Soft vignette — static */}
        <div className="absolute inset-0" style={{
          background:"radial-gradient(ellipse 65% 55% at 50% 45%, transparent 25%, rgba(254,252,248,0.50) 100%)"
        }} />
      </div>
    </div>
  );
}
