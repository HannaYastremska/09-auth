import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];

export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;

  const isAuthenticated =
    cookies.has('session') || cookies.has('auth-token') || cookies.has('connect.sid');

  const isPrivateRoute = privateRoutes.some(route => nextUrl.pathname.startsWith(route));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthenticated && (nextUrl.pathname === '/sign-in' || nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
