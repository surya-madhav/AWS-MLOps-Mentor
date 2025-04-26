import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export async function middleware(request: NextRequest) {
  const session = await auth(request);

  // Redirect root to dashboard for authenticated users
  if (session && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/:id',
    '/api/:path*',
    '/login',
    '/register',
    '/dashboard',
    '/chat',
    '/chat/api/:path*',
    '/chat/:path*',
  ],
};
