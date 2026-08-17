import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function POST(req: NextRequest) {
  // Security Guard: Public self-signup is disabled. Only HR or Admin can create employee accounts.
  const auth = await requireAuth(['hr', 'admin']);
  if (!auth.success) return auth.response;

  try {
    const body = await req.json();
    const email = body.email;
    const password = body.password;
    const full_name = body.full_name || body.fullName;
    const departmentCode = body.departmentCode || body.department_code || body.department_id;
    const phone = body.phone || null;
    const role = body.role || 'employee';

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, password, and full_name are mandatory' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const assignedRole = role === 'hr' || role === 'admin' ? role : 'employee';
    const adminSupabase = createAdminClient();

    // 1. Resolve or auto-create department record in `departments` table
    let deptCodeUpper = (departmentCode || 'DEV').toUpperCase().trim();
    if (assignedRole === 'hr' || assignedRole === 'admin') {
      deptCodeUpper = 'HR';
    }

    let departmentId: string | null = null;
    const { data: deptData } = await adminSupabase
      .from('departments')
      .select('id, code')
      .or(`code.ilike.${deptCodeUpper},name.ilike.${deptCodeUpper}`)
      .maybeSingle();

    if (deptData) {
      departmentId = deptData.id;
    } else {
      // Auto-insert department record if missing in Supabase
      const deptNames: Record<string, string> = {
        HR: 'Human Resources',
        DEV: 'Website Development',
        VID: 'Video Editor',
        DES: 'Graphic Designer',
        SMM: 'Social Media Marketing',
      };
      const { data: newDept } = await adminSupabase
        .from('departments')
        .insert({
          code: deptCodeUpper,
          name: deptNames[deptCodeUpper] || deptCodeUpper,
        })
        .select('id')
        .single();

      if (newDept) {
        departmentId = newDept.id;
      }
    }

    // 2. Auto-generate sequential employee_id e.g. TR-HR-001, TR-DEV-002
    const prefix = `TR-${deptCodeUpper}`;
    const { count } = await adminSupabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const sequenceNum = String((count || 0) + 1).padStart(3, '0');
    const generatedEmployeeId = `${prefix}-${sequenceNum}`;

    // 3. Create or Update user in auth.users
    let authUserId: string | null = null;
    const { data: authData, error: signupError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email for seamless EMS onboarding
      user_metadata: {
        full_name,
        role: assignedRole,
      },
    });

    if (signupError) {
      // If user already exists in Auth, locate their ID and update password & status
      const { data: listData } = await adminSupabase.auth.admin.listUsers();
      const existingUser = listData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        authUserId = existingUser.id;
        await adminSupabase.auth.admin.updateUserById(existingUser.id, {
          password,
          email_confirm: true,
          user_metadata: { full_name, role: assignedRole },
        });
      } else {
        return NextResponse.json(
          { success: false, error: signupError.message || 'Failed to create user account' },
          { status: 400 }
        );
      }
    } else if (authData?.user) {
      authUserId = authData.user.id;
    }

    if (!authUserId) {
      return NextResponse.json(
        { success: false, error: 'User authentication account creation failed' },
        { status: 400 }
      );
    }

    // 4. Upsert profile in profiles table with is_active: true
    const { data: profileData, error: profileUpdateError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: authUserId,
        email,
        full_name,
        employee_id: generatedEmployeeId,
        department_id: departmentId,
        phone,
        role: assignedRole,
        is_active: true,
      })
      .select('*')
      .single();

    if (profileUpdateError) {
      console.warn('Profile update warning:', profileUpdateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Account onboarded successfully',
      user: {
        id: authUserId,
        email,
        full_name,
        role: assignedRole,
        profile: profileData || null,
      },
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
