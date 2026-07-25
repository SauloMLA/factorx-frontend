import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Error de autenticación' },
        { status: res.status },
      );
    }

    const response = NextResponse.json({
      user: data.user,
      accessToken: data.accessToken,
    });

    const isProd = process.env.NODE_ENV === 'production';
    response.cookies.set('access_token', data.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutos
    });

    if (data.refreshToken) {
      response.cookies.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 días
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Error de conexión con el servidor de autenticación' },
      { status: 500 },
    );
  }
}
