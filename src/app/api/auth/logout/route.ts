import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Sign out server-side session from Supabase
    await supabase.auth.signOut();

    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

    // Explicitly delete all Supabase session cookies by setting maxAge = 0
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    allCookies.forEach((c) => {
      if (
        c.name.includes('sb-') ||
        c.name.includes('supabase') ||
        c.name.includes('auth') ||
        c.name.includes('token')
      ) {
        response.cookies.set(c.name, '', {
          maxAge: 0,
          path: '/',
          expires: new Date(0),
        });
      }
    });

    return response;
  } catch (error) {
    console.error('Logout Route Error:', error);
    const response = NextResponse.json({ success: true, message: 'Signed out' });
    const cookieStore = await cookies();
    cookieStore.getAll().forEach((c) => {
      response.cookies.set(c.name, '', { maxAge: 0, path: '/', expires: new Date(0) });
    });
    return response;
  }
}
