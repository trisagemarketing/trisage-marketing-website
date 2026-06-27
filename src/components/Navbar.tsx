"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
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
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  // Smart Scroll Engine
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldScrolled = latest > 20;

    if (shouldScrolled !== isScrolled) {
      setIsScrolled(shouldScrolled);
    }
  });

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-4",
          isScrolled || pathname === "/about" || pathname === "/methodology"
            // Apple Glassmorphism: Heavy blur, sheer background, subtle bottom border
            ? "bg-white/70 dark:bg-[#1d1d1f]/70 backdrop-blur-xl saturate-150 border-b border-black/5 dark:border-white/10"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between gap-4 relative">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link 
              href="/" 
              className="relative z-50 flex items-center"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
            <Image
              src="/logo.svg"
              alt="Trisage Marketing"
              width={200}
              height={60}
              priority
              fetchPriority="high"
              loading="eager"
              className="h-10 md:h-12 lg:h-14 w-auto transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180 transform-gpu will-change-[transform,filter]"
            />
          </Link>
          </div>

          {/* Desktop Navigation - Glassmorphism Linkbar */}
          <nav className="hidden lg:flex flex-none items-center gap-1 bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full p-1 shadow-inner">
            {navLinks.map((link) => {
              const isActive = link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);
                
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm transition-colors rounded-full z-10",
                    isActive 
                      ? "text-white font-semibold" 
                      : "text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary-600 dark:bg-gray-700 shadow-sm border border-black/5 dark:border-white/10 -z-10 rounded-full" 
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions & Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-5 md:gap-6 relative z-50">
            <ThemeToggle />
            
            <Link
              href="/contact"
              className="hidden md:inline-flex shrink-0 whitespace-nowrap items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full transition-all hover:scale-105 shadow-md"
            >
              Book Consultation
            </Link>

            <button
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
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
