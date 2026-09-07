import CTA from "@/components/CTA";
import type { Metadata } from "next";
import { getAllPublishedPosts, getAllCategories } from "@/lib/blog/data";
import BlogLayout from "@/components/blog/BlogLayout";

export const metadata: Metadata = {
  title: "Insights & Strategy | Trisage Marketing",
  description: "Expert perspectives on performance marketing, conversion optimization, and scaling B2B growth.",
};

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
