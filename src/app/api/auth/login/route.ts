import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Strict Server-Side Input Sanitization Schema
const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .email('Invalid email address format')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);

    // Validate body payload against Zod schema
    const parseResult = loginBodySchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || 'Invalid input parameters';
      return NextResponse.json(
        { success: false, error: firstError, details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;

    const supabase = await createClient();

    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !authData.user) {
      return NextResponse.json(
        { success: false, error: loginError?.message || 'Invalid login credentials' },
        { status: 401 }
      );
    }

    // Fetch user profile to verify active status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, department_id, is_active, employee_id')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    if (!profile.is_active) {
      // Sign out immediately if account is deactivated
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated by HR' },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: profile,
      session: {
        access_token: authData.session.access_token,
        expires_at: authData.session.expires_at,
      },
    });

    // Explicitly copy all Supabase session cookies onto the returned NextResponse object with 30-day Max-Age
    const cookieStore = await cookies();
    cookieStore.getAll().forEach((cookie: { name: string; value: string }) => {
      response.cookies.set(cookie.name, cookie.value, {
        maxAge: 60 * 60 * 24 * 30, // 30 Days (2,592,000s)
        sameSite: 'lax',
        path: '/',
      });
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
