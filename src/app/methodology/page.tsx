import MethodologyHero from "@/components/MethodologyHero";
import MethodologyTimeline from "@/components/MethodologyTimeline";
import GrowthEngine from "@/components/GrowthEngine";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | Trisage Marketing",
  description: "Discover our data-driven approach to scaling brands and delivering predictable ROI.",
};

export default function MethodologyPage() {
  return (
    <>
      <MethodologyHero />
      <MethodologyTimeline />
      <GrowthEngine />
      <Process />
      <CTA />
    </>
  );
}
