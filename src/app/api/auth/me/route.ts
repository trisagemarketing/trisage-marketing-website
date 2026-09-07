import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;

  const { data: fullProfile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(id, name, code)
    `)
    .eq('id', user.id)
    .single();

  if (error || !fullProfile) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    user: fullProfile,
  });
}
