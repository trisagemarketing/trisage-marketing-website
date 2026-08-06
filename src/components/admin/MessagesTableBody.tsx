import { createClient } from "@/lib/supabase/server";
import { Mail } from "lucide-react";
export interface ContactMessage {
  id: string;
  full_name: string | null;
  company: string | null;
  email: string | null;
  phone: string | null;
  service: string | string[] | null;
  message: string | null;
  created_at: string | null;
  meeting_booked: boolean;
}

import Link from "next/link";
import MessageActions from "./MessageActions";

interface MessagesTableBodyProps {
  limit?: number;
  page?: number;
  baseUrl?: string;
}

export default async function MessagesTableBody({ limit = 9, page = 1, baseUrl = "/admin/dashboard" }: MessagesTableBodyProps) {
  const supabase = await createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const { data: messages, count, error } = await query;

  if (error || !messages || messages.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Mail className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No messages yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">When visitors submit the contact form, their messages will appear here.</p>
        </td>
      </tr>
    );
  }

  return (
    <>
      {messages.map((msg: ContactMessage) => {
        // Murphy's Law: Never trust database data structure
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
        
        let safeDateShort = "Unknown";
        let safeTimeShort = "";
        try {
          if (msg.created_at) {
            const d = new Date(msg.created_at);
            safeDateShort = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            // Full date can be added here if needed in tooltip
            d.toLocaleString(undefined, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit' 
            });
            safeTimeShort = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
          }
        } catch (e) {
          console.error("Invalid date format from DB", e);
        }

        return (
          <div key={msg.id} className={`group relative transition-all duration-300 border p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-md ${msg.meeting_booked ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-500/10" : "border-gray-200/60 dark:border-white/5 bg-white/70 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40"}`}>
            
            {/* Header: Name, Status & Date */}
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate max-w-full">
                    {safeName}
                  </h3>
                  {msg.meeting_booked && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                      Booked
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 truncate mt-0.5">
                  {safeCompany}
                </p>
              </div>

              {/* Date & Time */}
              <div className="text-right shrink-0">
                <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">{safeDateShort}</span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400">{safeTimeShort}</span>
              </div>
            </div>

            {/* Service Tags */}
            <div className="flex flex-wrap gap-1.5 my-3">
              {serviceArray.map((srv: string, idx: number) => {
                const safeSrv = typeof srv === 'string' ? srv.trim() : String(srv || '');
                if (!safeSrv) return null;
                return (
                  <span key={idx} className="inline-flex px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border border-gray-200/80 dark:border-white/10">
                    {safeSrv}
                  </span>
                );
              })}
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-2 mb-4 p-3 rounded-xl bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">Email</span>
                <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-200 font-semibold truncate max-w-full break-all sm:break-normal">{safeEmail}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-0.5 sm:gap-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">Phone</span>
                <span className="text-xs sm:text-sm text-gray-900 dark:text-gray-200 font-semibold truncate">{safePhone}</span>
              </div>
            </div>

            {/* Message */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">Message</span>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed" title={safeMessage}>
                {safeMessage}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-end">
              <MessageActions msg={msg} />
            </div>

          </div>
        );
      })}

      {/* Pagination Controls */}
      {count && count > limit && (
        <div className="col-span-full flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-white/5 mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-bold text-gray-900 dark:text-white">{(page - 1) * limit + 1}</span> to <span className="font-bold text-gray-900 dark:text-white">{Math.min(page * limit, count)}</span> of <span className="font-bold text-gray-900 dark:text-white">{count}</span> inquiries
          </div>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link 
                href={`${baseUrl}?page=${page - 1}`}
                className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <button disabled className="px-4 py-2 text-sm font-bold text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg cursor-not-allowed">
                Previous
              </button>
            )}
            
            {page * limit < count ? (
              <Link 
                href={`${baseUrl}?page=${page + 1}`}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg shadow-md shadow-primary-500/20 transition-all"
              >
                Next
              </Link>
            ) : (
              <button disabled className="px-4 py-2 text-sm font-bold text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg cursor-not-allowed">
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
