"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

interface MobileMenuProps {
  navLinks: { name: string; href: string }[];
  pathname: string;
  onClose: () => void;
}

// Framer Motion Variants for staggering children
const containerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05, // Cascades the links in one by one
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      staggerChildren: 0.03,
      staggerDirection: -1, // Animates them out in reverse
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: -20 },
};

export default function MobileMenu({ navLinks, pathname, onClose }: MobileMenuProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      // Upgraded to full-viewport scroll container with ThemeToggle and glassmorphism
      className="fixed inset-0 z-40 bg-white/98 dark:bg-[#050b14]/98 backdrop-blur-2xl pt-24 pb-8 px-5 sm:px-8 flex flex-col lg:hidden overflow-y-auto max-h-dvh will-change-transform transform-gpu"
    >
      {/* Top Header Controls bar inside Mobile Menu */}
      <motion.div variants={itemVariants} className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs uppercase tracking-widest font-extrabold text-gray-400 dark:text-gray-500">Navigation & Theme</span>
        <ThemeToggle />
      </motion.div>

      <nav className="flex flex-col gap-6 sm:gap-7 items-start justify-center flex-1 my-auto py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <motion.div key={link.name} variants={itemVariants} className="w-full">
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-center justify-between w-full py-1"
              >
                <span className={cn(
                  "text-3xl sm:text-4xl font-bold tracking-tight transition-all duration-300",
                  isActive 
                    ? "text-primary-600 dark:text-secondary-400 translate-x-1" 
                    : "text-gray-700 dark:text-gray-300 group-hover:text-gray-950 dark:group-hover:text-white group-hover:translate-x-1"
                )}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active-indicator"
                    className="w-2.5 h-2.5 rounded-full bg-primary-600 dark:bg-secondary-400 shadow-[0_0_12px_rgba(45,212,191,0.6)]"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Bottom CTA Section */}
      <motion.div 
        variants={itemVariants}
        className="mt-auto pt-6 flex flex-col items-center gap-3 w-full relative text-center"
      >
        {/* Centered Separator Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gray-200 dark:bg-gray-800" />
        
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Ready to scale your direct bookings?</p>
        
        {/* High-Converting Get Free Audit Button with Bouncing Gift Icon */}
        <button
          onClick={() => {
            onClose();
            window.dispatchEvent(new Event("openLeadModal"));
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400 rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-600/20 cursor-pointer"
        >
          <Gift size={18} className="text-secondary-300 dark:text-secondary-200 animate-bounce" />
          <span>Get Free Audit</span>
        </button>

        <Link
          href="/contact"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/90 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all"
        >
          Book Consultation
        </Link>
      </motion.div>
    </motion.div>
  );
}
