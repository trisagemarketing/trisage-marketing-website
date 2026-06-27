import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MessagesTableBody from "@/components/admin/MessagesTableBody";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Murphy's Law: We don't fetch data here, the MessagesTableBody handles its own fetching and error boundary.
  // This page simply provides the UI shell for the Master CRM list.

  return (
    <div className="p-4 sm:p-6 md:p-12 w-full max-w-full">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
          Master Lead Database
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          View and manage the complete history of every lead acquired.
        </p>
      </div>

      <div className="md:bg-white/60 md:dark:bg-[#0a1220]/60 md:backdrop-blur-xl md:rounded-[2rem] md:border border-gray-200/50 md:dark:border-white/5 md:shadow-2xl overflow-hidden">
        <div className="p-2 sm:p-4 md:p-10 border-b border-gray-200/50 dark:border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 md:mb-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">All Inquiries</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Showing all contact form submissions and booked meetings.</p>
          </div>
        </div>
        
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50/30 dark:bg-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <MessagesTableBody />
          </div>
        </div>
      </div>
    </div>
  );
}
