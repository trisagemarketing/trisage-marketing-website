"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingToggleHub from "./FloatingToggleHub";
import LeadPopupModal from "./LeadPopupModal";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmsPage = pathname?.startsWith("/admin") || pathname?.startsWith("/login") || pathname?.startsWith("/dashboard");

  return (
    <>
      {!isEmsPage && <Navbar />}
      <div id="page-wrapper">
        {children}
      </div>
      {!isEmsPage && <Footer />}
      {!isEmsPage && <FloatingToggleHub />}
      {!isEmsPage && <LeadPopupModal />}
    </>
  );
}
