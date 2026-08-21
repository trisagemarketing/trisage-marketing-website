import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Globe,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import MessagesTableBody from "@/components/admin/MessagesTableBody";

export default async function ClassicCMSPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch Blog Count
  const { count: blogCount } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true });

  // Fetch Leads Count
  const { count: leadCount } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true });

  // Fetch Recent 6 Blogs
  const { data: recentBlogs } = await supabase
    .from('blogs')
    .select('id, title, slug, created_at, category, author_name')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-500/20 border border-secondary-500/30 text-secondary-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Corporate Website Control Panel
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans">
            Website CMS & Analytics Dashboard
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
            Manage your public website content, publish marketing blogs, review incoming Contact Us lead inquiries, and monitor SEO performance.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/admin/blog/new"
            className="px-5 py-3 rounded-2xl bg-secondary-500 hover:bg-secondary-600 text-slate-900 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Blog Article
          </Link>
          <a
            href="https://trisagemarketing.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-slate-700 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" /> View Live Site
          </a>
        </div>
      </div>

      {/* KPI Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Contact Leads */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Live Leads
            </span>
          </div>
          <div>
            <span className="block text-3xl font-black text-slate-900 dark:text-white">{leadCount || 0}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Customer Inquiries</span>
          </div>
          <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-secondary-600 dark:text-secondary-400 hover:underline pt-1">
            Open Lead Database &rarr;
          </Link>
        </div>

        {/* Card 2: Blog Articles */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
              CMS Articles
            </span>
          </div>
          <div>
            <span className="block text-3xl font-black text-slate-900 dark:text-white">{blogCount || 0}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published Blog Posts</span>
          </div>
          <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-secondary-600 dark:text-secondary-400 hover:underline pt-1">
            Manage Articles &rarr;
          </Link>
        </div>

        {/* Card 3: SEO & Google Indexing */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              Indexed
            </span>
          </div>
          <div>
            <span className="block text-3xl font-black text-slate-900 dark:text-white">Active</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Google Search Indexing</span>
          </div>
          <span className="block text-xs text-slate-400 font-medium pt-1">Sitemap XML Active</span>
        </div>

        {/* Card 4: Web Vitals & Uptime */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full">
              99.9%
            </span>
          </div>
          <div>
            <span className="block text-3xl font-black text-slate-900 dark:text-white">Healthy</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Website Health & Speed</span>
          </div>
          <span className="block text-xs text-teal-500 font-bold pt-1">SSL & Edge CDN Secured</span>
        </div>
      </div>

      {/* Main Grid: Website Lead Database & Blog Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Lead Inquiries (2/3 width on desktop) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Website Contact & Lead Inquiries</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time incoming submissions from contact forms and booking widgets</p>
            </div>
            <Link href="/admin/leads" className="text-xs font-extrabold text-secondary-600 dark:text-secondary-400 hover:underline flex items-center gap-1 shrink-0">
              Full Master Database <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl p-2 border border-slate-200/60 dark:border-slate-800/60">
            <MessagesTableBody limit={6} page={1} baseUrl="/admin/leads" />
          </div>
        </div>

        {/* Right Column: Blog Articles Manager (1/3 width on desktop) */}
        <div className="bg-white dark:bg-[#1f2a3e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Blog Content</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Published articles</p>
              </div>
              <Link href="/admin/blog/new" className="p-2 rounded-xl bg-secondary-500 text-slate-900 font-extrabold hover:bg-secondary-600 transition-all">
                <Plus className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {!recentBlogs || recentBlogs.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-medium">No blog posts found.</div>
              ) : (
                recentBlogs.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white truncate block">{b.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <span className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">{b.category || 'General'}</span>
                        <span>•</span>
                        <span>{new Date(b.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/admin/blog/${b.id}`} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shrink-0">
                      Edit
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/admin/blog" className="mt-4 w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-extrabold uppercase tracking-wider text-center block transition-all">
            Manage All Blog Posts &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
