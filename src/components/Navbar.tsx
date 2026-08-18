"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Gift, Sparkles, ArrowUpRight, User } from "lucide-react";
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

  // Handle interactive mouse position for liquid glass sheen (Zero React Re-renders, optimized with rAF)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navbarRef.current) return;
    
    // Murphy's Law: Never use offsetX/Y on a parent container with children, 
    // because hovering children will return coordinates relative to the child, causing extreme jumping.
    // Always use clientX/Y relative to the parent's bounding box.
    const rect = navbarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    requestAnimationFrame(() => {
      if (navbarRef.current) {
        navbarRef.current.style.setProperty("--mouse-x", `${x}px`);
        navbarRef.current.style.setProperty("--mouse-y", `${y}px`);
      }
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
          onMouseLeave={() => setIsHovered(false)}
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

          {/* Dynamic Interactive Mouse Liquid Sheen Spot (CSS Custom Property Driven) */}
          {isHovered && (
            <div 
              className="absolute -inset-px pointer-events-none transition-opacity duration-300 rounded-full"
              style={{
                background: `radial-gradient(140px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.35), transparent 80%)`,
              }}
            />
          )}

          {/* Logo Section */}
          <div className="flex justify-start items-center pl-1 sm:pl-3 z-50">
            <Link 
              href="/" 
              className="relative z-50 flex items-center group cursor-pointer shrink-0"
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
                className="h-7 sm:h-8 md:h-10 lg:h-11 w-auto shrink-0 transition-transform duration-300 group-hover:scale-105 mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
              />
            </Link>
          </div>

          {/* Desktop Navigation — Perfectly Centered Absolute Container */}
          <div className="absolute left-[48%] top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex items-center gap-4 z-40">
            <nav 
              onMouseLeave={() => setHoveredIndex(null)}
              className="flex flex-none items-center gap-1 relative p-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 shadow-inner"
            >
              {navLinks.map((link, index) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    "relative px-4 py-2 text-xs xl:text-sm font-semibold rounded-full transition-colors duration-200 z-10 flex items-center justify-center whitespace-nowrap tracking-tight",
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
            
            {/* Theme Toggle Container - Grouped with Nav for perfect symmetry */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Right Actions (Tactile CTA) */}
          <div className="flex justify-end items-center gap-1.5 sm:gap-3 pr-0.5 sm:pr-2 relative z-50">
            {/* Mobile & Tablet CTA Button: Get Free Audit */}
            <button
              onClick={() => window.dispatchEvent(new Event("openLeadModal"))}
              className="inline-flex lg:hidden shrink-0 items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs font-extrabold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400 rounded-full shadow-md shadow-primary-600/25 active:scale-95 transition-all border border-white/20 cursor-pointer whitespace-nowrap"
              aria-label="Get Free Audit"
            >
              <Gift size={13} className="text-secondary-300 dark:text-secondary-200 animate-bounce shrink-0 hidden xs:inline-block" />
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
              className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-xs cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
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
