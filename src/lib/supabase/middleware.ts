/* eslint-disable @typescript-eslint/no-unused-vars */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30; // 30 Days

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge: THIRTY_DAYS_IN_SECONDS,
              sameSite: 'lax',
              path: '/',
            })
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isHrOrAdmin = false;
  if (user) {
    const metaRole = user.user_metadata?.role;
    if (metaRole === 'hr' || metaRole === 'admin') {
      isHrOrAdmin = true;
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role === 'hr' || profile?.role === 'admin') {
        isHrOrAdmin = true;
      }
    }
  }

  // Protection logic: if accessing /admin (except /admin/login) and not authenticated as HR/Admin, redirect to /admin/login.
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    if (!user || !isHrOrAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // If the user is logged in as valid HR/Admin and tries to access /admin/login, redirect directly to /admin/dashboard.
  if (
    request.nextUrl.pathname.startsWith('/admin/login') &&
    user &&
    isHrOrAdmin
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
