import Founder from "@/components/Founder";
import DirectorsVision from "@/components/DirectorsVision";
import TeamShowcase from "@/components/TeamShowcase";
import Process from "@/components/Process";
import CTA from "@/components/CTA";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Trisage Marketing",
  description: "Learn about Trisage Marketing, our founder, and our methodology for scaling ambitious brands.",
};

export default function AboutPage() {
  return (
    <>
      <div className="pt-32 pb-16 bg-gradient-to-b from-primary-50/50 dark:from-gray-900 to-white dark:to-gray-950 transition-colors duration-300 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">About Trisage</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            We are a team of data-driven marketers, creative thinkers, and growth engineers dedicated to your success.
          </p>
        </div>
      </div>

      <DirectorsVision />
      <Founder />
      <TeamShowcase />
      <Process />
      <CTA />
    </>
  );
}
