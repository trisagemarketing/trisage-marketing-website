/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: { fullName: string; company?: string; email: string; phone?: string; service: string | string[]; message: string; }) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        {
          full_name: formData.fullName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          service: Array.isArray(formData.service) ? formData.service : [formData.service],
          message: formData.message,
        }
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: `Supabase Error: ${error.message || JSON.stringify(error)}` };
    }

    // Since we added a new message, tell Next.js to revalidate the admin dashboard
    // so it shows up instantly for any logged-in admin.
    revalidatePath("/admin", "layout");
    return { success: true };

  } catch (err: unknown) {
    console.error("Server action error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const supabase = await createClient();
    
    // Admins only (RLS enforces this, but server action is another layer)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: `Failed to delete: ${error.message}` };
    }

    revalidatePath("/admin", "layout");
    return { success: true };

  } catch (err: unknown) {
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function markMeetingBooked(id: string) {
  try {
    const supabase = await createClient();
    
    // Admins only
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from('contact_messages')
      .update({ meeting_booked: true })
      .eq('id', id);

    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: `Failed to mark booked: ${error.message}` };
    }

    revalidatePath("/admin", "layout");
    return { success: true };

  } catch (err: unknown) {
    return { success: false, error: "An unexpected error occurred." };
  }
}
