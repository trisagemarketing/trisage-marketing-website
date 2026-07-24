"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Gift, Sparkles, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Methodology", href: "/methodology" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Smart Scroll Engine
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldScrolled = latest > 25;
    if (shouldScrolled !== isScrolled) {
      setIsScrolled(shouldScrolled);
    }
  });

  // Handle interactive mouse position for liquid glass sheen
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navbarRef.current) return;
    const rect = navbarRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Floating Apple Liquid Glass Capsule Header Container */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-3 sm:top-4 lg:top-5 inset-x-0 z-50 mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] px-3 sm:px-6",
          isScrolled ? "max-w-6xl" : "max-w-7xl"
        )}
      >
        {/* Real Liquid Glass Outer Capsule Shell */}
        <div 
          ref={navbarRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredIndex(null);
          }}
          className={cn(
            "relative w-full rounded-full p-2 sm:p-2.5 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-500 transform-gpu overflow-hidden",
            "liquid-glass-capsule",
            isScrolled ? "py-2 sm:py-2" : "py-2.5 sm:py-3"
          )}
        >
          {/* Top Glass Rim Specular Highlight */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] glass-rim-sheen pointer-events-none rounded-full opacity-90" />

          {/* Bottom Glass Internal Reflection Rim */}
          <div className="absolute inset-x-12 bottom-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent pointer-events-none rounded-full" />

          {/* Dynamic Interactive Mouse Liquid Sheen Spot */}
          {isHovered && (
            <div 
              className="absolute -inset-px pointer-events-none transition-opacity duration-300 rounded-full"
              style={{
                background: `radial-gradient(140px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.35), transparent 80%)`,
              }}
            />
          )}

          {/* Logo Section */}
          <div className="flex-1 flex justify-start items-center pl-2 sm:pl-3">
            <Link 
              href="/" 
              className="relative z-50 flex items-center group cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {/* Subtle glass halo behind logo on hover */}
              <div className="absolute -inset-2 rounded-full bg-white/50 dark:bg-white/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Image
                src="/logo.svg"
                alt="Trisage Marketing"
                width={200}
                height={60}
                priority
                fetchPriority="high"
                loading="eager"
                className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
              />
            </Link>
          </div>

          {/* Desktop Navigation — Glassmorphism Linkbar Capsule */}
          <nav className="hidden lg:flex flex-none items-center gap-1 relative p-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner">
            {navLinks.map((link, index) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={(e) => {
                    if (pathname === link.href) {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={cn(
                    "relative px-4 py-2 text-xs xl:text-sm font-semibold transition-colors duration-200 rounded-full z-10 select-none flex items-center justify-center cursor-pointer",
                    isActive 
                      ? "text-white dark:text-white" 
                      : "text-gray-700 dark:text-gray-200 hover:text-gray-950 dark:hover:text-white"
                  )}
                >
                  {/* Active Elevated Glass Capsule Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="apple-active-pill"
                      className={cn(
                        "absolute inset-0 -z-10 rounded-full",
                        "bg-gradient-to-b from-primary-600 via-primary-600 to-primary-700 dark:from-white/25 dark:to-white/15",
                        "shadow-[0_4px_16px_rgba(37,99,235,0.35)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.18)]",
                        "border border-white/40 dark:border-white/25 backdrop-blur-md"
                      )} 
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}

                  {/* Hover Glass Highlight Pill */}
                  {hoveredIndex === index && !isActive && (
                    <motion.div 
                      layoutId="apple-hover-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-black/5 dark:bg-white/12 backdrop-blur-xs border border-black/5 dark:border-white/15 shadow-xs"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions (Theme Toggle & Tactile CTA) */}
          <div className="flex-1 flex justify-end items-center gap-2 sm:gap-3 pr-1 sm:pr-2 relative z-50">
            {/* Theme Toggle Container */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Mobile & Tablet CTA Button: Get Free Audit */}
            <button
              onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
              className="inline-flex lg:hidden shrink-0 items-center justify-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-extrabold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400 rounded-full shadow-md shadow-primary-600/25 active:scale-95 transition-all border border-white/20 cursor-pointer whitespace-nowrap"
              aria-label="Get Free Audit"
            >
              <Gift size={14} className="text-secondary-300 dark:text-secondary-200 animate-bounce shrink-0" />
              <span>Get Free Audit</span>
            </button>

            {/* Desktop Apple Liquid Glass CTA Button: Book Consultation */}
            <Link
              href="/contact"
              className={cn(
                "hidden lg:inline-flex shrink-0 whitespace-nowrap items-center justify-center gap-1.5 px-5 py-2.5 text-xs xl:text-sm font-bold text-white rounded-full transition-all duration-300 transform-gpu cursor-pointer",
                "apple-liquid-glass-btn hover:scale-[1.04] active:scale-[0.97]"
              )}
            >
              <Sparkles size={14} className="text-teal-200" />
              <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] font-black">Book Consultation</span>
              <ArrowUpRight size={15} className="opacity-90" />
            </Link>

            {/* Mobile Navigation Toggle */}
            <button
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-xs cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            navLinks={navLinks}
            pathname={pathname}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
