"use client";

import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import { markMeetingBooked, deleteContactMessage } from "@/app/actions/contact";
import { AlertTriangle, Eye, X, Mail, Phone, Building, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";

export default function MessageActions({ msg }: { msg: any }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Murphy's Law null-checks
  const safeName = msg.full_name ?? "Unknown";
  const safeCompany = msg.company ?? "Not provided";
  const safeEmail = msg.email ?? "No email";
  const safePhone = msg.phone ?? "No phone";
  const rawService = msg.service;
  let serviceArray: string[] = [];
  if (Array.isArray(rawService)) {
    serviceArray = rawService;
  } else if (typeof rawService === 'string' && rawService.trim() !== '') {
    serviceArray = rawService.split(',');
  } else {
    serviceArray = ["General Inquiry"];
  }
  const safeMessage = msg.message ?? "";
  
  let safeDate = "Unknown date";
  try {
    if (msg.created_at) {
      safeDate = new Date(msg.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
  } catch (e) {
    console.error("Invalid date:", e);
  }

  const handleBook = () => {
    startTransition(async () => {
      const res = await markMeetingBooked(msg.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Successfully marked as booked!");
        setIsSlideOverOpen(false); // Close slideover if it was open
      }
    });
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    startTransition(async () => {
      const res = await deleteContactMessage(msg.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Lead completely deleted from database.");
        setIsSlideOverOpen(false);
      }
    });
  };

  return (
    <>
      {/* Table Actions */}
      <div className={`flex flex-wrap items-center justify-end w-full gap-2 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={() => setIsSlideOverOpen(true)}
          disabled={isPending}
          className="w-full sm:w-auto flex-1 sm:flex-none justify-center bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-500/30 shadow-[0_2px_10px_-3px_rgba(var(--primary-rgb),0.2)] hover:shadow-[0_4px_12px_-2px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-0.5 text-xs sm:text-sm font-bold transition-all px-3 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>

        {!msg.meeting_booked && (
          <button 
            onClick={handleBook}
            disabled={isPending}
            className="w-full sm:w-auto flex-1 sm:flex-none justify-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_-2px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 text-xs sm:text-sm font-bold transition-all px-3 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center whitespace-nowrap"
          >
            {isPending ? "Saving..." : "Mark Booked"}
          </button>
        )}
        
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={isPending}
          className="w-full sm:w-auto flex-1 sm:flex-none justify-center bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)] hover:shadow-[0_4px_12px_-2px_rgba(244,63,94,0.3)] hover:-translate-y-0.5 text-xs sm:text-sm font-bold transition-all px-3 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center whitespace-nowrap"
        >
          {isPending ? "..." : "Delete"}
        </button>
      </div>

      {/* Stripe-style Slide-over Panel for Full Details */}
      {mounted && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-[9990] transition-opacity duration-300 ${isSlideOverOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsSlideOverOpen(false)}
          />
          
          {/* Panel */}
          <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-[#0a1220] shadow-2xl z-[9991] transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-white/10 overflow-hidden flex flex-col ${isSlideOverOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lead Details</h2>
              <button 
                onClick={() => setIsSlideOverOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8" data-lenis-prevent="true">
              
              {/* Profile Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{safeName}</h3>
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium flex-wrap">
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <div className="flex flex-wrap gap-1.5">
                      {serviceArray.map((srv, idx) => (
                        <span key={idx} className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-primary-100/50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20">
                          {srv.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {msg.meeting_booked && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Booked
                  </span>
                )}
              </div>

              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Email</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 truncate" title={safeEmail}>{safeEmail}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 truncate">{safePhone}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Company</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 truncate">{safeCompany}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-1">Date</p>
                    <p className="text-sm text-gray-900 dark:text-gray-200 truncate">{safeDate}</p>
                  </div>
                </div>
              </div>

              {/* The Full Message */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Complete Message</h4>
                <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-5 relative">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                    {safeMessage}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                disabled={isPending}
                className="px-6 py-2.5 rounded-xl text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 font-semibold transition-colors"
              >
                Delete
              </button>
              
              {!msg.meeting_booked ? (
                <button 
                  onClick={handleBook}
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-semibold transition-colors shadow-lg shadow-emerald-600/20 flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {isPending ? "Saving..." : "Mark as Booked"}
                </button>
              ) : (
                <div className="flex-1 py-2.5 rounded-xl text-emerald-700 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 font-semibold text-center border border-emerald-200 dark:border-emerald-500/30 flex justify-center items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Already Booked
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Beautiful Custom Delete Modal using React Portal */}
      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0a1220] rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200/50 dark:border-white/10 transform transition-all scale-100 opacity-100">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 mb-5 mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
              Delete this Lead?
            </h3>
            
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">
              Are you sure you want to permanently delete this lead? This action cannot be undone.
            </p>
            
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors shadow-lg shadow-red-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
