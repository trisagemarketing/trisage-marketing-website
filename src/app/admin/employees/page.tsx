"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { handleSessionExpired } from "@/lib/auth-client";
import { Users, UserPlus, RefreshCw, X, Shield, Search, Trash2, CheckSquare, Square, AlertTriangle, Eye, EyeOff, Sparkles, User, Mail, Lock, Building2, ChevronDown, Check, Code2, Video, Palette, Share2, Key } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface EmployeeProfile {
  id: string;
  full_name: string;
  email: string;
  employee_id: string;
  role: string;
  is_active: boolean;
  avatar_url?: string | null;
  departments?: {
    code: string;
    name: string;
  };
}

export default function HREmployeesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [onboardForm, setOnboardForm] = useState({
    fullName: '',
    email: '',
    password: 'Trisage@123',
    departmentCode: 'DEV',
    role: 'employee',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [openDeptDropdown, setOpenDeptDropdown] = useState(false);
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [resetTarget, setResetTarget] = useState<EmployeeProfile | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [showResetPasswordText, setShowResetPasswordText] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const generateResetPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let pwd = "Trisage@";
    for (let i = 0; i < 4; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPasswordInput(pwd);
    setShowResetPasswordText(true);
    toast.success("Generated random secure password!");
  };

  const executeResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTarget || !newPasswordInput) return;
    if (newPasswordInput.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsResettingPassword(true);
    const toastId = toast.loading(`Resetting password for ${resetTarget.full_name}...`);

    try {
      const res = await fetch("/api/admin/employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: resetTarget.id,
          newPassword: newPasswordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "Password reset failed.", { id: toastId });
        return;
      }

      toast.success(`Password for ${resetTarget.full_name} updated successfully!`, { id: toastId });
      setResetTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Network error resetting password.", { id: toastId });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const deptDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setOpenDeptDropdown(false);
      }
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setOpenRoleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    let pwd = "Trisage@";
    for (let i = 0; i < 4; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setOnboardForm((prev) => ({ ...prev, password: pwd }));
    setShowPassword(true);
    toast.success("Generated random secure password!");
  };

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/profile");
      const data = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      if (res.ok && (data?.profiles || Array.isArray(data?.data))) {
        setEmployees(data.profiles || data.data || []);
      } else {
        toast.error(data?.error || "Failed to load employee directory.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error fetching profiles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardForm.fullName || !onboardForm.email || !onboardForm.password) {
      toast.error("Please fill in all onboarding fields.");
      return;
    }

    setIsOnboarding(true);
    const toastId = toast.loading("Creating employee account & profile...");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: onboardForm.fullName,
          email: onboardForm.email,
          password: onboardForm.password,
          departmentCode: onboardForm.departmentCode,
          role: onboardForm.role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Employee onboarding failed.", { id: toastId });
        setIsOnboarding(false);
        return;
      }

      toast.success(
        `${onboardForm.role === 'hr' ? 'HR Admin' : 'Employee'} ${onboardForm.fullName} onboarded successfully!`,
        { id: toastId }
      );
      setShowOnboardModal(false);
      setOnboardForm({
        fullName: '',
        email: '',
        password: 'Trisage@123',
        departmentCode: 'DEV',
        role: 'employee',
      });
      fetchEmployees();
    } catch (err) {
      console.error("Onboard error:", err);
      toast.error("Network error during employee onboarding.", { id: toastId });
    } finally {
      setIsOnboarding(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      emp.full_name?.toLowerCase().includes(q) ||
      emp.email?.toLowerCase().includes(q) ||
      emp.employee_id?.toLowerCase().includes(q) ||
      emp.departments?.name?.toLowerCase().includes(q)
    );
  });

  const isAllSelected = filteredEmployees.length > 0 && selectedIds.length === filteredEmployees.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmployees.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [deleteConfirmTargets, setDeleteConfirmTargets] = useState<string[] | null>(null);

  const promptDeleteEmployees = (targetIds: string[]) => {
    if (targetIds.length === 0) return;
    setDeleteConfirmTargets(targetIds);
  };

  const executeDeleteEmployees = async () => {
    if (!deleteConfirmTargets || deleteConfirmTargets.length === 0) return;
    const targetIds = deleteConfirmTargets;
    setDeleteConfirmTargets(null);

    setIsDeleting(true);
    const toastId = toast.loading(`Deleting ${targetIds.length} employee(s)...`);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: targetIds }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "Failed to delete employee profile(s).", { id: toastId });
        setIsDeleting(false);
        return;
      }

      // Optimistically update UI state immediately
      setEmployees((prev) => prev.filter((emp) => !targetIds.includes(emp.id)));
      setSelectedIds((prev) => prev.filter((id) => !targetIds.includes(id)));
      toast.success(data.message || `Deleted ${targetIds.length} employee(s) successfully!`, { id: toastId });
      fetchEmployees();
    } catch (err) {
      console.error("Delete employee error:", err);
      toast.error("Network error deleting employee(s).", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Senior Executive Header Banner */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2">
            <h1 className="text-lg xs:text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight leading-snug">
              Company Employee Directory
            </h1>
            <span className="inline-flex items-center w-max px-2.5 py-0.5 rounded-full bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider whitespace-nowrap shrink-0">
              {employees.length} Staff Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Manage active employee profiles, onboard new team members, and manage department assignments.
          </p>
        </div>

        <button
          onClick={() => setShowOnboardModal(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-extrabold text-xs uppercase tracking-wide hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer shrink-0 active:scale-98"
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          <span>Onboard New Employee</span>
        </button>
      </div>

      {/* Directory Search & Table */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search staff, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-secondary-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <button
                onClick={() => promptDeleteEmployees(selectedIds)}
                disabled={isDeleting}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs animate-in fade-in"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete ({selectedIds.length})</span>
              </button>
            )}

            <button
              onClick={fetchEmployees}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-secondary-500" />
            <span className="text-xs font-semibold">Loading employee directory...</span>
          </div>
        ) : (
          <div>
            {/* Mobile Card List View for Employee Directory */}
            <div className="space-y-2.5 block sm:hidden">
              {filteredEmployees.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  No employees match your search query.
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = selectedIds.includes(emp.id);
                  return (
                    <div
                      key={emp.id}
                      className={`p-3 rounded-2xl border shadow-xs relative overflow-hidden space-y-2.5 transition-colors ${
                        isSelected
                          ? "bg-secondary-500/10 border-secondary-500/40"
                          : "bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 dark:from-[#172132]/90 dark:via-[#1f2a3e] dark:to-[#172132]/50 border-slate-200/80 dark:border-slate-800"
                      }`}
                    >
                      {/* Row 1: Vertically Aligned Checkbox + Avatar + Employee Name/Email & Role */}
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2 gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(emp.id)}
                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-secondary-600 focus:ring-secondary-500 cursor-pointer accent-secondary-500 shrink-0 my-auto"
                          />
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800 my-auto">
                            {emp.avatar_url ? (
                              <Image
                                src={emp.avatar_url}
                                alt={emp.full_name}
                                fill
                                sizes="36px"
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-bold">
                                {emp.full_name?.substring(0, 2).toUpperCase() || 'TR'}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col min-w-0 pr-1">
                            <span className="font-extrabold text-slate-900 dark:text-white text-xs truncate leading-tight">
                              {emp.full_name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono truncate leading-tight mt-0.5">{emp.email}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0 whitespace-nowrap self-center ${
                            emp.role === 'hr' || emp.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {emp.role}
                        </span>
                      </div>

                      {/* Row 2: Uncompressed Single-Line Employee ID & Department */}
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2 text-xs">
                        <div className="flex flex-col shrink-0 min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</span>
                          <span className="font-mono font-extrabold text-secondary-600 dark:text-secondary-400 text-xs whitespace-nowrap">
                            {emp.employee_id || (emp.role === 'hr' ? 'TR-HR-001' : 'TR-EMP')}
                          </span>
                        </div>
                        <div className="flex flex-col text-right min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                            {emp.departments?.name || (emp.role === 'hr' ? 'Human Resources' : 'General')}
                          </span>
                        </div>
                      </div>

                      {/* Row 3: Active Status Pill & Compact Action Buttons */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                            emp.is_active
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {emp.is_active ? 'Active' : 'Inactive'}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setResetTarget(emp);
                              setNewPasswordInput("");
                              setShowResetPasswordText(true);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[11px] font-extrabold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap shadow-2xs"
                          >
                            <Key className="w-3.5 h-3.5 shrink-0" />
                            <span>Reset Password</span>
                          </button>
                          <button
                            onClick={() => promptDeleteEmployees([emp.id])}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                            title="Delete Employee Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-slate-200/80 dark:border-slate-800 rounded-2xl">
              <table className="w-full text-left text-xs sm:text-sm min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider whitespace-nowrap">
                    <th className="py-3 px-3 w-10 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-secondary-600 focus:ring-secondary-500 cursor-pointer accent-secondary-500"
                        title="Select All Employees"
                      />
                    </th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Employee Name</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Work Email</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Employee ID</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Department</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Role</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
                    <th className="py-3 px-3.5 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                        No employees match your search query.
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => {
                      const isSelected = selectedIds.includes(emp.id);
                      return (
                        <tr
                          key={emp.id}
                          className={`transition-colors ${
                            isSelected
                              ? "bg-secondary-500/5 dark:bg-secondary-500/10"
                              : "hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectOne(emp.id)}
                              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-secondary-600 focus:ring-secondary-500 cursor-pointer accent-secondary-500"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                                {emp.avatar_url ? (
                                  <Image
                                    src={emp.avatar_url}
                                    alt={emp.full_name}
                                    fill
                                    sizes="32px"
                                    className="object-cover object-center"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 text-xs font-bold">
                                    {emp.full_name?.substring(0, 2).toUpperCase() || 'TR'}
                                  </div>
                                )}
                              </div>
                              <span className="whitespace-nowrap">{emp.full_name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs whitespace-nowrap">
                            {emp.email}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-secondary-600 dark:text-secondary-400 whitespace-nowrap">
                            {emp.employee_id || (emp.role === 'hr' ? 'TR-HR-001' : 'TR-EMP')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
                            {emp.departments?.name || (emp.role === 'hr' ? 'Human Resources' : 'General')}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                                emp.role === 'hr' || emp.role === 'admin'
                                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {emp.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                emp.is_active
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {emp.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setResetTarget(emp);
                                setNewPasswordInput("");
                                setShowResetPasswordText(true);
                              }}
                              title="Reset Employee Password"
                              className="p-2 rounded-xl text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer mr-1"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => promptDeleteEmployees([emp.id])}
                              title="Delete Employee Profile"
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Employee Onboarding Modal */}
      {mounted && showOnboardModal && createPortal(
        <div className="fixed inset-0 z-[9999999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 relative max-h-[85vh] sm:max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Sticky Header Title */}
            <div className="sticky top-0 bg-white dark:bg-[#1f2a3e] z-20 pt-1 pb-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  onboardForm.role === 'hr'
                    ? 'bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400'
                    : 'bg-secondary-500/10 border border-secondary-500/20 text-secondary-600 dark:text-secondary-400'
                }`}>
                  {onboardForm.role === 'hr' ? <Shield className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white transition-all">
                    {onboardForm.role === 'hr' ? 'Onboard New HR Admin' : 'Onboard New Employee'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-all">
                    {onboardForm.role === 'hr'
                      ? 'Grant elevated administrative portal privileges & issue credentials.'
                      : 'Issue authentication credentials and assign department role.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={onboardForm.fullName}
                    onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-secondary-500"
                  />
                </div>
              </div>

              {/* Work Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Work Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="rahul@trisagemarketing.com"
                    value={onboardForm.email}
                    onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-secondary-500 font-mono"
                  />
                </div>
              </div>

              {/* Initial Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Initial Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-secondary-600 dark:text-secondary-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={onboardForm.password}
                    onChange={(e) => setOnboardForm({ ...onboardForm, password: e.target.value })}
                    className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-secondary-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Department & Role Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Custom Department Dropdown */}
                <div className="relative" ref={deptDropdownRef}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Department *
                  </label>
                  {onboardForm.role === 'hr' ? (
                    <div className="w-full py-2.5 px-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-between cursor-not-allowed transition-all">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Shield className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="truncate">Human Resources</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0 ml-1">
                        HR Dept
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenDeptDropdown(!openDeptDropdown);
                          setOpenRoleDropdown(false);
                        }}
                        className="w-full py-2.5 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-between cursor-pointer hover:border-secondary-500 focus:outline-none transition-all"
                      >
                        <div className="flex items-center gap-2">
                          {onboardForm.departmentCode === 'DEV' && <Code2 className="w-4 h-4 text-cyan-500 absolute left-3.5 top-3 pointer-events-none" />}
                          {onboardForm.departmentCode === 'VID' && <Video className="w-4 h-4 text-rose-500 absolute left-3.5 top-3 pointer-events-none" />}
                          {onboardForm.departmentCode === 'DES' && <Palette className="w-4 h-4 text-amber-500 absolute left-3.5 top-3 pointer-events-none" />}
                          {onboardForm.departmentCode === 'SMM' && <Share2 className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3 pointer-events-none" />}
                          <span>
                            {onboardForm.departmentCode === 'DEV' && 'Website Development'}
                            {onboardForm.departmentCode === 'VID' && 'Video Editor'}
                            {onboardForm.departmentCode === 'DES' && 'Graphic Designer'}
                            {onboardForm.departmentCode === 'SMM' && 'Social Media Marketing'}
                          </span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDeptDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {openDeptDropdown && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 z-[99] bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150 sm:min-w-[240px]">
                          {[
                            { code: 'DEV', name: 'Website Development', desc: 'Fullstack web & software team', icon: Code2, color: 'text-cyan-500 bg-cyan-500/10' },
                            { code: 'VID', name: 'Video Editor', desc: 'Motion graphics & video editing', icon: Video, color: 'text-rose-500 bg-rose-500/10' },
                            { code: 'DES', name: 'Graphic Designer', desc: 'Brand assets & UI design', icon: Palette, color: 'text-amber-500 bg-amber-500/10' },
                            { code: 'SMM', name: 'Social Media Marketing', desc: 'Digital strategy & social media', icon: Share2, color: 'text-indigo-500 bg-indigo-500/10' },
                          ].map((dept) => {
                            const IconComp = dept.icon;
                            const isSelected = onboardForm.departmentCode === dept.code;
                            return (
                              <button
                                key={dept.code}
                                type="button"
                                onClick={() => {
                                  setOnboardForm({ ...onboardForm, departmentCode: dept.code });
                                  setOpenDeptDropdown(false);
                                }}
                                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 font-extrabold border border-secondary-500/20'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${dept.color}`}>
                                    <IconComp className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold flex items-center gap-1.5">
                                      <span>{dept.name}</span>
                                      <span className="text-[10px] font-mono opacity-60">({dept.code})</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">{dept.desc}</div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <Check className="w-4 h-4 text-secondary-500 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Custom System Role Dropdown */}
                <div className="relative" ref={roleDropdownRef}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    System Role *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenRoleDropdown(!openRoleDropdown);
                        setOpenDeptDropdown(false);
                      }}
                      className="w-full py-2.5 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-between cursor-pointer hover:border-secondary-500 focus:outline-none transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 absolute left-3.5 top-3 pointer-events-none ${onboardForm.role === 'hr' ? 'text-purple-500' : 'text-slate-400'}`} />
                        <span>{onboardForm.role === 'hr' ? 'HR Admin' : 'Employee'}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openRoleDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {openRoleDropdown && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-[99] bg-white dark:bg-[#1a2333] border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            setOnboardForm({ ...onboardForm, role: 'employee' });
                            setOpenRoleDropdown(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                            onboardForm.role === 'employee'
                              ? 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 font-extrabold border border-secondary-500/20'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold">Employee</div>
                              <div className="text-[10px] text-slate-400 font-medium">Standard staff portal access</div>
                            </div>
                          </div>
                          {onboardForm.role === 'employee' && <Check className="w-4 h-4 text-secondary-500 shrink-0" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOnboardForm({ ...onboardForm, role: 'hr' });
                            setOpenRoleDropdown(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between cursor-pointer transition-colors ${
                            onboardForm.role === 'hr'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold border border-purple-500/20'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                              <Shield className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold">HR Admin</div>
                              <div className="text-[10px] text-slate-400 font-medium">Elevated admin privileges</div>
                            </div>
                          </div>
                          {onboardForm.role === 'hr' && <Check className="w-4 h-4 text-purple-500 shrink-0" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Employee ID Live Preview Badge */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141b29] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Auto-Generated ID:</span>
                <span className={`px-2.5 py-1 rounded-lg font-mono text-xs font-extrabold border transition-all ${
                  onboardForm.role === 'hr'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                    : 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border-secondary-500/20'
                }`}>
                  TR-{onboardForm.role === 'hr' ? 'HR' : onboardForm.departmentCode}-XXX
                </span>
              </div>

              {/* Sticky Actions Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-[#1f2a3e] z-20 pt-3 pb-1 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOnboarding}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isOnboarding && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {isOnboarding
                      ? "Creating Account..."
                      : onboardForm.role === "hr"
                      ? "Confirm & Onboard HR Admin"
                      : "Confirm & Onboard Employee"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Delete Confirmation Modal */}
      {mounted && deleteConfirmTargets && createPortal(
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Confirm Profile Deletion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {deleteConfirmTargets.length === 1
                    ? "Are you sure you want to delete this employee profile? All associated attendance records will be permanently purged."
                    : `Are you sure you want to delete ${deleteConfirmTargets.length} selected employee profile(s)? This action cannot be undone.`}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteConfirmTargets(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDeleteEmployees}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm & Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reset Employee Password Modal */}
      {mounted && resetTarget && createPortal(
        <div className="fixed inset-0 z-[9999999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-md w-full shadow-2xl space-y-4 relative my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">
                    Reset Account Password
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                    Issue new credentials for {resetTarget.full_name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Account Info Badge */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-between gap-2">
                <span className="truncate">{resetTarget.full_name}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border border-secondary-500/20 whitespace-nowrap shrink-0">
                  {resetTarget.employee_id || (resetTarget.role === 'hr' ? 'TR-HR-001' : 'TR-EMP')}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                {resetTarget.email}
              </div>
            </div>

            <form onSubmit={executeResetPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <label className="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                    New Secure Password *
                  </label>
                  <button
                    type="button"
                    onClick={generateResetPassword}
                    className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showResetPasswordText ? "text" : "password"}
                    required
                    placeholder="Enter new password..."
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full py-2 pl-9 pr-9 rounded-xl bg-slate-50 dark:bg-[#141b29] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordText(!showResetPasswordText)}
                    className="absolute right-2.5 top-2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    title={showResetPasswordText ? "Hide password" : "Show password"}
                  >
                    {showResetPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-extrabold text-xs uppercase tracking-wide hover:opacity-95 transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-98"
                >
                  {isResettingPassword && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isResettingPassword ? "Updating..." : "Update Password"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
