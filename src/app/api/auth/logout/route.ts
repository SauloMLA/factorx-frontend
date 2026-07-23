import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refresh_token')?.value;

    if (refreshToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `refresh_token=${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });
    }

    const response = NextResponse.json({ message: 'Sesión cerrada' });

    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');

    return response;
  } catch {
    const response = NextResponse.json({ message: 'Sesión cerrada' });
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }
}
