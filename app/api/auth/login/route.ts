import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    const cookieStore = await cookies();
    const setCookie = apiRes.headers['set-cookie'];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        const parts = cookieStr.split(';').map(p => p.trim());
        const nameValue = parts[0];
        if (!nameValue) continue;

        const equalsIndex = nameValue.indexOf('=');
        if (equalsIndex === -1) continue;

        const name = nameValue.substring(0, equalsIndex).trim();
        const value = nameValue.substring(equalsIndex + 1).trim();

        const options: any = {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        };

        if (name && value) {
          cookieStore.set(name, value, options);
        }
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    cookieStore.set('session', 'true', { path: '/', httpOnly: true, maxAge: 60 * 60 * 24 });
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 401 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
