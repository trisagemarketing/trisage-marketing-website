"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, CheckCircle2, Building2, Phone, Mail, User, ChevronDown } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";
import { toast } from "sonner";

export default function LeadPopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "Performance Marketing & Direct Bookings",
    message: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const serviceOptions = [
    "Performance Marketing & Direct Bookings",
    "Local SEO & GEO AI Optimization",
    "Hospitality Website Design",
    "Revenue Management & Yield Optimization",
    "Full Digital Audit"
  ];

  useEffect(() => {
    // 1. Custom Event Listener: On-demand CTA button clicks ALWAYS open modal unconditionally
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("openLeadModal", handleOpenModal);

    // 2. Optimized Deferred Timer: Appears smoothly after 8 seconds once page animations settle
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => {
      window.removeEventListener("openLeadModal", handleOpenModal);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      toast.error("Please enter a valid full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      toast.error("Please enter a valid phone number (10 to 15 digits).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setIsSubmitted(true);
        sessionStorage.setItem("trisage_lead_modal_dismissed", "true");
        toast.success("Thank you! Your inquiry has been sent to our team.");
        setTimeout(() => {
          setIsOpen(false);
        }, 2500);
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto transform-gpu">
          
          {/* Backdrop Blur Overlay - GPU Accelerated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gray-950/65 backdrop-blur-sm transform-gpu"
          />

          {/* Modal Card - GPU Accelerated */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white dark:bg-[#081222] border border-gray-200 dark:border-cyan-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] z-10 my-auto transform-gpu will-change-transform"
          >
            {/* Background Wrapper (Clipped to prevent mesh orb bleed) */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none z-0">
              {/* Top Glowing Mesh Orb Background */}
              <div 
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl" 
              />
              <div 
                className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl" 
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="p-5 sm:p-7 relative z-10">
              
              {isSubmitted ? (
                /* Success State */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 mb-2 shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto leading-relaxed">
                    Our senior hospitality growth team is reviewing your details and will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                /* Main Lead Form */
                <>
                  {/* Header Badge & Title */}
                  <div className="mb-4 sm:mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
                      <Sparkles size={12} />
                      <span>Free Growth Consultation</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                      Scale Your Direct <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500">Revenue</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Share your business goals, and our digital marketing experts will create a customized growth strategy tailored to your brand.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Vikramaditya Roy"
                          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@hotel.com"
                            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 92179 00934"
                            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                        Hotel / Business Name
                      </label>
                      <div className="relative">
                        <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Villasita Resort"
                          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Service Required */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                        Primary Service Needed
                      </label>
                      <div className="relative">
                        {/* Custom Trigger (Visible everywhere) */}
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <span className="truncate">{formData.service}</span>
                          <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* MURPHY'S LAW FIX 1: Invisible Native Select for Mobile. 
                            100% bulletproof: relies on native iOS/Android OS pickers instead of custom UI on small screens. */}
                        <select
                          value={formData.service}
                          onChange={(e) => {
                            setFormData({ ...formData, service: e.target.value });
                            setIsDropdownOpen(false);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer sm:hidden z-20"
                        >
                          {serviceOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>

                        {/* Desktop Custom Dropdown Menu */}
                        <div className="hidden sm:block">
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <>
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setIsDropdownOpen(false)} 
                                />
                                {/* MURPHY'S LAW FIX 2: max-h-48 & overflow-y-auto prevents clipping on small desktop viewports. 
                                    Opens UPWARDS (bottom-[calc...]) because the input is at the bottom of the modal! */}
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute left-0 right-0 bottom-[calc(100%+4px)] z-50 py-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-h-48 overflow-y-auto"
                                >
                                  {serviceOptions.map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, service: option });
                                        setIsDropdownOpen(false);
                                      }}
                                      className={`w-full px-4 py-2 text-left text-xs sm:text-sm transition-colors ${
                                        formData.service === option 
                                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium' 
                                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Sending Details...</span>
                      ) : (
                        <>
                          <span>Submit & Get Free Audit</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>

                  </form>
                </>
              )}

            </div>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
