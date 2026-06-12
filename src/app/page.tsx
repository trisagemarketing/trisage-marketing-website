import Hero from "@/components/Hero";
import MissionVision from "@/components/MissionVision";
import HomeServices from "@/components/HomeServices";
import WhyChooseUs from "@/components/WhyChooseUs";

import Testimonials from "@/components/Testimonials";
import CaseStudies from "@/components/CaseStudies";
import FAQ from "@/components/FAQ";
import OurClients from "@/components/OurClients";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionVision />
      <HomeServices />
      <WhyChooseUs />

      <Testimonials />
      <CaseStudies />
      <OurClients />
      <FAQ />
      <CTA />
    </>
  );
}
