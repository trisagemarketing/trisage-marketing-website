import Hero from "@/components/Hero";
import MissionVision from "@/components/MissionVision";
import HomeServices from "@/components/HomeServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CaseStudies from "@/components/CaseStudies";
import FAQ from "@/components/FAQ";
import OurClients from "@/components/OurClients";
import CTA from "@/components/CTA";
import HomeBackground from "@/components/HomeBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#fefcf8] dark:bg-[#050b14] transition-colors duration-500">

      {/* ── Creative Animated Background (fixed, behind everything) ── */}
      <HomeBackground />

      {/* ── Page Content ── */}
      <div className="homepage-wrapper relative z-10">
        <Hero />
        <MissionVision />
        <HomeServices />
        <WhyChooseUs />
        <Testimonials />
        <CaseStudies />
        <OurClients />
        <FAQ />
        <CTA />
      </div>
    </main>
  );
}
