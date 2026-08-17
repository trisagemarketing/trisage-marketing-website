import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Fetch complete profile from Supabase including department details & avatar_url
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, employee_id, avatar_url, is_active, department_id, departments(code, name)')
    .eq('id', user.id)
    .single();

  if (profileErr || !profile) {
    return NextResponse.json(
      { success: false, error: profileErr?.message || 'Employee profile not found in Supabase' },
      { status: 404 }
    );
  }

  // 2. Fetch Today's Attendance Record
  const { data: record, error: attendanceErr } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .eq('work_date', todayStr)
    .maybeSingle();

  if (attendanceErr) {
    return NextResponse.json(
      { success: false, error: attendanceErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    today: todayStr,
    profile,
    status: !record
      ? 'not_checked_in'
      : !record.check_out_time
      ? 'checked_in'
      : 'checked_out',
    record: record || null,
  });
}
