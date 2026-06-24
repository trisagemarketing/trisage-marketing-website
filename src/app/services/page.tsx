import Services from "@/components/Services";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Trisage Marketing",
  description: "Comprehensive digital marketing services including SEO, Performance Marketing, and Branding.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="pt-20 md:pt-28 bg-white dark:bg-gray-950 " />
      <Services />
      <CTA />
    </>
  );
}
