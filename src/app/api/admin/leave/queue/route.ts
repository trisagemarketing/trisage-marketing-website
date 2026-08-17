import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET(req: NextRequest) {
  // Requires HR or Admin privileges
  const auth = await requireAuth(['hr', 'admin']);
  if (!auth.success) return auth.response;

  const { supabase } = auth;
  const { searchParams } = new URL(req.url);

  const statusFilter = searchParams.get('status'); // e.g. 'pending', 'approved', 'rejected'
  const departmentId = searchParams.get('department_id');

  let query = supabase
    .from('leave_requests')
    .select(`
      *,
      leave_type:leave_types(id, name, code),
      employee:profiles!user_id(id, full_name, email, employee_id, department_id),
      reviewer:profiles!reviewer_id(id, full_name, email)
    `)
    .order('created_at', { ascending: false });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: requests, error } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  let filteredRequests = requests || [];
  if (departmentId) {
    filteredRequests = filteredRequests.filter(
      (r) => r.employee?.department_id === departmentId
    );
  }

  return NextResponse.json({
    success: true,
    count: filteredRequests.length,
    requests: filteredRequests,
  });
}
