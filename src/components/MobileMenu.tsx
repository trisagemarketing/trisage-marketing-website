"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

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
      // Upgraded to premium glassmorphism
      className="fixed inset-0 z-40 bg-white/90 dark:bg-[#050b14]/90 backdrop-blur-2xl pt-28 pb-8 px-4 md:px-8 lg:px-12 flex flex-col lg:hidden"
    >
      <nav className="flex flex-col gap-8 items-start justify-center flex-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <motion.div key={link.name} variants={itemVariants} className="w-full">
              <Link
                href={link.href}
                onClick={onClose}
                className="group flex items-center w-full"
              >
                <span className={cn(
                  "text-4xl md:text-5xl font-medium tracking-tight transition-all duration-300",
                  isActive 
                    ? "text-gray-900 dark:text-white translate-x-2" 
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-2"
                )}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="mobile-active-indicator"
                    className="ml-4 w-2 h-2 rounded-full bg-primary-600 dark:bg-primary-500"
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
        className="mt-auto pt-8 flex flex-col items-center gap-4 w-full relative text-center"
      >
        {/* Centered Elegant Separator Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gray-200 dark:bg-gray-800" />
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-2">Ready to scale your brand?</p>
        <Link
          href="/clients"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center px-6 py-4 text-lg font-medium text-white bg-gray-900 hover:bg-black dark:bg-primary-600 dark:hover:bg-primary-500 rounded-full transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
        >
          Book Consultation
        </Link>
      </motion.div>
    </motion.div>
  );
}
