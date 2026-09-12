import Services from "@/components/Services";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitality Marketing Services | Trisage Marketing",
  description: "Explore our specialized hotel and hospitality marketing services: Hotel SEO, GEO & AI search, social media, performance marketing, website design, and revenue management.",
  alternates: {
    canonical: "https://trisagemarketing.com/services",
  },
  openGraph: {
    title: "Hospitality Marketing Services | Trisage Marketing",
    description: "Explore our specialized hotel and hospitality marketing services: Hotel SEO, GEO & AI search, social media, performance marketing, website design, and revenue management.",
    url: "https://trisagemarketing.com/services",
    siteName: "Trisage Marketing",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Hospitality Marketing Services - Trisage Marketing",
      },
    ],
  },
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
