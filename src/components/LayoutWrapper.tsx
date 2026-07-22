"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingToggleHub from "./FloatingToggleHub";
import LeadPopupModal from "./LeadPopupModal";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <div id="page-wrapper">
        {children}
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingToggleHub />}
      {!isAdmin && <LeadPopupModal />}
    </>
  );
}
