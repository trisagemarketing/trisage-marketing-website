import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, willChange: "opacity, transform" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" }, willChange: "auto" }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0, willChange: "opacity" },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" }, willChange: "auto" }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, willChange: "opacity, transform" },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" }, willChange: "auto" }
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20, willChange: "opacity, transform" },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" }, willChange: "auto" }
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -30, willChange: "opacity, transform" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" }, willChange: "auto" }
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 30, willChange: "opacity, transform" },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" }, willChange: "auto" }
};

// Optimized: Replaced expensive CSS blur filter with a hardware-accelerated scale effect for low-end mobile performance
export const blurIn: Variants = {
  hidden: { opacity: 0, scale: 0.98, willChange: "opacity, transform" },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" }, willChange: "auto" }
};

export const springUp: Variants = {
  hidden: { opacity: 0, y: 30, willChange: "opacity, transform" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 80,
      damping: 15,
      mass: 1
    },
    willChange: "auto"
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};
