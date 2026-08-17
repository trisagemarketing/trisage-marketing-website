import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET(req: NextRequest) {
  // Requires HR or Admin privileges
  const auth = await requireAuth(['hr', 'admin']);
  if (!auth.success) return auth.response;

  const { supabase } = auth;
  const { searchParams } = new URL(req.url);

  const workDate = searchParams.get('date');
  const departmentId = searchParams.get('department_id');
  const userId = searchParams.get('user_id');
  const limit = parseInt(searchParams.get('limit') || '100', 10);

  let query = supabase
    .from('attendance_records')
    .select(`
      *,
      employee:profiles(id, full_name, email, employee_id, department_id, avatar_url)
    `)
    .order('work_date', { ascending: false })
    .limit(limit);

  if (workDate) {
    query = query.eq('work_date', workDate);
  }
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data: records, error } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // Optional in-memory filter by department_id if specified
  let filteredRecords = records || [];
  if (departmentId) {
    filteredRecords = filteredRecords.filter(
      (r) => r.employee?.department_id === departmentId
    );
  }

  return NextResponse.json({
    success: true,
    count: filteredRecords.length,
    records: filteredRecords,
  });
}
