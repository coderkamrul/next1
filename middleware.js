import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    console.log('Redirecting to /login')
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin))
  }

  // Redirect logged-in users away from login and signup pages
  if ((pathname === '/login' || pathname === '/signup') && token) {
    console.log('Redirecting to /dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
