import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;

  const { data: requests, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      leave_types (id, name, code)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, requests });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const body = await req.json().catch(() => ({}));

  // Support both camelCase and snake_case inputs
  const startDate = body.startDate || body.start_date;
  const endDate = body.endDate || body.end_date;
  const reason = body.reason;
  let leaveTypeId = body.leaveTypeId || body.leave_type_id;

  if (!startDate || !endDate || !reason?.trim()) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: startDate, endDate, reason' },
      { status: 400 }
    );
  }

  // If no leaveTypeId provided, default to Unpaid Leave (LOP - code 'UL') as per SOP
  if (!leaveTypeId) {
    const { data: ulType } = await supabase
      .from('leave_types')
      .select('id')
      .eq('code', 'UL')
      .maybeSingle();

    if (ulType?.id) {
      leaveTypeId = ulType.id;
    } else {
      // Fallback: fetch any available leave type
      const { data: anyType } = await supabase
        .from('leave_types')
        .select('id')
        .limit(1)
        .maybeSingle();

      leaveTypeId = anyType?.id;
    }
  }

  if (!leaveTypeId) {
    return NextResponse.json(
      { success: false, error: 'Unpaid Leave (UL) type not configured in database' },
      { status: 500 }
    );
  }

  // Calculate total days
  const startMs = new Date(startDate).getTime();
  const endMs = new Date(endDate).getTime();

  if (isNaN(startMs) || isNaN(endMs)) {
    return NextResponse.json(
      { success: false, error: 'Invalid start_date or end_date format' },
      { status: 400 }
    );
  }

  if (endMs < startMs) {
    return NextResponse.json(
      { success: false, error: 'End date cannot be earlier than start date' },
      { status: 400 }
    );
  }

  const calculatedDays = Number(body.total_days || body.totalDays) ||
    Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

  // Insert leave request into database (enforces status = 'pending')
  const { data: newRequest, error } = await supabase
    .from('leave_requests')
    .insert({
      user_id: user.id,
      leave_type_id: leaveTypeId,
      start_date: startDate,
      end_date: endDate,
      total_days: calculatedDays,
      reason: reason.trim(),
      status: 'pending',
    })
    .select(`
      *,
      leave_types(id, name, code)
    `)
    .single();

  if (error) {
    console.error('Leave Request Insert Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Unpaid Leave (LOP) application submitted successfully for HR approval',
    request: newRequest,
  });
}
