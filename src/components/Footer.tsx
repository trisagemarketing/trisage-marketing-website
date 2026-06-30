"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { services } from "@/data/services";
import { motion } from "framer-motion";
import { Plus, Minus, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Social Icons
const Email = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const Linkedin = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
);
const Instagram = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);

// Mobile Accordion
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border-b-2 border-primary-100 dark:border-primary-900 md:border-none py-4 md:py-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between md:justify-start lg:w-full md:cursor-default md:pointer-events-none group md:mb-5"
        aria-expanded={isOpen}
      >
        <h3 className="w-full text-left poppins-semibold text-xs uppercase tracking-widest text-primary-600 dark:text-primary-400">
          {title}
        </h3>
        <span className="md:hidden text-primary-400 dark:text-primary-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </span>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out md:grid-rows-[1fr] md:opacity-100",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-3 md:mt-0" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-[#050b14] pt-16 pb-0 border-t-2 border-primary-100 dark:border-primary-900 overflow-hidden">

      {/* ── Mesh Orbs — same pattern as all sections ── */}
      <div
        className="absolute -top-1/4 -left-[8%] w-[45%] h-[70%] rounded-full pointer-events-none animate-[pulse_10s_ease-in-out_infinite] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-1/4 -right-[5%] w-[40%] h-[60%] rounded-full pointer-events-none animate-[pulse_13s_ease-in-out_infinite_reverse] will-change-opacity transform-gpu"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }}
      />




      {/* ── Scrolling Marquee Background ── */}
      <div className="hidden md:flex absolute inset-0 items-center pointer-events-none select-none overflow-hidden">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(4)].map((_, j) => (
            <span
              key={j}
              className="text-[35vw] md:text-[45vw] font-black leading-[0.75] tracking-tighter text-primary-950/[0.03] dark:text-white/[0.03] pr-16 md:pr-32"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              TRISAGE
            </span>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 items-start mb-4 md:mb-8">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5 mb-8 md:mb-0 border-b-2 border-primary-100 dark:border-primary-900 pb-6 md:border-none md:pb-0">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.svg"
                alt="Trisage Marketing"
                width={200}
                height={60}
                className="h-10 md:h-12 w-auto transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
              />
            </Link>

            {/* Brand tagline — MissionVision two-tone style */}
            <p className="font-sans font-medium text-[1.125rem] uppercase tracking-tight leading-snug text-balance">
              <span className="text-primary-600 dark:text-primary-400">Premium digital marketing agency</span>{" "}
              <span className="text-gray-700 dark:text-gray-300">helping ambitious brands scale through</span>{" "}
              <strong className="font-black text-primary-950 dark:text-white">data-driven strategies</strong>{" "}
              <span className="text-gray-700 dark:text-gray-300">and exceptional</span>{" "}
              <strong className="font-black text-secondary-600 dark:text-secondary-400">design.</strong>
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { href: "mailto:admin@trisagemarketing.com", icon: <Email size={17} />, label: "Email" },
                { href: "https://linkedin.com/company/trisage-marketing/", icon: <Linkedin size={17} />, label: "LinkedIn" },
                { href: "https://instagram.com/trisagemarketing", icon: <Instagram size={17} />, label: "Instagram" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-primary-100 dark:border-primary-800 text-primary-400 dark:text-primary-500 hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 transition-all duration-300"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Company */}
          <FooterAccordion title="Company">
            <ul className="flex flex-col gap-2.5 text-sm lg:pr-4">
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Our Services" },
                { href: "/methodology", label: "Methodology" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-sans font-medium uppercase tracking-tight text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-primary-500 transition-all duration-300 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Column 3: Services */}
          <FooterAccordion title="Services">
            <ul className="flex flex-col gap-2.5 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-sans font-medium uppercase tracking-tight text-gray-600 dark:text-gray-400 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-2 h-[2px] bg-secondary-500 transition-all duration-300 rounded-full" />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Column 4: Contact */}
          <FooterAccordion title="Contact Us">
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900 border-2 border-primary-100 dark:border-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={13} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <span className="block font-black text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-0.5">Email</span>
                  <a href="mailto:Admin@trisagemarketing.com" className="font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Admin@trisagemarketing.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-secondary-50 dark:bg-secondary-900/30 border-2 border-secondary-100 dark:border-secondary-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={13} className="text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <span className="block font-black text-[10px] uppercase tracking-widest text-secondary-600 dark:text-secondary-400 mb-0.5">Phone</span>
                  <a href="tel:+919217900934" className="font-medium text-gray-700 dark:text-gray-300 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">
                    +91 92179 00946
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-primary-50 dark:bg-primary-900 border-2 border-primary-100 dark:border-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <span className="block font-black text-[10px] uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-0.5">Address</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 leading-relaxed block">
                    B-11, Amaltash Marg, <br /> &amp; Block B, Sector 4,<br />
                    Noida, Uttar Pradesh 201301
                  </span>
                </div>
              </li>
            </ul>
          </FooterAccordion>

        </div>

        {/* ── Bottom Bar ── */}
        <div className=" border-primary-100 dark:border-primary-900 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright — MissionVision two-tone */}
          <p className="font-sans font-medium text-xs uppercase tracking-widest text-center md:text-left order-2 md:order-1 leading-relaxed">

            <strong className="block md:inline font-black text-primary-600 dark:text-primary-400">
              © {currentYear} Trisage Marketing Pvt Ltd.
            </strong>

            {/* Separator — visible only on desktop */}
            <span className="hidden md:inline mx-2 text-primary-300 dark:text-primary-800 font-black">·</span>

            <span className="block text-gray-400 dark:text-gray-600 mt-1 md:mt-0 md:inline">
              All rights reserved.
            </span>
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center items-center gap-6 order-1 md:order-2">
            <Link
              href="/privacy"
              className="font-sans font-black text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="w-1 h-1 rounded-full bg-primary-300 dark:bg-primary-800" />
            <Link
              href="/terms-and-conditions"
              className="font-sans font-black text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-600 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
