import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const isCMSUser = user.email?.toLowerCase() === 'trisagemarketing@gmail.com';
  if (isCMSUser) {
    redirect("/admin/cms");
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role === 'cms' || profile?.role === 'editor') {
    redirect("/admin/cms");
  }

  redirect("/admin/dashboard");
}
