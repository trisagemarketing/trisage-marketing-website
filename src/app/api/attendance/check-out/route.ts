import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const body = await req.json().catch(() => ({}));
  const { location, notes } = body;

  // Calculate local date string in Asia/Kolkata timezone
  const nowInIndia = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const year = nowInIndia.getFullYear();
  const month = String(nowInIndia.getMonth() + 1).padStart(2, '0');
  const day = String(nowInIndia.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  // 1. Fetch active session for today
  const { data: activeRecord, error: fetchError } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('work_date', todayStr)
    .maybeSingle();

  if (fetchError || !activeRecord) {
    return NextResponse.json(
      { success: false, error: 'No check-in record found for today. Please check in first.' },
      { status: 404 }
    );
  }

  if (activeRecord.check_out_time) {
    return NextResponse.json(
      { success: false, error: 'You have already checked out for today', record: activeRecord },
      { status: 409 }
    );
  }

  // 2. Perform Atomic Check-Out (Conditioned on check_out_time IS NULL to prevent double-checkout race condition)
  const nowIso = new Date().toISOString();
  const { data: updatedRecord, error: updateError } = await supabase
    .from('attendance_records')
    .update({
      check_out_time: nowIso,
      location_check_out: location || activeRecord.location_check_out,
      notes: notes ? `${activeRecord.notes || ''} [Check-out note: ${notes}]`.trim() : activeRecord.notes,
    })
    .eq('id', activeRecord.id)
    .is('check_out_time', null)
    .select('*')
    .maybeSingle();

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  if (!updatedRecord) {
    // Race condition caught: another thread checked out a millisecond earlier
    const { data: latestRecord } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('id', activeRecord.id)
      .single();

    return NextResponse.json(
      { success: false, error: 'You have already checked out for today', record: latestRecord },
      { status: 409 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Checked out successfully',
    record: updatedRecord,
  });
}
