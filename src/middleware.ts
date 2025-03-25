import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('next-auth.session-token');

  if (req.nextUrl.pathname === '/chat') {
    if (!sessionToken) {
      const redirectUrl = new URL('/auth/access', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/chat'],
};