"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileText,
  PlusCircle,
  X,
  User,
  Building,
  BadgeCheck,
  Timer,
  History,
  Briefcase,
  RefreshCw,
  Info,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  employee_id: string;
  department_id: string;
  avatar_url?: string;
  is_active: boolean;
  departments?: {
    code: string;
    name: string;
  };
}

interface AttendanceRecord {
  id: string;
  work_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: string;
  location_check_in?: {
    lat?: number | null;
    lng?: number | null;
    ip?: string | null;
    address?: string | null;
  } | null;
}

interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
}

interface CustomDatePickerProps {
  label: string;
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  required?: boolean;
}

function CustomDatePicker({ label, value, onChange, required }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const selectedDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
    onChange(selectedDateStr);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const formattedMonth = String(today.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(today.getDate()).padStart(2, "0");
    const todayStr = `${today.getFullYear()}-${formattedMonth}-${formattedDay}`;
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    onChange(todayStr);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const displayDate = value
    ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Select date...";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-1">
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 sm:py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-secondary-500 flex items-center justify-between shadow-xs transition-colors cursor-pointer"
      >
        <span className={value ? "font-bold text-slate-900 dark:text-white" : "text-slate-400"}>
          {displayDate}
        </span>
        <CalendarIcon className="w-4 h-4 text-secondary-500 shrink-0" />
      </button>

      {/* Hidden input for HTML form validation */}
      <input type="text" readOnly value={value} required={required} className="sr-only" />

      {/* Glassmorphism Date Picker Popover Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 p-4 bg-white/95 dark:bg-[#1f2a3e]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header Month/Year Selector */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-7 w-7" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const formattedMonth = String(currentMonth + 1).padStart(2, "0");
              const formattedDay = String(dayNum).padStart(2, "0");
              const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

              const isSelected = value === dateStr;
              const isToday =
                new Date().toISOString().split("T")[0] === dateStr;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-7 w-7 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/30 scale-105"
                      : isToday
                      ? "bg-secondary-500/15 text-secondary-600 dark:text-secondary-400 border border-secondary-500/30"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Footer Shortcuts */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 mt-3 text-xs">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-secondary-600 dark:text-secondary-400 font-extrabold hover:underline transition-all cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const tabsSectionRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const scrollToTabsSection = (targetTab?: 'attendance' | 'leaves') => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
    setTimeout(() => {
      if (tabsSectionRef.current) {
        const rect = tabsSectionRef.current.getBoundingClientRect();
        // Only scroll if tabs section is outside comfortable viewport bounds
        if (rect.top < 0 || rect.top > 140) {
          const y = rect.top + window.pageYOffset - 80;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }, 50);
  };
  
  // Action States
  const [isPunching, setIsPunching] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState<LeaveRequest | null>(null);
  const [selectedAttendanceDetail, setSelectedAttendanceDetail] = useState<AttendanceRecord | null>(null);
  
  // Profile Settings States
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editFullName, setEditFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Sync profile values when profile loads
  useEffect(() => {
    if (profile?.full_name) {
      setEditFullName(profile.full_name);
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsUpdatingProfile(true);
    const toastId = toast.loading("Updating profile & security settings...");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editFullName,
          ...(newPassword ? { newPassword } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Profile update failed.", { id: toastId });
        setIsUpdatingProfile(false);
        return;
      }

      toast.success("Profile & security settings updated successfully!", { id: toastId });
      setProfile(data.profile);
      setNewPassword('');
      setConfirmPassword('');
      setShowProfileModal(false);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Network error during profile update.", { id: toastId });
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  // Unpaid Leave Form
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);

  // Live Clock Ticker
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Profile & Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Today's Attendance & Profile
      const todayRes = await fetch("/api/attendance/today");
      const todayData = await todayRes.json().catch(() => null);

      if (!todayRes.ok || !todayData?.success) {
        if (todayRes.status === 401 || !todayData?.profile) {
          toast.error("Authentication required. Please sign in to access your dashboard.");
          router.push("/login");
          return;
        }
        toast.error(todayData?.error || "Unable to fetch today's attendance profile.");
        return;
      }

      setProfile(todayData.profile);

      // Automatically redirect HR Admin away from Employee Punch Clock to HR Management Portal
      if (todayData.profile?.role === 'hr' || todayData.profile?.role === 'admin') {
        router.push("/admin/dashboard");
        return;
      }

      setTodayRecord(todayData.record);

      // 2. Fetch Attendance History
      const historyRes = await fetch("/api/attendance/history");
      const historyData = await historyRes.json().catch(() => null);
      if (historyRes.ok && historyData?.success) {
        setAttendanceHistory(historyData.records || historyData.history || []);
      }

      // 3. Fetch My Leave Requests
      const leaveRes = await fetch("/api/leave/request");
      const leaveData = await leaveRes.json().catch(() => null);
      if (leaveRes.ok && leaveData?.success) {
        setLeaveRequests(leaveData.requests || []);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error("Network connectivity issue. Please refresh page.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Punch In (Check-In)
  const handlePunchIn = async () => {
    setIsPunching(true);
    const toastId = toast.loading("Acquiring GPS location & punching in...");

    const executePunchIn = async (lat?: number, lng?: number) => {
      try {
        const res = await fetch("/api/attendance/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: lat,
            longitude: lng,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          toast.error(data.error || "Punch-in failed.", { id: toastId });
          setIsPunching(false);
          return;
        }

        toast.success("Punched in successfully! Have a productive day.", { id: toastId });
        setTodayRecord(data.record);
        fetchData();
      } catch (err) {
        console.error("Punch in error:", err);
        toast.error("Network error during punch in.", { id: toastId });
      } finally {
        setIsPunching(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          executePunchIn(pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation warning:", err.message);
          executePunchIn(); // Proceed without coordinates if permission denied
        },
        { timeout: 8000 }
      );
    } else {
      executePunchIn();
    }
  };

  // Handle Punch Out (Check-Out)
  const handlePunchOut = async () => {
    setIsPunching(true);
    const toastId = toast.loading("Recording punch out time...");

    try {
      const res = await fetch("/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Punch-out failed.", { id: toastId });
        setIsPunching(false);
        return;
      }

      toast.success("Punched out successfully! Work session saved.", { id: toastId });
      setTodayRecord(data.record);
      fetchData();
    } catch (err) {
      console.error("Punch out error:", err);
      toast.error("Network error during punch out.", { id: toastId });
    } finally {
      setIsPunching(false);
    }
  };

  // Handle Leave Application Submit
  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()) {
      toast.error("Please fill in all leave request details.");
      return;
    }

    setIsSubmittingLeave(true);
    const toastId = toast.loading("Submitting leave request...");

    try {
      const res = await fetch("/api/leave/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: leaveForm.startDate,
          endDate: leaveForm.endDate,
          reason: leaveForm.reason,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Leave application failed.", { id: toastId });
        setIsSubmittingLeave(false);
        return;
      }

      toast.success("Leave request submitted for HR review!", { id: toastId });
      setShowLeaveModal(false);
      setLeaveForm({ startDate: '', endDate: '', reason: '' });
      fetchData();
    } catch (err) {
      console.error("Leave request error:", err);
      toast.error("Network error during leave request.", { id: toastId });
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    toast.success("Signed out successfully.");
    router.push("/login");
  };

  // Calculate Punched-In Work Hours Timer with seconds precision
  const getElapsedWorkTime = () => {
    if (!todayRecord?.check_in_time) return "0m 0s";
    const checkIn = new Date(todayRecord.check_in_time).getTime();
    const checkOut = todayRecord.check_out_time
      ? new Date(todayRecord.check_out_time).getTime()
      : currentTime
      ? currentTime.getTime()
      : Date.now();

    const diffMs = Math.max(0, checkOut - checkIn);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#141b29] flex flex-col items-center justify-center text-slate-900 dark:text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-secondary-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold tracking-wide">Loading Employee Dashboard...</span>
        </div>
      </div>
    );
  }

  const isCheckedIn = !!todayRecord?.check_in_time && !todayRecord?.check_out_time;
  const isCompletedToday = !!todayRecord?.check_in_time && !!todayRecord?.check_out_time;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#141b29] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-secondary-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#1f2a3e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-3.5 sm:px-8 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <Image
            src="/logo.png"
            alt="Trisage Marketing Logo"
            width={160}
            height={45}
            priority
            className="h-7 sm:h-10 w-auto object-contain mix-blend-multiply dark:mix-blend-screen shrink-0"
          />
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700/80 shrink-0" />
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-secondary-600 dark:text-secondary-400 uppercase truncate">
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Date/Time Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <CalendarIcon className="w-3.5 h-3.5 text-secondary-500" />
            <span>
              {currentTime ? currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "--"}
            </span>
          </div>

          <ThemeToggle />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
            title="Sign out of Employee Portal"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-extrabold whitespace-nowrap">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-24 md:pb-6 space-y-6">
        {/* Header Profile Banner */}
        <div className="relative bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left w-full md:w-auto">
            {/* Avatar Pill */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-extrabold text-xl sm:text-2xl shadow-md shrink-0 overflow-hidden relative mx-auto sm:mx-0">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile?.full_name || "Avatar"}
                  fill
                  sizes="80px"
                  className="object-cover object-center rounded-2xl"
                />
              ) : (
                profile?.full_name?.substring(0, 2).toUpperCase() || "EM"
              )}
            </div>

            <div className="space-y-1.5 flex flex-col items-center sm:items-start w-full min-w-0">
              {/* Single Row Title & Badge */}
              <div className="flex flex-row items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-normal shrink-0">
                  Welcome, {profile?.full_name || "Employee"}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
                  {profile?.departments?.name || profile?.role || "Team Member"}
                </span>
              </div>

              {/* Single Row ID & Email Details */}
              <div className="flex flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                <span className="flex items-center gap-1.5 shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ID: <strong className="text-slate-700 dark:text-slate-200">{profile?.employee_id || "TR-EMP"}</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5 shrink-0">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Email: <strong className="text-slate-700 dark:text-slate-200">{profile?.email}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto">
            <Link
              href="/dashboard/profile"
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <User className="w-4 h-4 text-secondary-500" />
              <span>Edit Full Profile</span>
            </Link>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply Unpaid Leave (LOP)</span>
            </button>
          </div>
        </div>

        {/* Hero Section: Live Attendance Punch Clock & Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Punch In/Out Main Action Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white via-white to-slate-50 dark:from-[#1f2a3e] dark:via-[#1f2a3e] dark:to-[#172132] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 flex items-center justify-center shrink-0">
                  <Timer className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <h2 className="text-xs sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Today's Punch Clock
                  </h2>

                  {/* Status Badge below title, fully covered by icon container */}
                  <div>
                    {isCheckedIn ? (
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-[10px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        PUNCHED IN (ACTIVE)
                      </span>
                    ) : isCompletedToday ? (
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                        PUNCHED OUT
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] sm:text-xs font-extrabold inline-flex items-center gap-1.5 whitespace-nowrap">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        NOT PUNCHED IN
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Clock Display */}
            <div className="my-3 text-center py-5 px-3 sm:px-4 rounded-3xl bg-slate-100/70 dark:bg-[#141b29]/80 border border-slate-200/80 dark:border-slate-800">
              <span className="block text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1">
                Real-Time Clock
              </span>
              <div className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono whitespace-nowrap">
                {currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}
              </div>
              <span className="block text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">
                Today: {todayRecord?.work_date || new Date().toISOString().split('T')[0]}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-4 relative z-10">
              {!isCheckedIn ? (
                <button
                  onClick={handlePunchIn}
                  disabled={isPunching || isCompletedToday}
                  className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase cursor-pointer relative z-10"
                >
                  {isPunching ? (
                    <>
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Recording Punch In...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{isCompletedToday ? "Day Session Completed" : "Punch In Now"}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handlePunchOut}
                  disabled={isPunching}
                  className="w-full py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-rose-600/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase cursor-pointer relative z-10"
                >
                  {isPunching ? (
                    <>
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Recording Punch Out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Punch Out Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Today's Punch Summary Stats Widget */}
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col justify-start space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary-500 shrink-0" />
                <span>Shift Metrics</span>
              </h3>
              <button
                onClick={fetchData}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer active:scale-95 shrink-0"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Punch In Time</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono shrink-0">
                  {todayRecord?.check_in_time
                    ? new Date(todayRecord.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "--:--"}
                </span>
              </div>

              <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Punch Out Time</span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono shrink-0">
                  {todayRecord?.check_out_time
                    ? new Date(todayRecord.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "--:--"}
                </span>
              </div>

              <div className="px-3.5 py-3 sm:px-4 sm:py-3.5 rounded-2xl bg-secondary-500/10 border border-secondary-500/20 flex items-center justify-between gap-2">
                <span className="text-xs text-secondary-700 dark:text-secondary-300 font-bold shrink-0">Total Work Duration</span>
                <span className="text-xs sm:text-sm font-extrabold text-secondary-600 dark:text-secondary-400 font-mono shrink-0">
                  {getElapsedWorkTime()}
                </span>
              </div>

              {todayRecord?.location_check_in?.address && (
                <div
                  className="px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium min-w-0"
                  title={`${todayRecord.location_check_in.address}${todayRecord.location_check_in.ip ? ` (${todayRecord.location_check_in.ip})` : ''}`}
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span className="truncate min-w-0">
                    {todayRecord.location_check_in.address}
                    {todayRecord.location_check_in.ip ? ` (${todayRecord.location_check_in.ip})` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Navigation Tabs */}
        <div ref={tabsSectionRef} className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-3 flex-wrap">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 w-full xs:w-auto">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`w-full sm:w-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/60'
                }`}
              >
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Attendance Log</span>
              </button>

              <button
                onClick={() => setActiveTab('leaves')}
                className={`w-full sm:w-auto px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 cursor-pointer ${
                  activeTab === 'leaves'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Unpaid Leave Applications ({leaveRequests.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ATTENDANCE HISTORY */}
          {activeTab === 'attendance' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              {/* Mobile Card List View (Natural Top-to-Bottom Scroll, Executive Layout) */}
              <div className="space-y-3 block sm:hidden">
                {attendanceHistory.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                    No recent attendance records found.
                  </div>
                ) : (
                  attendanceHistory.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedAttendanceDetail(rec)}
                      className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 dark:from-[#172132]/90 dark:via-[#1f2a3e] dark:to-[#172132]/50 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-3 cursor-pointer hover:border-secondary-500/50 transition-all active:scale-[0.99] group"
                    >
                      {/* Row 1: Date & Day Badge on Left, Status Pill on Right */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-secondary-500" />
                          <div>
                            <span className="block text-xs font-black text-slate-900 dark:text-white">
                              {rec.work_date}
                            </span>
                            <span className="text-[10px] font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">
                              {new Date(rec.work_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            rec.status === 'present'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : rec.status === 'late'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </div>

                      {/* Row 2: Check In & Check Out Times Side-by-Side */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Check In
                          </span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                            {rec.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 flex items-center gap-1">
                            <LogOut className="w-3 h-3 text-rose-500" />
                            Check Out
                          </span>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                            {rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
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
              <div className="hidden sm:block overflow-x-auto hide-scrollbar w-full border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 whitespace-nowrap">Date</th>
                      <th className="py-3 px-4 whitespace-nowrap">Check In</th>
                      <th className="py-3 px-4 whitespace-nowrap">Check Out</th>
                      <th className="py-3 px-4 whitespace-nowrap">Location & IP Address</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {attendanceHistory.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                          No recent attendance records found.
                        </td>
                      </tr>
                    ) : (
                      attendanceHistory.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">
                            <div className="flex flex-col">
                              <span>{rec.work_date}</span>
                              <span className="text-[10px] text-secondary-600 dark:text-secondary-400 font-bold uppercase tracking-wider">
                                {new Date(rec.work_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                            {rec.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                            {rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
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
                                  : rec.status === 'late'
                                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LEAVE APPLICATIONS */}
          {activeTab === 'leaves' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              {/* Mobile Card List View (Natural Top-to-Bottom Scroll, Executive Focused Layout) */}
              <div className="space-y-3 block sm:hidden">
                {leaveRequests.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                    No leave applications submitted yet.
                  </div>
                ) : (
                  leaveRequests.map((req) => (
                    <div
                      key={req.id}
                      onClick={() => setSelectedLeaveDetail(req)}
                      className="p-4 rounded-2xl bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 dark:from-[#172132]/90 dark:via-[#1f2a3e] dark:to-[#172132]/50 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden space-y-3 cursor-pointer hover:border-secondary-500/50 transition-all active:scale-[0.99] group"
                    >
                      {/* Row 1: Type Pill on Left, Status Pill on Right */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                          Unpaid Leave (LOP)
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              req.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : req.status === 'rejected'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="text-[10px] text-secondary-500 font-extrabold group-hover:translate-x-0.5 transition-transform">
                            →
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Sleek Uncompressed Date & Duration Banner */}
                      <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1.5 rounded-lg bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 shrink-0">
                            <CalendarIcon className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leave Duration</span>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono text-xs truncate">
                              {req.start_date} <span className="text-secondary-500 font-bold">→</span> {req.end_date}
                            </span>
                          </div>
                        </div>

                        <div className="px-3 py-1 rounded-xl bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-black shrink-0 whitespace-nowrap">
                          {req.total_days} {req.total_days === 1 ? 'day' : 'days'}
                        </div>
                      </div>

                      {/* Row 3: Styled Reason Quote Callout */}
                      <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/60 border-l-3 border-l-secondary-500 border border-slate-200/60 dark:border-slate-800/60 text-xs space-y-0.5">
                        <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Reason for Leave (Tap to expand)</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{req.reason}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto hide-scrollbar w-full border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm min-w-[620px]">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4 whitespace-nowrap">Type</th>
                      <th className="py-3 px-4 whitespace-nowrap">Start Date</th>
                      <th className="py-3 px-4 whitespace-nowrap">End Date</th>
                      <th className="py-3 px-4 whitespace-nowrap">Duration</th>
                      <th className="py-3 px-4 whitespace-nowrap">Reason</th>
                      <th className="py-3 px-4 whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {leaveRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No leave applications submitted yet.
                        </td>
                      </tr>
                    ) : (
                      leaveRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">
                            Unpaid Leave (LOP)
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                            {req.start_date}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono">
                            {req.end_date}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
                            {req.total_days} {req.total_days === 1 ? 'day' : 'days'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={req.reason}>
                            {req.reason}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                req.status === 'approved'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : req.status === 'rejected'
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                              }`}
                            >
                              {req.status}
                            </span>
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
      </main>

      {/* UNPAID LEAVE (LOP) APPLICATION MODAL OVERLAY */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border-0 sm:border border-slate-200 dark:border-slate-700 rounded-none sm:rounded-3xl p-6 sm:p-7 w-full h-full sm:h-auto max-w-none sm:max-w-md shadow-2xl relative overflow-y-auto flex flex-col justify-between sm:block">
            <div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer active:scale-95 z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white pr-10">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-secondary-500/10 text-secondary-500 shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm xs:text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Apply Unpaid Leave (LOP)
                  </h3>
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 block leading-tight mt-0.5 truncate">
                    Trisage SOP: Only Unpaid Leave (UL) active
                  </span>
                </div>
              </div>

              <form onSubmit={handleLeaveSubmit} className="space-y-4 sm:space-y-3 mt-3">
                <div className="p-3 sm:p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] sm:text-xs flex items-center gap-2 font-medium leading-snug">
                  <Info className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Note: Unpaid leave results in Loss of Pay (LOP) upon HR approval.</span>
                </div>

                {/* Side-by-Side 2-Column Custom Date Pickers */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3.5 sm:gap-3">
                  <CustomDatePicker
                    label="Start Date"
                    required
                    value={leaveForm.startDate}
                    onChange={(dateStr) => setLeaveForm({ ...leaveForm, startDate: dateStr })}
                  />

                  <CustomDatePicker
                    label="End Date"
                    required
                    value={leaveForm.endDate}
                    onChange={(dateStr) => setLeaveForm({ ...leaveForm, endDate: dateStr })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 sm:mb-1">
                    Reason for Unpaid Leave
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    placeholder="State clear reason for your leave request..."
                    className="w-full py-3 sm:py-2.5 px-4 sm:px-3 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-secondary-500 resize-none"
                  />
                </div>

                <div className="pt-2 sm:pt-0">
                  <button
                    type="submit"
                    disabled={isSubmittingLeave}
                    className="w-full py-4 sm:py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-extrabold text-xs uppercase tracking-wide shadow-lg shadow-primary-600/20 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer active:scale-[0.99] relative z-10"
                  >
                    {isSubmittingLeave ? "Submitting Request..." : "Submit Unpaid Leave Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 text-slate-900 dark:text-white">
              <div className="p-2.5 rounded-2xl bg-secondary-500/10 text-secondary-500">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">My Profile & Security</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">View profile details and update account password</span>
              </div>
            </div>

            {/* Readonly Overview Badges */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 mb-5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Work Email:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Employee ID:</span>
                <span className="font-mono font-bold text-secondary-600 dark:text-secondary-400">{profile?.employee_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Department:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{profile?.departments?.name || "General"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Account Role:</span>
                <span className="font-bold uppercase text-emerald-600 dark:text-emerald-400">{profile?.role}</span>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Security & Password Update (Optional)
                </span>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                    />
                  </div>

                  {newPassword && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-bold text-xs uppercase tracking-wide shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer mt-2"
              >
                {isUpdatingProfile ? "Saving Changes..." : "Save Profile & Security Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOCUSED LEAVE REQUEST DETAILS MODAL (BACKGROUND BLUR & CLEAR CLOSE BUTTONS) */}
      {selectedLeaveDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150">
            {/* Top Right Close Button */}
            <button
              onClick={() => setSelectedLeaveDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer active:scale-95 z-20"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge & Title */}
            <div className="space-y-1 pr-10">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Unpaid Leave (LOP) Details
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Application Overview
              </h3>
            </div>

            {/* Status Pill */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Approval Status</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  selectedLeaveDetail.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : selectedLeaveDetail.status === 'rejected'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                }`}
              >
                {selectedLeaveDetail.status}
              </span>
            </div>

            {/* Date Range & Duration */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Start Date</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">{selectedLeaveDetail.start_date}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">End Date</span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono">{selectedLeaveDetail.end_date}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Total Duration</span>
                <span className="font-black text-secondary-600 dark:text-secondary-400">
                  {selectedLeaveDetail.total_days} {selectedLeaveDetail.total_days === 1 ? 'day' : 'days'}
                </span>
              </div>
            </div>

            {/* Full Un-truncated Reason Text */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border-l-4 border-l-secondary-500 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Full Reason for Leave</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedLeaveDetail.reason}
              </p>
            </div>

            {/* Rejection Reason if any */}
            {selectedLeaveDetail.rejection_reason && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs space-y-1">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-rose-500">HR Rejection Reason</span>
                <p className="font-semibold leading-relaxed">{selectedLeaveDetail.rejection_reason}</p>
              </div>
            )}

            {/* Bottom Close Button */}
            <button
              onClick={() => setSelectedLeaveDetail(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs tracking-wider uppercase transition-all active:scale-98 cursor-pointer shadow-md"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* FOCUSED ATTENDANCE RECORD DETAILS MODAL */}
      {selectedAttendanceDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative animate-in zoom-in-95 duration-150">
            {/* Top Right Close Button */}
            <button
              onClick={() => setSelectedAttendanceDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer active:scale-95 z-20"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1 pr-10">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-[10px] font-black uppercase tracking-wider">
                Attendance Record Details
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {selectedAttendanceDetail.work_date}
              </h3>
            </div>

            {/* Punch Times */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  Check In
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm block">
                  {selectedAttendanceDetail.check_in_time ? new Date(selectedAttendanceDetail.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Check Out
                </span>
                <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm block">
                  {selectedAttendanceDetail.check_out_time ? new Date(selectedAttendanceDetail.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                </span>
              </div>
            </div>

            {/* Location */}
            {selectedAttendanceDetail.location_check_in?.address && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Check-In Location</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-1.5 leading-snug">
                  <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>{selectedAttendanceDetail.location_check_in.address}</span>
                </p>
                {selectedAttendanceDetail.location_check_in.ip && (
                  <span className="block text-[10px] text-slate-400 font-mono pl-5">
                    IP Address: {selectedAttendanceDetail.location_check_in.ip}
                  </span>
                )}
              </div>
            )}

            {/* Bottom Close Button */}
            <button
              onClick={() => setSelectedAttendanceDetail(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs tracking-wider uppercase transition-all active:scale-98 cursor-pointer shadow-md"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* CONNECTED MOBILE BOTTOM NAVIGATION BAR (DOCKED TO BOTTOM EDGE - 2 TABS STRICTLY: LOGS & APPLY) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 w-full">
        <nav className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)] px-4 py-2.5 grid grid-cols-2 items-center justify-center gap-4 relative overflow-hidden transition-colors duration-300">
          {/* Tab 1: Logs */}
          <button
            onClick={() => {
              if (showLeaveModal) setShowLeaveModal(false);
              scrollToTabsSection('attendance');
            }}
            className={`flex flex-col items-center justify-center py-1 px-4 transition-all relative group cursor-pointer ${
              !showLeaveModal ? "text-secondary-600 dark:text-secondary-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {!showLeaveModal && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-secondary-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <CheckCircle2 className={`w-5 h-5 transition-transform duration-200 ${!showLeaveModal ? "scale-110 text-secondary-600 dark:text-secondary-400" : "group-hover:scale-105"}`} />
            <span className={`text-[11px] font-extrabold tracking-wide mt-1 transition-colors ${!showLeaveModal ? "text-slate-900 dark:text-white font-black" : "text-slate-500 dark:text-slate-400"}`}>
              Logs
            </span>
          </button>

          {/* Tab 2: Apply */}
          <button
            onClick={() => setShowLeaveModal(true)}
            className={`flex flex-col items-center justify-center py-1 px-4 transition-all relative group cursor-pointer ${
              showLeaveModal ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {showLeaveModal && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <PlusCircle className={`w-5 h-5 transition-transform duration-200 ${showLeaveModal ? "scale-110 text-amber-500" : "group-hover:scale-105 text-amber-600 dark:text-amber-400"}`} />
            <span className={`text-[11px] font-extrabold tracking-wide mt-1 transition-colors ${showLeaveModal ? "text-amber-600 dark:text-amber-400 font-black" : "text-slate-500 dark:text-slate-400"}`}>
              Apply
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
