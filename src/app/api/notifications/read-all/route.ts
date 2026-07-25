import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function PATCH(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Error al actualizar notificaciones' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error de conexión' }, { status: 500 });
  }
}
