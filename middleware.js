import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/dashboard') && token && token.role === 'user') {
    return NextResponse.redirect(new URL('/user/dashboard', req.url))
  }

  if (pathname === '/user/dashboard' && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/user/dashboard' && token && token.role !== 'user') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect logged-in users away from login and signup pages
  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/user/dashboard'],
}
