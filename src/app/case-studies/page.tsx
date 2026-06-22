import CaseStudies from "@/components/CaseStudies";
import CaseStudiesHero from "@/components/CaseStudiesHero";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Trisage Marketing",
  description: "Explore our portfolio, results, and success stories.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <CaseStudiesHero />
      <CaseStudies />
      <CTA />
    </>
  );
}
