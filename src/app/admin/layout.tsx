"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Calendar,
  Shield
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const pathname = usePathname();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('hr@trisagemarketing.com');
  const [isNavigating, setIsNavigating] = useState(false);
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
    const savedState = localStorage.getItem('trisage_sidebar_collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, [pathname, supabase]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('trisage_sidebar_collapsed', String(newState));
  };

  const handleLogout = async () => {
    toast.success("Successfully signed out. Redirecting...");
    await supabase.auth.signOut();
    setTimeout(() => {
      router.push("/admin/login");
      router.refresh();
    }, 800);
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "EMS Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Employee Directory", href: "/admin/employees", icon: Users },
    { name: "Unpaid Leaves Queue", href: "/admin/leaves", icon: FileText },
    { name: "Monthly Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Profile & Settings", href: "/dashboard/profile", icon: Settings },
  ];

  return (
    <div className="h-screen bg-slate-100 dark:bg-[#141b29] flex flex-col md:flex-row relative overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Sidebar (Desktop) */}
      <aside 
        className={`${isCollapsed ? "md:w-20" : "md:w-64"} hidden md:flex flex-col h-screen bg-white/95 dark:bg-[#1f2a3e]/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-30 shadow-sm transition-all duration-300 ease-in-out shrink-0`}
      >
        {/* Logo Section */}
        <div className={`h-16 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 transition-all duration-300 ${isCollapsed ? "justify-center px-0 w-20" : "justify-between px-5 w-64"}`}>
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Trisage Logo"
              width={140}
              height={36}
              priority
              className={`h-7 w-auto object-contain transition-all mix-blend-multiply dark:mix-blend-screen ${isCollapsed ? "max-w-[32px] object-left" : ""}`}
            />
            {!isCollapsed && (
              <span className="px-2 py-0.5 rounded-md bg-secondary-500/10 text-[10px] font-black uppercase tracking-wider text-secondary-600 dark:text-secondary-400 border border-secondary-500/20 whitespace-nowrap">
                HR Portal
              </span>
            )}
          </Link>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const isActive = item.href === "/admin/dashboard"
              ? (pathname === "/admin/dashboard" || pathname === "/admin")
              : pathname.startsWith(item.href);
              
            return (
              <Link 
                key={idx}
                href={item.href}
                onClick={() => {
                  if (pathname !== item.href) setIsNavigating(true);
                }}
                className={`flex items-center gap-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                  isActive 
                    ? "bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border border-secondary-500/30 shadow-xs" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                } ${
                  isCollapsed 
                    ? "justify-center w-11 h-11 mx-auto p-0" 
                    : "py-3 px-3.5"
                }`}
                title={item.name}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-secondary-600 dark:text-secondary-400" : ""}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Collapse Toggle Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <button 
            onClick={toggleSidebar} 
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer ${
              isCollapsed ? "w-11 h-11 p-0 mx-auto" : "w-full py-2.5 px-3.5 gap-2"
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span className="truncate">Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 bg-white/90 dark:bg-[#1f2a3e]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Trisage Marketing"
                width={120}
                height={32}
                priority
                className="h-7 w-auto object-contain mix-blend-multiply dark:mix-blend-screen"
              />
              <span className="px-2 py-0.5 rounded-md bg-secondary-500/10 text-[10px] font-bold uppercase tracking-wider text-secondary-600 dark:text-secondary-400 border border-secondary-500/20">
                HR
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Trisage Marketing EMS</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-white capitalize">
                {pathname.split('/').pop() || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>{userEmail}</span>
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto relative z-10 w-full p-4 sm:p-8" data-lenis-prevent="true">
          {isNavigating && (
            <div className="fixed inset-0 z-50 bg-[#f8fafc]/95 dark:bg-[#0f172a]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-slate-900 dark:text-white font-sans animate-in fade-in duration-150">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-800 border-t-secondary-500 rounded-full animate-spin" />
                </div>

                <div className="text-sm font-medium text-slate-600 dark:text-slate-300 tracking-wide font-sans">
                  Loading{dots}
                </div>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
