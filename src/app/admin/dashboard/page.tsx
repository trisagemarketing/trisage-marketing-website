"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { handleSessionExpired } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  UserPlus,
  RefreshCw,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

import { createPortal } from "react-dom";

function CustomStatusDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (newStatus: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return null;
    const rect = buttonRef.current.getBoundingClientRect();
    const dropdownHeight = 156;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;

    const targetWidth = 144;
    let left = rect.right - targetWidth;
    if (left + targetWidth > viewWidth - 12) {
      left = viewWidth - targetWidth - 12;
    }
    if (left < 12) left = 12;

    const spaceBelow = viewHeight - rect.bottom;
    const openUpwards = spaceBelow < dropdownHeight + 16 && rect.top > dropdownHeight + 16;
    const top = openUpwards ? rect.top - dropdownHeight - 6 : rect.bottom + 6;

    return {
      position: "fixed" as const,
      top: `${top}px`,
      left: `${left}px`,
      width: `${targetWidth}px`,
      zIndex: 9999999,
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      const pos = calculatePosition();
      if (pos) setMenuStyle(pos);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      const pos = calculatePosition();
      if (pos) setMenuStyle(pos);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, calculatePosition]);

  const options = [
    { label: "Present", value: "present", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20", icon: CheckCircle2 },
    { label: "Absent", value: "absent", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20", icon: AlertCircle },
    { label: "Late", value: "late", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20", icon: Clock },
    { label: "Half Day", value: "half_day", bg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20", icon: Shield },
  ];

  const currentOpt = options.find((o) => o.value === value) || options[0];
  const IconComponent = currentOpt.icon;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs shrink-0 active:scale-95 ${currentOpt.bg}`}
      >
        <IconComponent className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
        <span className="truncate">{currentOpt.label}</span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && mounted && menuStyle && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="rounded-2xl bg-white/95 dark:bg-[#1a2333]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-150 font-sans text-left z-[9999999]"
        >
          {options.map((opt) => {
            const OptIcon = opt.icon;
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <OptIcon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-secondary-500 shrink-0" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

interface AttendanceRecord {
  id: string;
  user_id: string;
  work_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  notes?: string | null;
  location_check_in?: {
    address?: string | null;
    ip?: string | null;
  } | null;
  employee?: {
    id: string;
    full_name: string;
    email: string;
    employee_id: string;
    department_id: string;
    avatar_url?: string | null;
  };
}

export default function HRAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState<number>(0);
  const [totalEmpCount, setTotalEmpCount] = useState<number>(5);
  const [isMarkingAbsent, setIsMarkingAbsent] = useState(false);

  const fetchHRDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Fetch Today's Attendance Records
      const attRes = await fetch(`/api/admin/attendance?date=${todayStr}`);
      const attData = await attRes.json().catch(() => null);
      if (attRes.ok && attData?.success) {
        setTodayAttendance(attData.records || []);
      }

      // 2. Fetch Pending Leave Requests Count
      const leaveRes = await fetch("/api/admin/leave/queue");
      const leaveData = await leaveRes.json().catch(() => null);
      if (leaveRes.ok && leaveData?.success) {
        setPendingLeaveCount((leaveData.queue || leaveData.requests || []).length);
      }

      // 3. Fetch All Employees Count
      const empRes = await fetch("/api/admin/profile");
      const empData = await empRes.json().catch(() => null);
      if (empRes.ok && empData?.profiles) {
        setTotalEmpCount(empData.profiles.length || 5);
      }

      // Check for 401/403 authentication session expiration
      if (attRes.status === 401 || attRes.status === 403 || leaveRes.status === 401 || empRes.status === 401) {
        handleSessionExpired();
        return;
      }
    } catch (err) {
      console.error("HR Dashboard error:", err);
      toast.error("Failed to load HR portal data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHRDashboardData();
  }, [fetchHRDashboardData]);

  // Handle Auto-Mark Absent Trigger
  const handleAutoMarkAbsent = async () => {
    setIsMarkingAbsent(true);
    const toastId = toast.loading("Scanning non-punched employees and auto-marking absent...");

    try {
      const res = await fetch("/api/admin/attendance/mark-absent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split('T')[0] }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Auto-mark absent failed.", { id: toastId });
        setIsMarkingAbsent(false);
        return;
      }

      if (data.markedCount === 0) {
        toast.success("All active staff accounted for today!", { id: toastId });
      } else {
        toast.success(`Marked ${data.markedCount} employee(s) as ABSENT today`, { id: toastId });
      }

      fetchHRDashboardData();
    } catch (err) {
      console.error("Mark absent error:", err);
      toast.error("Network error while running absent check.", { id: toastId });
    } finally {
      setIsMarkingAbsent(false);
    }
  };

  // Handle HR Status Override for Attendance Record
  const handleStatusOverride = async (recordId: string, newStatus: string) => {
    const toastId = toast.loading(`Updating attendance status to ${newStatus.toUpperCase()}...`);

    try {
      const res = await fetch(`/api/admin/attendance/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Status update failed.", { id: toastId });
        return;
      }

      toast.success(`Attendance status updated to ${newStatus.toUpperCase()}!`, { id: toastId });
      fetchHRDashboardData();
    } catch (err) {
      console.error("Override error:", err);
      toast.error("Network error updating status.", { id: toastId });
    }
  };

  const presentTodayCount = todayAttendance.filter(a => a.status === 'present' || a.status === 'late' || a.check_in_time).length;
  const absentTodayCount = todayAttendance.filter(a => a.status === 'absent').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Profile Banner */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-normal [letter-spacing:-0.03em]">
              HR & Admin Executive Dashboard
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-bold uppercase tracking-wider">
              Trisage Marketing Pvt. Ltd.
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Executive overview of today's attendance metrics, non-punched staff, and employee management portal.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handleAutoMarkAbsent}
            disabled={isMarkingAbsent}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wide transition-all border border-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            title="Auto-flag active staff who did not punch in today"
          >
            <RefreshCw className={`w-4 h-4 ${isMarkingAbsent ? 'animate-spin' : ''}`} />
            <span>Mark Absent Today</span>
          </button>

          <Link
            href="/admin/employees"
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-extrabold text-xs uppercase tracking-wide hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard New Employee</span>
          </Link>
        </div>
      </div>

      {/* Executive Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Staff Card */}
        <Link href="/admin/employees" className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 hover:border-secondary-500/40 rounded-3xl p-5 shadow-sm space-y-2 transition-all block">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Employees</span>
            <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {totalEmpCount}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Across 4 Departments</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </Link>

        {/* Present Today Card */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Punched In Today</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {presentTodayCount}
          </div>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-semibold block">Live Attendance Recorded</span>
        </div>

        {/* Pending Leave Requests Card */}
        <Link href="/admin/leaves" className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-sm space-y-2 transition-all block">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Unpaid Leaves</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {pendingLeaveCount}
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-600/80 dark:text-amber-400/80 font-semibold">
            <span>Requires HR Approval</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Absent Today Card */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Absent Today</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {absentTodayCount}
          </div>
          <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80 font-semibold block">No Punch-In Recorded</span>
        </div>
      </div>

      {/* Today's Live Attendance Monitor */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-500 shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-sm xs:text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              Today's Live Attendance Monitor
            </h2>
          </div>

          <button
            onClick={fetchHRDashboardData}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all active:scale-95 group"
            title="Refresh live attendance"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-300" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-secondary-500" />
            <span className="text-xs font-semibold">Loading live attendance records...</span>
          </div>
        ) : (
          <div>
            {/* Mobile Card List View for HR Attendance Monitor (Top-to-Bottom Scroll, Zero Horizontal Overflow) */}
            <div className="space-y-3 block sm:hidden">
              {todayAttendance.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No attendance records logged for today yet. Use "Mark Absent Today" to process non-punched staff.
                </div>
              ) : (
                todayAttendance.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 dark:from-[#172132]/90 dark:via-[#1f2a3e] dark:to-[#172132]/50 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-3"
                  >
                    {/* Row 1: Employee Avatar & Name/ID (Uncompressed) + HR Override Dropdown */}
                    <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5 gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                          {rec.employee?.avatar_url ? (
                            <Image
                              src={rec.employee.avatar_url}
                              alt={rec.employee.full_name || 'Avatar'}
                              fill
                              sizes="36px"
                              className="object-cover object-center rounded-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-extrabold text-xs">
                              {rec.employee?.full_name?.substring(0, 2).toUpperCase() || "EM"}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 pr-1">
                          <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate leading-tight">
                            {rec.employee?.full_name || "Employee"}
                          </span>
                          <span className="inline-flex items-center w-max text-[10px] font-mono font-bold text-secondary-600 dark:text-secondary-400 bg-secondary-500/10 px-1.5 py-0.5 rounded-md mt-0.5 whitespace-nowrap">
                            {rec.employee?.employee_id || "TR-EMP"}
                          </span>
                        </div>
                      </div>

                      {/* HR Status Override Dropdown */}
                      <div className="shrink-0 min-w-max">
                        <CustomStatusDropdown
                          value={rec.status}
                          onChange={(newStatus) => handleStatusOverride(rec.id, newStatus)}
                        />
                      </div>
                    </div>

                    {/* Row 2: Check In & Check Out Times */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Check In
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                          {rec.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '--'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-rose-500" />
                          Check Out
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                          {rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '--'}
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Location / Web Portal Badge */}
                    {rec.location_check_in?.address ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                        <span className="truncate">{rec.location_check_in.address}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-1">
                        🌐 Web Portal Check-In
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4 whitespace-nowrap">Employee</th>
                    <th className="py-3 px-4 whitespace-nowrap">Employee ID</th>
                    <th className="py-3 px-4 whitespace-nowrap">Check In</th>
                    <th className="py-3 px-4 whitespace-nowrap">Check Out</th>
                    <th className="py-3 px-4 whitespace-nowrap">Location & IP Address</th>
                    <th className="py-3 px-4 whitespace-nowrap">Current Status</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">HR Status Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {todayAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No attendance records logged for today yet. Use "Mark Absent Today" to process non-punched staff.
                      </td>
                    </tr>
                  ) : (
                    todayAttendance.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                              {rec.employee?.avatar_url ? (
                                <Image
                                  src={rec.employee.avatar_url}
                                  alt={rec.employee.full_name || 'Avatar'}
                                  fill
                                  sizes="32px"
                                  className="object-cover object-center rounded-full"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-extrabold text-xs">
                                  {rec.employee?.full_name?.substring(0, 2).toUpperCase() || "EM"}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {rec.employee?.full_name || "Employee"}
                              </span>
                              <span className="text-[11px] text-slate-400">{rec.employee?.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-secondary-600 dark:text-secondary-400">
                          {rec.employee?.employee_id || "TR-EMP"}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                          {rec.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '--'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                          {rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : '--'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {rec.location_check_in?.address ? (
                            <div className="flex flex-col gap-0.5 max-w-xs">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 truncate">
                                <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                                {rec.location_check_in.address}
                              </span>
                              {rec.location_check_in.ip && (
                                <span className="text-[10px] text-slate-400 font-mono pl-4">
                                  IP: {rec.location_check_in.ip}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold border border-slate-200 dark:border-slate-700 text-[10px]">
                              🌐 Web Portal
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              rec.status === 'present'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : rec.status === 'absent'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <CustomStatusDropdown
                            value={rec.status}
                            onChange={(newStatus) => handleStatusOverride(rec.id, newStatus)}
                          />
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
