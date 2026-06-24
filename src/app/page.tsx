import Hero from "@/components/Hero";
import MissionVision from "@/components/MissionVision";
import HomeServices from "@/components/HomeServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CaseStudies from "@/components/CaseStudies";
import FAQ from "@/components/FAQ";
import OurClients from "@/components/OurClients";
import HomeBlog from "@/components/HomeBlog";
import CTA from "@/components/CTA";
import HomeBackground from "@/components/HomeBackground";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: recentPosts, error } = await supabase
    .from("blogs")
    .select("id, slug, title, excerpt, category, cover_image, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Supabase Error on Homepage:", error.message, error.hint);
  }

  return (
    <main className="relative min-h-screen bg-[#fefcf8] dark:bg-[#050b14] ">

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
        <HomeBlog recentPosts={recentPosts || []} />
        <FAQ />
        <CTA />
      </div>
    </main>
  );
}
