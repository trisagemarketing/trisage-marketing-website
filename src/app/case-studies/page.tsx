import CaseStudies from "@/components/CaseStudies";
import CTA from "@/components/CTA";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies | Trisage Marketing",
  description: "Discover how we've helped leading brands achieve unprecedented growth and ROI.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <div className="pt-32 pb-8 bg-gradient-to-b from-primary-50/50 dark:from-gray-900 to-white dark:to-gray-950 transition-colors duration-300 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Client Success</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Real results. Measurable growth. Discover how we partner with brands to scale.
          </p>
        </div>
      </div>
      <CaseStudies />
      <CTA />
    </>
  );
}
