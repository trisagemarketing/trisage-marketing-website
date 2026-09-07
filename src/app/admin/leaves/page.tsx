"use client";

import { useState, useEffect, useCallback } from "react";
import { handleSessionExpired } from "@/lib/auth-client";
import { FileText, Check, X, RefreshCw, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface LeaveRequest {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  employee?: {
    full_name: string;
    email: string;
    employee_id: string;
  };
}

export default function HRLeavesPage() {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leave/queue");
      const data = await res.json().catch(() => null);
      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      if (res.ok && data?.success) {
        setLeaves(data.requests || data.queue || []);
      } else {
        toast.error("Failed to load unpaid leave queue.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error fetching leaves.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleLeaveReview = async (requestId: string, status: 'approved' | 'rejected') => {
    const toastId = toast.loading(`Processing leave ${status.toUpperCase()} decision...`);

    // Optimistically update local state immediately
    setLeaves((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status } : req))
    );

    try {
      const res = await fetch(`/api/admin/leave/${requestId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, review_notes: `Processed by HR Admin` }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Leave review decision failed.", { id: toastId });
        fetchLeaves(); // revert optimistic update
        return;
      }

      toast.success(`Leave request ${status.toUpperCase()} successfully!`, { id: toastId });
      fetchLeaves();
    } catch (err) {
      console.error("Leave review error:", err);
      toast.error("Network error reviewing leave.", { id: toastId });
      fetchLeaves(); // revert optimistic update
    }
  };

  const filteredLeaves = leaves.filter((req) => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const pendingCount = leaves.filter((r) => r.status === 'pending').length;
  const approvedCount = leaves.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaves.filter((r) => r.status === 'rejected').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Senior Executive Header Banner */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2">
            <h1 className="text-lg xs:text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Unpaid Leave Applications Queue
            </h1>
            <span className="inline-flex items-center w-max px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap shrink-0">
              {pendingCount} Pending Requests
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Review Loss of Pay (LOP) leave applications submitted by employees and process approvals or rejections.
          </p>
        </div>

        <button
          onClick={fetchLeaves}
          className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all active:scale-95 group"
          title="Refresh leave application queue"
        >
          <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs & Leave Queue Table */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
        {/* Segmented Non-Scrollable Tab Container Box */}
        <div className="p-1 rounded-2xl bg-slate-100/80 dark:bg-[#141b29] border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'all'
                ? "bg-white dark:bg-[#1f2a3e] text-secondary-600 dark:text-secondary-400 shadow-xs border border-slate-200/60 dark:border-slate-700/60"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>All Leaves</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold">
              {leaves.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pending'
                ? "bg-white dark:bg-[#1f2a3e] text-amber-600 dark:text-amber-400 shadow-xs border border-amber-500/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>Pending</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-extrabold">
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'approved'
                ? "bg-white dark:bg-[#1f2a3e] text-emerald-600 dark:text-emerald-400 shadow-xs border border-emerald-500/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>Approved</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-extrabold">
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'rejected'
                ? "bg-white dark:bg-[#1f2a3e] text-rose-600 dark:text-rose-400 shadow-xs border border-rose-500/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>Rejected</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-extrabold">
              {rejectedCount}
            </span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-secondary-500" />
            <span className="text-xs font-semibold">Loading leave application records...</span>
          </div>
        ) : (
          <div>
            {/* Mobile Card List View for HR Leave Management */}
            <div className="space-y-2.5 block sm:hidden">
              {filteredLeaves.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No leave applications found in this category.
                </div>
              ) : (
                filteredLeaves.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 dark:from-[#172132]/90 dark:via-[#1f2a3e] dark:to-[#172132]/50 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-2.5"
                  >
                    {/* Row 1: Applicant Name & Email + Status Pill */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2 gap-2">
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate leading-tight">
                          {req.employee?.full_name || "Employee"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono truncate leading-tight mt-0.5">{req.employee?.email}</span>
                      </div>

                      <div className="shrink-0 self-center">
                        {req.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>APPROVED</span>
                          </span>
                        ) : req.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 whitespace-nowrap">
                            <AlertCircle className="w-3 h-3" />
                            <span>REJECTED</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            <span>PENDING</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Uncompressed Single-Row Date Range & Duration Badge */}
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-1.5">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Duration</span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono text-[11px] xs:text-xs whitespace-nowrap">
                          {req.start_date} <span className="text-secondary-500 font-bold">→</span> {req.end_date}
                        </span>
                      </div>
                      <div className="px-2 py-0.5 rounded-lg bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-[10px] font-black shrink-0 whitespace-nowrap">
                        {req.total_days} {req.total_days === 1 ? 'day' : 'days'}
                      </div>
                    </div>

                    {/* Row 3: Reason Callout Box */}
                    <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border-l-3 border-l-secondary-500 border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-0.5">
                      <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Reason for Leave</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">{req.reason}</p>
                    </div>

                    {/* Row 4: HR Action Buttons */}
                    <div className="pt-0.5">
                      {req.status === 'pending' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleLeaveReview(req.id, 'approved')}
                            className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => handleLeaveReview(req.id, 'rejected')}
                            className="py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                          <span className="text-[11px] font-bold text-slate-400">Decision Logged</span>
                          <button
                            onClick={() => handleLeaveReview(req.id, req.status === 'approved' ? 'rejected' : 'approved')}
                            className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap"
                          >
                            Re-evaluate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-2.5 px-3 whitespace-nowrap">Applicant</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Leave Category</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Start Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">End Date</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Duration</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Reason</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Status</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">HR Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No leave applications found in this category.
                      </td>
                    </tr>
                  ) : (
                    filteredLeaves.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                              {req.employee?.full_name || "Employee"}
                            </span>
                            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">{req.employee?.email}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap text-xs">
                          Unpaid Leave (LOP)
                        </td>

                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap text-xs">
                          {req.start_date}
                        </td>

                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap text-xs">
                          {req.end_date}
                        </td>

                        <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap text-xs">
                          {req.total_days} {req.total_days === 1 ? 'day' : 'days'}
                        </td>

                        <td className="py-3 px-3 text-slate-500 max-w-[180px] sm:max-w-xs truncate whitespace-nowrap text-xs">
                          {req.reason}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {req.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>APPROVED</span>
                            </span>
                          ) : req.status === 'rejected' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                              <AlertCircle className="w-3 h-3" />
                              <span>REJECTED</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              <span>PENDING</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleLeaveReview(req.id, 'approved')}
                                className="px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => handleLeaveReview(req.id, 'rejected')}
                                className="px-3 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[11px] font-bold text-slate-400">Decision Logged</span>
                              <button
                                onClick={() => handleLeaveReview(req.id, req.status === 'approved' ? 'rejected' : 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap"
                                title="Change HR decision"
                              >
                                Re-evaluate
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
