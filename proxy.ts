import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseSetCookie } from 'cookie';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = privateRoutes.some(route => nextUrl.pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => nextUrl.pathname.startsWith(route));

  if (!accessToken && refreshToken) {
    try {
      const refreshRes = await checkSession();
      const setCookieHeader = refreshRes.headers['set-cookie'];

      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        for (const cookieStr of cookieArray) {
          const parsed = parseSetCookie(cookieStr);
          if (parsed.value) {
            cookieStore.set(parsed.name, parsed.value, parsed as any);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
      }
    } catch (e) {
      if (isPrivateRoute) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  const isAuthenticated =
    !!cookieStore.get('accessToken')?.value || !!cookieStore.get('refreshToken')?.value;

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
