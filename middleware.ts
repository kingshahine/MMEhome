import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const authCookie = request.cookies.get('admin_auth')
  if (authCookie?.value === process.env.ADMIN_PASSWORD) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  const loginUrl = new URL('/admin/login', request.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
