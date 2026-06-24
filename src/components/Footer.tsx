"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Social Icons
const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const Linkedin = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);
const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);

// Mobile Accordion Wrapper Component
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 md:border-none py-4 md:py-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between md:cursor-default md:pointer-events-none group md:mb-6"
        aria-expanded={isOpen}
      >
        {/* Reverted to original styling for desktop */}
        <h3 className="text-gray-900 dark:text-white font-semibold">{title}</h3>
        <span className="md:hidden text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out md:grid-rows-[1fr] md:opacity-100",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-4 md:mt-0" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-[#050b14] text-gray-700 dark:text-gray-300 pt-16 pb-6 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      {/* Massive Background Marquee (Desktop Only) */}
      <div className="hidden md:flex absolute inset-0 items-center pointer-events-none select-none opacity-5 overflow-hidden">
        <motion.div 
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(4)].map((_, j) => (
            <span 
              key={j} 
              className="text-[35vw] md:text-[45vw] font-black leading-[0.75] tracking-tighter text-gray-900 dark:text-white pr-16 md:pr-32"
            >
              TRISAGE
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Main Grid: Reverted to 4 columns on desktop, accordion on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-12 mb-6">
          
          {/* Column 1: Brand Info & Logo (Always visible) */}
          <div className="flex flex-col gap-6 mb-8 md:mb-0">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="Trisage Marketing"
                width={200}
                height={60}
                className="h-10 md:h-12 lg:h-14 w-auto transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
              />
            </Link>
            <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed max-w-xs">
              Premium digital marketing agency helping ambitious brands scale through data-driven strategies and exceptional design.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/company/trisage-marketing/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com/trisagemarketing" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <FooterAccordion title="Company">
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Our Services</Link></li>
              <li><Link href="/methodology" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Methodology</Link></li>
              <li><Link href="/blog" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </FooterAccordion>

          {/* Column 3: Services */}
          <FooterAccordion title="Services">
            <ul className="flex flex-col gap-3 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link href={`/services/${service.slug}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Column 4: Contact Info */}
          <FooterAccordion title="Contact Us">
            <ul className="flex flex-col gap-4 text-sm">
              <li>
                <span className="block text-gray-500 dark:text-gray-500 text-xs uppercase tracking-wider mb-1">Email</span>
                <a href="mailto:Admin@trisagemarketing.com" className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Admin@trisagemarketing.com</a>
              </li>
              <li>
                <span className="block text-gray-500 dark:text-gray-500 text-xs uppercase tracking-wider mb-1">Contact</span>
                <a href="tel:+919217900934" className="font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors">+91 92179 00934</a>
              </li>
              <li>
                <span className="block text-gray-500 dark:text-gray-500 text-xs uppercase tracking-wider mb-1">Address</span>
                <span className="block font-medium leading-relaxed">Basement, Office No.4,<br/>SSBK & ASSOCIATES, B-11, Block B,<br/>Sector 4, Noida, Uttar Pradesh - 201301</span>
              </li>
            </ul>
          </FooterAccordion>

        </div>

        {/* Absolute Bottom: Copyright & Legal */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500 dark:text-gray-500 text-center md:text-left">
          <p className="order-2 md:order-1">&copy; {currentYear} Trisage Marketing Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-6 order-1 md:order-2">
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
