import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { authConfig } from '@/app/(auth)/auth.config';

const { auth } = NextAuth(authConfig);

export default auth;

export async function middleware(request: NextRequest) {
  const session = await auth(request as any);

  // Redirect root to dashboard for authenticated users

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
