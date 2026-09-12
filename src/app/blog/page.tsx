import CTA from "@/components/CTA";
import type { Metadata } from "next";
import { getAllPublishedPosts, getAllCategories } from "@/lib/blog/data";
import BlogLayout from "@/components/blog/BlogLayout";

export const metadata: Metadata = {
  title: "Hospitality Marketing Insights & Strategy | Trisage Marketing",
  description: "Expert perspectives on hotel SEO, direct booking strategies, hospitality performance marketing, and scaling hotel revenue growth.",
  alternates: {
    canonical: "https://trisagemarketing.com/blog",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const blogs = await getAllPublishedPosts();
  const dbCategories = await getAllCategories();

  return (
    <main className="min-h-screen bg-white dark:bg-[#050b14] font-rubik relative overflow-hidden">
      <BlogLayout initialBlogs={blogs} dbCategories={dbCategories} />
      <CTA />
    </main>
  );
}
