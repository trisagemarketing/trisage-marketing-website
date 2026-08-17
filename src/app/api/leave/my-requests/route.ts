import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;

  const { data: requests, error } = await supabase
    .from('leave_requests')
    .select(`
      *,
      leave_type:leave_types(id, name, code),
      reviewer:profiles!reviewer_id(id, full_name, email)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    count: requests?.length || 0,
    requests: requests || [],
  });
}
