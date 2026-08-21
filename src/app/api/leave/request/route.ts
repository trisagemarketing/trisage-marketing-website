import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';
import { EmailService } from '@/lib/services/emailService';

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

  // 2. Check for overlapping active leave requests for the same employee
  const { data: overlappingLeave } = await supabase
    .from('leave_requests')
    .select('id, start_date, end_date, status')
    .eq('user_id', user.id)
    .lte('start_date', endDate)
    .gte('end_date', startDate)
    .neq('status', 'rejected')
    .maybeSingle();

  if (overlappingLeave) {
    return NextResponse.json(
      {
        success: false,
        error: `You already have an active leave request (${overlappingLeave.start_date} to ${overlappingLeave.end_date}) overlapping these dates.`,
        request: overlappingLeave,
      },
      { status: 409 }
    );
  }

  // 3. Insert leave request into database (enforces status = 'pending')
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

    // Postgres Unique Constraint / Duplicate Key Error (Code 23505)
    if (error.code === '23505' || error.message?.includes('duplicate')) {
      return NextResponse.json(
        {
          success: false,
          error: 'An active leave request for these dates has already been submitted.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // 4. Trigger Automated Email Notification to HR (Non-blocking async dispatch)
  (async () => {
    try {
      // Fetch employee profile details
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('full_name, employee_id, email')
        .eq('id', user.id)
        .maybeSingle();

      // Fetch all HR emails from profiles table
      const { data: hrProfiles } = await supabase
        .from('profiles')
        .select('email')
        .in('role', ['hr', 'admin']);

      const hrEmails = hrProfiles?.map((h) => h.email).filter(Boolean) as string[] || [];
      const leaveTypeName = (newRequest as { leave_types?: { name?: string } })?.leave_types?.name || 'Unpaid Leave (LOP)';

      await EmailService.sendLeaveApplicationToHR({
        employeeName: userProfile?.full_name || user.email || 'Employee',
        employeeId: userProfile?.employee_id || 'TR-EMP',
        employeeEmail: userProfile?.email || user.email || undefined,
        leaveTypeName,
        startDate: String(startDate),
        endDate: String(endDate),
        totalDays: Number(calculatedDays),
        reason: String(reason).trim(),
        hrEmails,
      });
    } catch (emailErr) {
      console.error('Failed to trigger HR email notification async:', emailErr);
    }
  })();

  return NextResponse.json({
    success: true,
    message: 'Unpaid Leave (LOP) application submitted successfully for HR approval',
    request: newRequest,
  });
}
