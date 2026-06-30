import { createClient } from "@/lib/supabase/server";
import { Mail } from "lucide-react";
import { markMeetingBooked, deleteContactMessage } from "@/app/actions/contact";

import MessageActions from "./MessageActions";

export default async function MessagesTableBody({ limit }: { limit?: number }) {
  const supabase = await createClient();
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (limit) {
    query = query.limit(limit);
  }

  const { data: messages, error } = await query;

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
      {messages.map((msg: any) => {
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
        let safeDateFull = "Unknown";
        let safeTimeShort = "";
        try {
          if (msg.created_at) {
            const d = new Date(msg.created_at);
            safeDateShort = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            safeDateFull = d.toLocaleString(undefined, { 
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
          <div key={msg.id} className={`group relative transition-all duration-300 border p-5 rounded-2xl shadow-sm hover:shadow-md ${msg.meeting_booked ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-500/10" : "border-gray-200/50 dark:border-white/5 bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40"}`}>
            
            {/* Header: Name & Status */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                  <span className="truncate">{safeName}</span>
                  {msg.meeting_booked && (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                      Booked
                    </span>
                  )}
                </h3>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate mt-0.5">{safeCompany}</p>
              </div>
              <div className="text-right flex flex-col items-end shrink-0">
                <div className="flex flex-wrap justify-end gap-1 mb-1 max-w-[200px]">
                  {serviceArray.map((srv: string, idx: number) => (
                    <span key={idx} className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                      {srv.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col text-right mt-1">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{safeDateShort}</span>
                  <span className="text-[10px] text-gray-500">{safeTimeShort}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-2 mb-4 p-3.5 rounded-xl bg-gray-50/80 dark:bg-white/5 border border-gray-100 dark:border-white/5">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">Email</span>
                <span className="text-sm text-gray-900 dark:text-gray-300 font-medium truncate">{safeEmail}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0">Phone</span>
                <span className="text-sm text-gray-900 dark:text-gray-300 font-medium truncate">{safePhone}</span>
              </div>
            </div>

            {/* Message */}
            <div className="mb-5">
              <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1.5">Message</span>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed" title={safeMessage}>
                {safeMessage}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
              <MessageActions msg={msg} />
            </div>

          </div>
        );
      })}
    </>
  );
}
