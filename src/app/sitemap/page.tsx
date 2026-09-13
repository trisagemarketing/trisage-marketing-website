import { Metadata } from "next";
import { services } from "@/data/services";
import { getAllPublishedPosts } from "@/lib/blog/data";
import SitemapClient, { SitemapItem } from "./SitemapClient";

export const metadata: Metadata = {
  title: "HTML Sitemap & Navigation Directory | Trisage Marketing",
  description:
    "Explore all canonical pages, core hospitality marketing services, case studies, and industry resources from Trisage Marketing.",
  alternates: {
    canonical: "https://trisagemarketing.com/sitemap",
  },
  openGraph: {
    title: "HTML Sitemap & Navigation Directory | Trisage Marketing",
    description:
      "Explore all canonical pages, core hospitality marketing services, case studies, and industry resources from Trisage Marketing.",
    url: "https://trisagemarketing.com/sitemap",
    siteName: "Trisage Marketing",
    type: "website",
  },
};

export const revalidate = 3600; // 1 hour ISR

export default async function SitemapPage() {
  const baseUrl = "https://trisagemarketing.com";

  // Core static routes
  const staticItems: SitemapItem[] = [
    {
      title: "Home — Hospitality Digital Marketing Agency",
      url: baseUrl,
      category: "Core",
      priority: "1.0",
      changeFreq: "weekly",
    },
    {
      title: "About Trisage Marketing",
      url: `${baseUrl}/about`,
      category: "Core",
      priority: "0.8",
      changeFreq: "monthly",
    },
    {
      title: "Hospitality Marketing Services Hub",
      url: `${baseUrl}/services`,
      category: "Core",
      priority: "0.9",
      changeFreq: "weekly",
    },
    ...services.map((s) => ({
      title: s.title,
      url: `${baseUrl}/services/${s.slug}`,
      category: "Service" as const,
      priority: "0.8",
      changeFreq: "weekly",
    })),
    {
      title: "Our Methodology — Data-Driven Hospitality Growth",
      url: `${baseUrl}/methodology`,
      category: "Core",
      priority: "0.8",
      changeFreq: "monthly",
    },
    {
      title: "Case Studies & Client Proof",
      url: `${baseUrl}/case-studies`,
      category: "Case Study",
      priority: "0.7",
      changeFreq: "weekly",
    },
    {
      title: "Villasita Resort Haridwar — Case Study",
      url: `${baseUrl}/case-studies/villasita-resort-haridwar`,
      category: "Case Study",
      priority: "0.9",
      changeFreq: "weekly",
    },
    {
      title: "Hotel & Resort Clients",
      url: `${baseUrl}/clients`,
      category: "Case Study",
      priority: "0.6",
      changeFreq: "monthly",
    },
    {
      title: "Hospitality Marketing Blog & Insights",
      url: `${baseUrl}/blog`,
      category: "Blog",
      priority: "0.8",
      changeFreq: "weekly",
    },
    {
      title: "Contact Our Hospitality Team",
      url: `${baseUrl}/contact`,
      category: "Core",
      priority: "0.7",
      changeFreq: "monthly",
    },
    {
      title: "Privacy Policy",
      url: `${baseUrl}/privacy`,
      category: "Legal",
      priority: "0.3",
      changeFreq: "yearly",
    },
    {
      title: "Terms and Conditions",
      url: `${baseUrl}/terms-and-conditions`,
      category: "Legal",
      priority: "0.3",
      changeFreq: "yearly",
    },
  ];

  let blogItems: SitemapItem[] = [];
  try {
    const posts = await getAllPublishedPosts();
    blogItems = posts.map((post) => ({
      title: post.title,
      url: `${baseUrl}/blog/${post.slug}`,
      category: "Blog" as const,
      priority: "0.8",
      changeFreq: "weekly",
    }));
  } catch {
    // Fallback gracefully
  }

  const allItems = [...staticItems, ...blogItems];

  return <SitemapClient items={allItems} />;
}
