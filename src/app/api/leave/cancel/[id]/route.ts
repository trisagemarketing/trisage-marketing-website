import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { id: requestId } = await params;
  const { supabase, user } = auth;

  // 1. Fetch leave request and verify ownership and pending status
  const { data: request, error: fetchError } = await supabase
    .from('leave_requests')
    .select('*')
    .eq('id', requestId)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !request) {
    return NextResponse.json(
      { success: false, error: 'Leave request not found or not owned by you' },
      { status: 404 }
    );
  }

  if (request.status !== 'pending') {
    return NextResponse.json(
      { success: false, error: `Cannot cancel a leave request with status: '${request.status}'` },
      { status: 400 }
    );
  }

  // 2. Transition status to 'cancelled'
  const { data: updatedRequest, error: updateError } = await supabase
    .from('leave_requests')
    .update({ status: 'cancelled' })
    .eq('id', requestId)
    .select('*')
    .single();

  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Leave request cancelled successfully',
    request: updatedRequest,
  });
}
