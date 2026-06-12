import Hero from "@/components/Hero";
import MissionVision from "@/components/MissionVision";
import WhyChooseUs from "@/components/WhyChooseUs";

import Testimonials from "@/components/Testimonials";
import CaseStudies from "@/components/CaseStudies";
import Process from "@/components/Process";
import FAQ from "@/components/FAQ";
import OurClients from "@/components/OurClients";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionVision />
      <WhyChooseUs />

      <Testimonials />
      <CaseStudies />
      <Process />
      <OurClients />
      <FAQ />
      <CTA />
    </>
  );
}
