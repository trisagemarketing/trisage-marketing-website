import Founder from "@/components/Founder";
import DirectorsVision from "@/components/DirectorsVision";
import TeamShowcase from "@/components/TeamShowcase";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import DeviceManagement from "@/components/DeviceManagement";

import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Trisage Marketing",
  description: "Learn about Trisage Marketing, our founder, and our methodology for scaling ambitious brands.",
};

export default function AboutPage() {
  return (
    <>
      <div className="relative pt-40 pb-24 text-center overflow-hidden">
        {/* Background Group Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
            alt="Trisage Team working together" 
            fill
            className="object-cover object-center"
            priority
            unoptimized // Using unoptimized for external unsplash URL just in case domains aren't configured in next.config
          />
          {/* Opacity Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/80 z-10" />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">About Trisage</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto drop-shadow-md font-medium">
            We are a team of data-driven marketers, creative thinkers, and growth engineers dedicated to your success.
          </p>
        </div>
      </div>

      <DeviceManagement />


      <DirectorsVision />
      <Founder />
      <TeamShowcase />
      <Process />
      <CTA />
    </>
  );
}
