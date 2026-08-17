"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { handleSessionExpired } from "@/lib/auth-client";
import { Calendar, RefreshCw, MapPin, ChevronDown, Check, User } from "lucide-react";
import { toast } from "sonner";

interface EmployeeProfile {
  id: string;
  full_name: string;
  email: string;
  employee_id: string;
  role: string;
  departments?: {
    code: string;
    name: string;
  };
}

import { createPortal } from "react-dom";

function CustomStaffDropdown({
  employees,
  selectedId,
  onSelect,
}: {
  employees: EmployeeProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
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
    const dropdownHeight = 240;
    const openUpwards = window.innerHeight - rect.bottom < dropdownHeight + 20;

    return {
      position: "fixed" as const,
      top: openUpwards ? `${rect.top - Math.min(dropdownHeight, 240) - 6}px` : `${rect.bottom + 6}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 99999,
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

  const selectedEmp = employees.find((e) => e.id === selectedId) || employees[0];

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="w-full sm:w-64 py-2.5 px-3.5 rounded-xl bg-white dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow-xs"
      >
        <div className="flex items-center gap-2 truncate">
          <User className="w-3.5 h-3.5 text-secondary-500 shrink-0" />
          <span className="truncate">{selectedEmp ? `${selectedEmp.full_name} (${selectedEmp.employee_id || 'TR-EMP'})` : 'Select Employee'}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && mounted && menuStyle && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="rounded-2xl bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-700 shadow-2xl py-1.5 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto font-sans text-left"
        >
          {employees.map((emp) => {
            const isSelected = emp.id === selectedId;
            return (
              <button
                key={emp.id}
                type="button"
                onClick={() => {
                  onSelect(emp.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex flex-col truncate">
                  <span className="truncate">{emp.full_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono font-normal">
                    {emp.employee_id || 'TR-EMP'} • {emp.departments?.name || 'General'}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-secondary-500 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

export default function HRCalendarPage() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // e.g. "2026-08"
  const [calendarData, setCalendarData] = useState<any>(null);
  const [isFetchingCalendar, setIsFetchingCalendar] = useState<boolean>(false);

  const fetchEmployees = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        return;
      }

      if (res.ok && data?.profiles) {
        const profs = data.profiles || [];
        setEmployees(profs);
        if (profs.length > 0 && !selectedEmpId) {
          const defaultEmp = profs.find((e: any) => e.role === 'employee') || profs[0];
          setSelectedEmpId(defaultEmp.id);
          fetchCalendarData(defaultEmp.id, selectedMonth);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedEmpId, selectedMonth]);

  const fetchCalendarData = async (empId: string, month: string) => {
    if (!empId) return;
    setIsFetchingCalendar(true);
    try {
      const res = await fetch(`/api/admin/attendance/calendar?user_id=${empId}&month=${month}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setCalendarData(data);
      } else {
        toast.error(data.error || "Failed to load employee calendar.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error fetching calendar.");
    } finally {
      setIsFetchingCalendar(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-normal [letter-spacing:-0.03em]">
              Employee Monthly Attendance Calendar
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Monthly Inspection
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Inspect individual employee monthly attendance matrix with color-coded present, absent, and holiday badges.
          </p>
        </div>
      </div>

      {/* Controls Bar & Calendar Grid */}
      <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Select Staff:</span>
            <CustomStaffDropdown
              employees={employees}
              selectedId={selectedEmpId}
              onSelect={(empId) => {
                setSelectedEmpId(empId);
                fetchCalendarData(empId, selectedMonth);
              }}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">Month:</span>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                fetchCalendarData(selectedEmpId, e.target.value);
              }}
              className="py-2 px-3 rounded-xl bg-white dark:bg-[#141b29] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:border-secondary-500 cursor-pointer shadow-xs"
            />

            <button
              onClick={() => fetchCalendarData(selectedEmpId, selectedMonth)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
            >
              Load Calendar
            </button>
          </div>
        </div>

        {isFetchingCalendar ? (
          <div className="py-12 flex items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin text-secondary-500" />
            <span className="text-xs font-semibold">Fetching monthly calendar matrix...</span>
          </div>
        ) : calendarData ? (
          <div className="space-y-6">
            {/* Monthly Summary Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="block text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">🟢 Present Days</span>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {calendarData.summary?.presentDays || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                <span className="block text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400">🔴 Absent Days</span>
                <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  {calendarData.summary?.absentDays || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="block text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">🟡 Leave / Holidays</span>
                <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {calendarData.summary?.leaveDays || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <span className="block text-[10px] font-bold uppercase text-slate-500">📅 Total Month Days</span>
                <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  {calendarData.summary?.totalDays || 31}
                </span>
              </div>
            </div>

            {/* 31-Day Interactive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {calendarData.calendarDays?.map((d: any) => {
                const isPresent = d.status === 'present' || d.status === 'late';
                const isAbsent = d.status === 'absent';
                const isLeave = d.status === 'on_leave';

                return (
                  <div
                    key={d.date}
                    className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2.5 transition-all ${
                      isPresent
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-slate-900 dark:text-white shadow-xs'
                        : isAbsent
                        ? 'bg-rose-500/15 border-rose-500/40 text-slate-900 dark:text-white shadow-xs'
                        : isLeave
                        ? 'bg-amber-500/15 border-amber-500/40 text-slate-900 dark:text-white shadow-xs'
                        : d.isWeekend
                        ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                        : 'bg-white dark:bg-[#141b29] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold">{d.day}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{d.dayOfWeek}</span>
                    </div>

                    <div className="min-h-[38px] flex flex-col justify-center">
                      {isPresent ? (
                        <div className="space-y-0.5">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[9px] uppercase">
                            PRESENT
                          </span>
                          <span className="block text-[10px] font-mono text-emerald-800 dark:text-emerald-200 font-bold truncate">
                            {d.checkIn || '--'} - {d.checkOut || '--'}
                          </span>
                        </div>
                      ) : isAbsent ? (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[9px] uppercase w-max">
                          ABSENT
                        </span>
                      ) : isLeave ? (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-600 text-white font-extrabold text-[9px] uppercase w-max">
                          UNPAID LEAVE
                        </span>
                      ) : d.isWeekend ? (
                        <span className="text-[10px] font-semibold text-slate-400">Weekend</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">No Entry</span>
                      )}
                    </div>

                    {d.location && (
                      <span className="text-[9px] text-slate-400 truncate block border-t border-slate-200/50 dark:border-slate-800 pt-1">
                        📍 {d.location}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
