import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export async function middleware(request: NextRequest) {
  // Check if the path is public (login or register)
  const isPublicPath = ['/login', '/register'].includes(request.nextUrl.pathname);

  // Get user session
  const session = await auth(request as any);

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
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
