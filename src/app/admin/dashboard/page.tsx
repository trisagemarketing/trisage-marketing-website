import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Users, Mail, TrendingUp, Calendar, UserPlus, LucideIcon } from "lucide-react";
import MessagesTableBody from "@/components/admin/MessagesTableBody";

// Map database string names to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  Mail,
  Users,
  TrendingUp,
  Calendar,
  UserPlus,
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch manual stats from the database
  const { data: dbStats, error } = await supabase
    .from('dashboard_metrics')
    .select('*')
    .order('id', { ascending: true });

  // Fetch ALL actual leads to calculate real-time stats
  const { data: leads } = await supabase
    .from('contact_messages')
    .select('*');

  // Fetch ALL real visitors to calculate analytics
  const { data: visitors } = await supabase
    .from('website_visitors')
    .select('created_at');

  if (error) {
    // Return the error directly to the screen so we can see exactly what Supabase is complaining about
    // without triggering the Next.js red screen of death.
    return (
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-3xl">🚨</span> Database Connection Error
          </h2>
          <p className="text-lg mb-4">Supabase rejected the query. Here is the exact reason from the database:</p>
          <pre className="bg-white p-6 rounded-xl border border-red-100 overflow-x-auto font-mono text-sm shadow-inner text-red-600">
            {JSON.stringify(error, null, 2)}
          </pre>
          <div className="mt-6 text-sm text-red-700 bg-red-100/50 p-4 rounded-lg">
            <strong>Diagnostic Check:</strong> Does the table <code>dashboard_metrics</code> exist? Did you run the SQL script in the correct Supabase project?
          </div>
        </div>
      </div>
    );
  }

  // --- REAL-TIME CALCULATION ENGINE ---
  const totalLeads = leads?.length || 0;
  
  // Calculate Day-over-Day (Today vs Yesterday) growth
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const currentToday = leads?.filter(l => new Date(l.created_at) >= startOfToday).length || 0;
  const prevYesterday = leads?.filter(l => {
    const d = new Date(l.created_at);
    return d >= startOfYesterday && d < startOfToday;
  }).length || 0;

  let liveTrend = "+0%";
  if (prevYesterday === 0 && currentToday > 0) {
    // If you had 0 yesterday and got leads today, user requested this to show as 100% growth
    liveTrend = "+100%"; 
  } else if (prevYesterday > 0) {
    const growth = Math.round(((currentToday - prevYesterday) / prevYesterday) * 100);
    liveTrend = growth >= 0 ? `+${growth}%` : `${growth}%`;
  }

  // Calculate live Website Visitors mathematically exactly like Leads
  const totalVisitors = visitors?.length || 0;
  
  const visitorsToday = visitors?.filter(v => new Date(v.created_at) >= startOfToday).length || 0;
  const visitorsYesterday = visitors?.filter(v => {
    const d = new Date(v.created_at);
    return d >= startOfYesterday && d < startOfToday;
  }).length || 0;

  let visitorTrend = "+0%";
  if (visitorsYesterday === 0 && visitorsToday > 0) {
    visitorTrend = "+100%";
  } else if (visitorsYesterday > 0) {
    const vGrowth = Math.round(((visitorsToday - visitorsYesterday) / visitorsYesterday) * 100);
    visitorTrend = vGrowth >= 0 ? `+${vGrowth}%` : `${vGrowth}%`;
  }

  // Calculate live Meetings Booked natively!
  const totalMeetings = leads?.filter(l => l.meeting_booked).length || 0;
  
  let conversionRateStr = "0.0%";
  if (totalLeads > 0) {
    const rate = (totalMeetings / totalLeads) * 100;
    conversionRateStr = rate.toFixed(1) + "%";
  }

  // Map DB stats, but intercept and inject LIVE data for the cards
  const stats = dbStats && dbStats.length > 0 ? dbStats.map(stat => {
    // Inject live leads calculation
    if (stat.title === "Total Leads" || stat.title === "Total Messages") {
      return {
        name: "Total Leads",
        value: totalLeads.toString(),
        change: liveTrend,
        icon_name: "UserPlus"
      };
    }
    // Inject live visitors calculation
    if (stat.title === "Website Visitors") {
      return {
        name: "Website Visitors",
        value: totalVisitors.toLocaleString(),
        change: visitorTrend,
        icon_name: "Users"
      };
    }
    // Inject live conversion rate calculation
    if (stat.title === "Conversion Rate") {
      return {
        name: "Conversion Rate",
        value: conversionRateStr,
        change: "+0%", // Hardcoded since historical meetings aren't tracked
        icon_name: "TrendingUp"
      };
    }
    // Inject live meetings booked calculation
    if (stat.title === "Meetings Booked") {
      return {
        name: "Meetings Booked",
        value: totalMeetings.toString(),
        change: "+0%",
        icon_name: "Calendar"
      };
    }
    // Pass through other manual metrics
    return {
      name: stat.title,
      value: stat.value,
      change: stat.trend,
      icon_name: stat.icon_name
    };
  }) : [
    { name: "Total Leads", value: totalLeads.toString(), change: liveTrend, icon_name: "UserPlus" },
    { name: "Website Visitors", value: totalVisitors.toLocaleString(), change: visitorTrend, icon_name: "Users" },
    { name: "Conversion Rate", value: conversionRateStr, change: "+0%", icon_name: "TrendingUp" },
    { name: "Meetings Booked", value: totalMeetings.toString(), change: "+0%", icon_name: "Calendar" },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Welcome back
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          You are authenticated securely as <span className="font-semibold text-gray-900 dark:text-white">{user.email || "Admin"}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => {
          const Icon = iconMap[stat.icon_name] || Mail;
          // Bulletproof check to prevent crashes if DB returns null or numbers
          const safeChange = String(stat.change || "");
          const isPositive = safeChange.startsWith("+");
          return (
            <div key={index} className="relative group bg-white/60 dark:bg-[#0a1220]/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/50 dark:border-white/5 hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1">
              {/* Subtle top gradient line on hover */}
              <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-primary-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 bg-linear-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-2xl shadow-inner">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${isPositive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"}`}>
                  {safeChange}
                </div>
              </div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-1 tracking-wider">{stat.name}</h3>
              <p className="text-[clamp(1.5rem,5vw,1.875rem)] font-bold text-gray-900 dark:text-white tracking-tight">
                {(() => {
                  const val = stat.value;
                  if (typeof val === 'string' && val.includes('%')) return val;
                  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
                  if (isNaN(num)) return val;
                  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
                })()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Contact Messages Data Table */}
      <div className="md:bg-white/60 md:dark:bg-[#0a1220]/60 md:backdrop-blur-xl md:rounded-4xl md:border border-gray-200/50 md:dark:border-white/5 md:shadow-2xl overflow-hidden">
        <div className="p-2 sm:p-4 md:p-10 border-b border-gray-200/50 dark:border-white/5 flex justify-between items-center mb-4 md:mb-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">Recent Inquiries</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Review and manage contact form submissions.</p>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50/30 dark:bg-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <MessagesTableBody limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
