import { NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/validations/chatbotSchema";
import { LeadService } from "@/lib/services/leadService";

export async function POST(request: Request) {
  try {
    // 1. Parse incoming JSON
    const body = await request.json();

    // 2. Validate with Zod
    const result = leadSubmissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid lead data", details: result.error.format() },
        { status: 400 }
      );
    }

    const leadData = result.data;

    // 3. Attach metadata
    const userAgent = request.headers.get("user-agent") || undefined;
    
    // 4. Save to Database using the Service Layer
    await LeadService.saveLead({
      ...leadData,
      user_agent: userAgent,
    });

    // 5. Return success
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error("[Chatbot API] Error processing submission:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
