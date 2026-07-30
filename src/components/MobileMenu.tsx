"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Gift } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  navLinks: { name: string; href: string }[];
  pathname: string;
  onClose: () => void;
}

// Hardware-accelerated Apple cubic-bezier curves for silky 60/120 FPS open & close
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.03,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.1, ease: "easeOut" } 
  },
};

export default function MobileMenu({ navLinks, pathname, onClose }: MobileMenuProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      // Senior Web Dev Polish: Hardware-composited fixed overlay with instant touch response
      className="fixed inset-0 z-40 bg-white/98 dark:bg-[#050b14]/98 backdrop-blur-xl pt-20 pb-16 px-6 sm:px-10 flex flex-col lg:hidden overflow-y-auto max-h-dvh transform-gpu"
    >
      {/* ── Navigation Links Block (Proportional spacing & sizing) ── */}
      <nav className="flex flex-col gap-4 sm:gap-5 items-start justify-start pt-2 pb-4 w-full">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <motion.div key={link.name} variants={itemVariants} className="w-full">
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-center justify-between w-full py-1.5"
              >
                <span className={cn(
                  "text-3xl sm:text-4xl font-extrabold uppercase tracking-tight transition-all duration-300",
                  isActive 
                    ? "text-primary-600 dark:text-secondary-400 translate-x-1.5" 
                    : "text-gray-800 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-white group-hover:translate-x-1.5"
                )}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active-indicator"
                    className="w-2.5 h-2.5 rounded-full bg-primary-600 dark:bg-secondary-400 shadow-[0_0_12px_rgba(45,212,191,0.8)]"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* ── Bottom High-Converting Action Block (Proportional Top Margin) ── */}
      <motion.div 
        variants={itemVariants}
        className="mt-6 sm:mt-8 pt-4 flex flex-col items-center gap-2.5 w-full relative text-center shrink-0"
      >
        {/* Subtle Separator Line */}
        <div className="w-20 h-[1.5px] bg-gray-200 dark:bg-gray-800 mb-1" />
        
        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
          Ready to scale your direct bookings?
        </p>
        
        {/* High-Converting Get Free Audit Button */}
        <button
          onClick={() => {
            onClose();
            window.dispatchEvent(new Event("openLeadModal"));
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 dark:from-primary-500 dark:to-secondary-400 rounded-full transition-all active:scale-95 shadow-xl shadow-primary-600/25 cursor-pointer"
        >
          <Gift size={16} className="text-secondary-300 dark:text-secondary-200 animate-bounce" />
          <span>Get Free Audit</span>
        </button>

        {/* Book Consultation Button */}
        <Link
          href="/contact"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center px-5 py-3 text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/90 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all border border-black/5 dark:border-white/10"
        >
          Book Consultation
        </Link>
      </motion.div>
    </motion.div>
  );
}
