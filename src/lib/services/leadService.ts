import { createAdminClient } from "@/lib/supabase/admin";
import { LeadSubmission } from "@/lib/validations/chatbotSchema";

export class LeadService {
  /**
   * Safely inserts a new lead into the Supabase database.
   * Uses the Service Role Key to bypass RLS.
   */
  static async saveLead(leadData: LeadSubmission) {
    const supabase = createAdminClient();

    // 1. Prepare data mapping for contact_messages table
    const finalMessage = leadData.message ? leadData.message : "No additional message provided.";

    const payload = {
      full_name: leadData.name,
      company: 'Chatbot Lead',
      email: leadData.email || null,
      phone: leadData.phone || null,
      service: [leadData.service],
      message: finalMessage,
      created_at: new Date().toISOString(),
    };

    // 2. Insert into Supabase 'contact_messages' table (Master CRM)
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("[LeadService] Failed to insert lead into Supabase:", error);
      throw new Error(`Database insertion failed: ${error.message || JSON.stringify(error)}`);
    }

    // 3. (Future Extension) - Send internal email notification
    // await EmailService.notifySalesTeam(data);

    // 4. (Future Extension) - Sync to CRM (HubSpot, Salesforce, etc.)
    // await CRMService.syncLead(data);

    return data;
  }
}
