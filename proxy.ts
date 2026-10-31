import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;

  let accessToken = cookies.get('accessToken')?.value;
  const refreshToken = cookies.get('refreshToken')?.value;

  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await checkSession();
      const res = NextResponse.next();
      return res;
    } catch (e) {}
  }

  const isAuthenticated = !!accessToken || !!refreshToken;
  const isPrivateRoute = privateRoutes.some(route => nextUrl.pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => nextUrl.pathname.startsWith(route));

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
