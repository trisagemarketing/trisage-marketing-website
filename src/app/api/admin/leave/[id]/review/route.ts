import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Requires HR or Admin privileges
  const auth = await requireAuth(['hr', 'admin']);
  if (!auth.success) return auth.response;

  const { id: requestId } = await params;
  const { supabase, user } = auth;
  const body = await req.json();

  const { status, review_notes } = body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json(
      { success: false, error: 'Status is required and must be either "approved" or "rejected"' },
      { status: 400 }
    );
  }

  // Update leave request status (Postgres trigger auto-logs state change in audit_logs)
  const { data: updatedRequest, error } = await supabase
    .from('leave_requests')
    .update({
      status,
      reviewer_id: user.id,
      review_notes: review_notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)
    .select(`
      *,
      leave_type:leave_types(id, name, code),
      employee:profiles!user_id(id, full_name, email)
    `)
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Leave request ${status} by HR (audit log created)`,
    request: updatedRequest,
  });
}
