import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase } = auth;

  const { data: leaveTypes, error } = await supabase
    .from('leave_types')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    leave_types: leaveTypes || [],
  });
}
