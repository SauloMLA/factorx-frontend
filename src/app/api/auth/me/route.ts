import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function GET(req: NextRequest) {
  try {
    let accessToken = req.cookies.get('access_token')?.value;
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Si expiró el access_token pero tenemos refresh_token, intentamos refrescarlo automáticamente
    if (!accessToken && refreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refresh_token=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        const response = NextResponse.json({ message: 'Sesión expirada' }, { status: 401 });
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
      }

      const refreshData = await refreshRes.json();
      accessToken = refreshData.accessToken;
    }

    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.message || 'Error de sesión' }, { status: res.status });
    }

    const response = NextResponse.json({ user: data, accessToken });

    if (accessToken) {
      const isProd = process.env.NODE_ENV === 'production';
      response.cookies.set('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: 15 * 60,
      });
    }

    return response;
  } catch {
    return NextResponse.json({ message: 'Error de conexión' }, { status: 500 });
  }
}
