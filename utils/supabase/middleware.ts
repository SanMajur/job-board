//utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // ROUTE GUARD: Employer Dashboard Protection
  if (url.pathname.startsWith('/dashboard/employer')) {
    if (!user) {
      url.pathname = '/login'
      url.searchParams.set('error', 'Please log in to access the employer dashboard')
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // ROUTE GUARD: Candidate Dashboard Protection
  if (url.pathname.startsWith('/dashboard/candidate')) {
    if (!user) {
      url.pathname = '/login'
      url.searchParams.set('error', 'Please log in to access your applications')
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // REDIRECT AUTHENTICATED USERS AWAY FROM LOGIN/SIGNUP
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}