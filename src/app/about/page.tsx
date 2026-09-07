import AboutHero from "@/components/AboutHero";
import Founder from "@/components/Founder";
import DirectorsVision from "@/components/DirectorsVision";
import TeamShowcase from "@/components/TeamShowcase";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import DeviceManagement from "@/components/DeviceManagement";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Trisage Marketing",
  description: "Learn about Trisage Marketing, our founder, and our methodology for scaling ambitious brands.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <DeviceManagement />


      <DirectorsVision />
      <Founder />
      <TeamShowcase />
      <Process />
      <CTA />
    </>
  );
}
