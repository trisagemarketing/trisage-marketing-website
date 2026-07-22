"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send, CheckCircle2, Building2, Phone, Mail, User } from "lucide-react";
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

  useEffect(() => {
    // 1. Custom Event Listener to trigger modal on demand from any button or Floating Hub
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("openLeadModal", handleOpenModal);

    // 2. Guaranteed automatic trigger on scroll (80px)
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 80) {
            setIsOpen(true);
            window.removeEventListener("scroll", handleScroll);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3. Fallback timer: open after 2.5 seconds guaranteed
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => {
      window.removeEventListener("openLeadModal", handleOpenModal);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("trisage_lead_modal_dismissed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in your name, email, and phone number.");
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gray-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#081222] border border-gray-200 dark:border-cyan-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden z-10 my-auto"
          >
            {/* Top Glowing Mesh Orb Background */}
            <div 
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" 
            />
            <div 
              className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" 
            />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8 relative z-10">
              
              {isSubmitted ? (
                /* Success State */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center flex flex-col items-center justify-center gap-3"
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
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
                      <Sparkles size={12} />
                      <span>Free Growth Consultation</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                      Scale Your Direct <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500">Revenue</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Leave your details below to get a custom hospitality growth roadmap & OTA yield audit.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    
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
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all cursor-pointer"
                      >
                        <option value="Performance Marketing & Direct Bookings">Performance Marketing & Direct Bookings</option>
                        <option value="Local SEO & GEO AI Optimization">Local SEO & GEO AI Optimization</option>
                        <option value="Hospitality Website Design">Hospitality Website Design</option>
                        <option value="Revenue Management & Yield Optimization">Revenue Management & Yield Optimization</option>
                        <option value="Full Digital Audit">Full Digital Audit</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
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
