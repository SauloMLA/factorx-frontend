import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token no encontrado' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      const response = NextResponse.json({ message: data.message || 'Token inválido' }, { status: res.status });
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    const response = NextResponse.json({
      user: data.user,
      accessToken: data.accessToken,
    });

    response.cookies.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    if (data.refreshToken) {
      response.cookies.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch {
    return NextResponse.json({ message: 'Error de conexión' }, { status: 500 });
  }
}
