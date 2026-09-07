import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const limit = parseInt(searchParams.get('limit') || '30', 10);

  let query = supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .order('work_date', { ascending: false })
    .limit(limit);

  if (startDate) {
    query = query.gte('work_date', startDate);
  }
  if (endDate) {
    query = query.lte('work_date', endDate);
  }

  const { data: records, error } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    count: records?.length || 0,
    history: records || [],
    records: records || [],
  });
}
