"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Calendar,
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
  Info
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

export default function EmployeeDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  
  // Action States
  const [isPunching, setIsPunching] = useState(false);
  const [activeTab, setActiveTab] = useState<'attendance' | 'leaves'>('attendance');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
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
    const toastId = toast.loading("Submitting Unpaid Leave (LOP) request...");

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

      toast.success("Unpaid Leave request submitted for HR review!", { id: toastId });
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
      <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#1f2a3e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/logo.png"
            alt="Trisage Marketing Logo"
            width={160}
            height={45}
            priority
            className="h-8 sm:h-10 w-auto object-contain mix-blend-multiply dark:mix-blend-screen"
          />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden xs:block" />
          <span className="hidden xs:inline-block text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            Employee Portal
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live Date/Time Badge */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-secondary-500" />
            <span>
              {currentTime ? currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) : "--"}
            </span>
          </div>

          <ThemeToggle />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Header Profile Banner */}
        <div className="relative bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar Pill */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white font-extrabold text-2xl shadow-md shrink-0 overflow-hidden relative">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile?.full_name || "Avatar"}
                  fill
                  sizes="80px"
                  className="object-contain object-center p-1"
                />
              ) : (
                profile?.full_name?.substring(0, 2).toUpperCase() || "EM"
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-normal [letter-spacing:-0.03em]">
                  Welcome, {profile?.full_name || "Employee"}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-bold uppercase tracking-wider">
                  {profile?.departments?.name || profile?.role || "Team Member"}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  ID: <strong className="text-slate-700 dark:text-slate-200">{profile?.employee_id || "TR-EMP"}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Email: <strong className="text-slate-700 dark:text-slate-200">{profile?.email}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions: Apply Leave & My Profile Settings */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/dashboard/profile"
              className="w-full md:w-auto px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <User className="w-4 h-4 text-secondary-500" />
              <span>Edit Full Profile</span>
            </Link>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply Unpaid Leave (LOP)</span>
            </button>
          </div>
        </div>

        {/* Hero Section: Live Attendance Punch Clock & Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Punch In/Out Main Action Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white via-white to-slate-50 dark:from-[#1f2a3e] dark:via-[#1f2a3e] dark:to-[#172132] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-600 dark:text-secondary-400">
                  <Timer className="w-5 h-5" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Today's Attendance Punch Clock
                </h2>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                {isCheckedIn ? (
                  <span className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    PUNCHED IN (ACTIVE)
                  </span>
                ) : isCompletedToday ? (
                  <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    PUNCHED OUT (COMPLETED)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    NOT PUNCHED IN YET
                  </span>
                )}
              </div>
            </div>

            {/* Live Clock Display */}
            <div className="my-4 text-center py-6 px-4 rounded-3xl bg-slate-100/70 dark:bg-[#141b29]/80 border border-slate-200/80 dark:border-slate-800">
              <span className="block text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1">
                Real-Time Clock
              </span>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-wider text-slate-900 dark:text-white font-mono">
                {currentTime ? currentTime.toLocaleTimeString() : "--:--:--"}
              </div>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2">
                Today: {todayRecord?.work_date || new Date().toISOString().split('T')[0]}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              {!isCheckedIn ? (
                <button
                  onClick={handlePunchIn}
                  disabled={isPunching || isCompletedToday}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-600/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase cursor-pointer"
                >
                  {isPunching ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Recording Punch In...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{isCompletedToday ? "Day Session Completed" : "Punch In Now"}</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handlePunchOut}
                  disabled={isPunching}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-rose-600/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase cursor-pointer"
                >
                  {isPunching ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Recording Punch Out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-5 h-5" />
                      <span>Punch Out Now</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Today's Punch Summary Stats Widget */}
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-start space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary-500" />
                Shift Metrics
              </h3>
              <button
                onClick={fetchData}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title="Refresh Metrics"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Punch In Time</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {todayRecord?.check_in_time
                    ? new Date(todayRecord.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "--:--"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Punch Out Time</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {todayRecord?.check_out_time
                    ? new Date(todayRecord.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : "--:--"}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-secondary-500/10 border border-secondary-500/20 flex items-center justify-between">
                <span className="text-xs text-secondary-700 dark:text-secondary-300 font-bold">Total Work Duration</span>
                <span className="text-sm font-extrabold text-secondary-600 dark:text-secondary-400 font-mono">
                  {getElapsedWorkTime()}
                </span>
              </div>

              {todayRecord?.location_check_in?.address && (
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                  <span className="truncate">
                    {todayRecord.location_check_in.address}
                    {todayRecord.location_check_in.ip ? ` (${todayRecord.location_check_in.ip})` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Navigation Tabs */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Attendance Log</span>
              </button>

              <button
                onClick={() => setActiveTab('leaves')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'leaves'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Unpaid Leave Applications ({leaveRequests.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: ATTENDANCE HISTORY TABLE */}
          {activeTab === 'attendance' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Location & IP Address</th>
                    <th className="py-3 px-4">Status</th>
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
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          <div className="flex flex-col">
                            <span>{rec.work_date}</span>
                            <span className="text-[10px] text-secondary-600 dark:text-secondary-400 font-bold uppercase tracking-wider">
                              {new Date(rec.work_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                          {rec.check_in_time ? new Date(rec.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                          {rec.check_out_time ? new Date(rec.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {rec.location_check_in?.address ? (
                            <div className="flex flex-col gap-0.5 max-w-xs">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
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
                        <td className="py-3.5 px-4">
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
          )}

          {/* TAB 2: LEAVE APPLICATIONS TABLE */}
          {activeTab === 'leaves' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">End Date</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
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
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          Unpaid Leave (LOP)
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                          {req.start_date}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                          {req.end_date}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                          {req.total_days} {req.total_days === 1 ? 'day' : 'days'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                          {req.reason}
                        </td>
                        <td className="py-3.5 px-4">
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
          )}
        </div>
      </main>

      {/* UNPAID LEAVE (LOP) APPLICATION MODAL OVERLAY */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowLeaveModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-500">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Apply Unpaid Leave (LOP)</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Trisage SOP: Only Unpaid Leave (Code: UL) is active</span>
              </div>
            </div>

            <form onSubmit={handleLeaveSubmit} className="space-y-4 mt-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Note: Unpaid leave will result in Loss of Pay (LOP) for requested dates upon HR approval.</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Reason for Unpaid Leave
                </label>
                <textarea
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="State clear reason for your leave request..."
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:border-secondary-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingLeave}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-bold text-xs uppercase tracking-wide shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingLeave ? "Submitting Request..." : "Submit Unpaid Leave Request"}
              </button>
            </form>
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
    </div>
  );
}
