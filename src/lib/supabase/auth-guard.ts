import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface UserContext {
  id: string;
  email: string;
  role: 'employee' | 'hr' | 'admin';
  full_name: string;
  department_id: string | null;
  is_active: boolean;
}

export type GuardResult =
  | { success: true; user: UserContext; supabase: Awaited<ReturnType<typeof createClient>> }
  | { success: false; response: NextResponse };

/**
 * Defensive Security Guard (Murphy's Law Enforcement)
 * Validates authentication, active status, and required role permissions on API requests.
 */
export async function requireAuth(allowedRoles?: ('employee' | 'hr' | 'admin')[]): Promise<GuardResult> {
  try {
    const supabase = await createClient();

    // 1. Verify Authentication Token
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Unauthorized: Authentication required' },
          { status: 401 }
        ),
      };
    }

    // 2. Fetch User Profile & Active Status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, full_name, department_id, is_active')
      .eq('id', authUser.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Forbidden: Profile record not found' },
          { status: 403 }
        ),
      };
    }

    // 3. Deactivated Account Check (Murphy's Law Defense)
    if (!profile.is_active) {
      return {
        success: false,
        response: NextResponse.json(
          { success: false, error: 'Forbidden: Your account has been deactivated by HR' },
          { status: 403 }
        ),
      };
    }

    // 4. Role Guard Enforcement
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = profile.role as 'employee' | 'hr' | 'admin';
      const hasPermission = allowedRoles.includes(userRole) || userRole === 'admin';

      if (!hasPermission) {
        return {
          success: false,
          response: NextResponse.json(
            { success: false, error: `Forbidden: Requires ${allowedRoles.join(' or ')} permission` },
            { status: 403 }
          ),
        };
      }
    }

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role as 'employee' | 'hr' | 'admin',
        full_name: profile.full_name,
        department_id: profile.department_id,
        is_active: profile.is_active,
      },
      supabase,
    };
  } catch (error) {
    console.error('Auth Guard Error:', error);
    return {
      success: false,
      response: NextResponse.json(
        { success: false, error: 'Internal Server Error during security check' },
        { status: 500 }
      ),
    };
  }
}
