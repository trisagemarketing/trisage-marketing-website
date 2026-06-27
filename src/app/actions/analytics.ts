"use server";

import { createClient } from "@/lib/supabase/server";

export async function logRealVisitor(sessionId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('website_visitors')
      .insert([{ session_id: sessionId }]);

    if (error) {
      console.error("Supabase insert error tracking visitor:", error);
      return { success: false, error: `Supabase Error: ${error.message}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Server error tracking visitor:", err);
    return { success: false, error: err.message || "Unknown error" };
  }
}
