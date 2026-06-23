"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Settings, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const pathname = usePathname();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    // On mount, check if they have a saved preference
    const savedState = localStorage.getItem('trisage_sidebar_collapsed');
    
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    } else {
      // If no saved preference, auto-collapse on mobile
      if (window.innerWidth < 1024) setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('trisage_sidebar_collapsed', String(newState));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="h-[100dvh] bg-[#f3fbf9] dark:bg-[#050b14] flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary-500/10 dark:bg-primary-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-secondary-500/10 dark:bg-secondary-500/5 blur-[120px]" />
      </div>

      {/* Mobile Top Header */}
      <header className="md:hidden h-16 px-4 bg-white/60 dark:bg-[#0a1220]/60 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between relative z-20 flex-shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <Image
            src="/logo.svg"
            alt="Trisage Marketing"
            width={120}
            height={30}
            priority
            className="h-6 w-auto transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
          />
          <span className="px-2.5 py-1.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-xs font-black uppercase tracking-wider text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20 shadow-sm leading-none flex items-center">
            Admin Panel
          </span>
        </Link>
        <button 
          onClick={handleLogout}
          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside 
        className={`${isCollapsed ? "md:w-20" : "md:w-72"} fixed bottom-0 left-0 right-0 md:relative w-full md:w-auto h-16 md:h-screen bg-white/80 dark:bg-[#0a1220]/80 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-gray-200/50 dark:border-white/5 flex flex-row md:flex-col z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-all duration-300 ease-in-out flex-shrink-0 pb-safe`}
      >
        <div className={`hidden md:flex h-24 border-b border-gray-200/50 dark:border-white/5 items-center overflow-hidden flex-shrink-0 transition-all duration-300 ${isCollapsed ? "justify-center px-0 w-20" : "justify-start px-6 w-72"}`}>
          <Link href="/admin/dashboard" className="relative z-50 flex items-center gap-2.5 flex-shrink-0">
            {isCollapsed ? (
              <div className="w-8 overflow-hidden flex justify-start items-center">
                <Image
                  src="/logo.svg"
                  alt="Trisage Marketing"
                  width={160}
                  height={40}
                  priority
                  className="h-8 w-[160px] max-w-none transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180 object-left"
                />
              </div>
            ) : (
              <>
                <Image
                  src="/logo.svg"
                  alt="Trisage Marketing"
                  width={120}
                  height={30}
                  priority
                  className="h-6 w-auto transition-all mix-blend-multiply dark:mix-blend-screen dark:invert dark:hue-rotate-180"
                />
                <span className="px-2.5 py-1.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-xs font-black uppercase tracking-wider text-primary-600 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20 shadow-sm leading-none flex items-center whitespace-nowrap">
                  Admin Panel
                </span>
              </>
            )}
          </Link>
        </div>
        
        <nav className="flex-1 px-4 md:p-4 flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch space-x-2 md:space-x-0 md:space-y-2 overflow-y-visible md:overflow-y-auto overflow-x-hidden h-full">
          {[
            { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
            { name: "Leads", href: "/admin/leads", icon: Mail, exact: false },
            { name: "Settings", href: "/admin/settings", icon: Settings, exact: false },
          ].map((item) => {
            // Update isActive logic to consider /admin equivalent to /admin/dashboard for exact matching
            const isActive = item.exact 
              ? (pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin"))
              : pathname.startsWith(item.href);
              
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex flex-col md:flex-row items-center transition-all flex-1 md:flex-none rounded-xl ${
                  isActive 
                    ? "font-semibold text-primary-700 dark:text-primary-300 md:bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 md:border border-primary-500/20 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" 
                    : "font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                } ${
                  isCollapsed 
                    ? "justify-center p-2 md:w-12 md:h-12 md:p-0 md:mx-auto" 
                    : "justify-center md:justify-start p-2 md:py-3 md:px-4 md:gap-3"
                }`}
                title={item.name}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 mb-1 md:mb-0 ${isActive ? "text-primary-600 dark:text-primary-400" : ""}`} />
                <span className={`md:block text-xs md:text-sm truncate whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex p-4 border-t border-gray-200/50 dark:border-white/5 space-y-2 flex-col items-center flex-shrink-0">
          <button 
            onClick={handleLogout}
            title="Sign Out"
            className={`group flex items-center justify-center text-sm font-medium text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent hover:border-red-200 dark:hover:border-red-500/30 transition-all ${
              isCollapsed ? "w-12 h-12 p-0" : "w-full py-3 px-4 gap-2"
            }`}
          >
            <LogOut className={`w-5 h-5 flex-shrink-0 ${!isCollapsed && "w-4 h-4 group-hover:-translate-x-1 transition-transform"}`} />
            {!isCollapsed && <span className="truncate whitespace-nowrap">Sign Out</span>}
          </button>
          
          <button 
            onClick={toggleSidebar} 
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            className={`flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all ${
              isCollapsed ? "w-12 h-12 p-0" : "w-full py-3 px-4 gap-2"
            }`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 flex-shrink-0" />
                <span className="truncate whitespace-nowrap">Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full pb-20 md:pb-0" data-lenis-prevent="true">
        {children}
      </main>
    </div>
  );
}
