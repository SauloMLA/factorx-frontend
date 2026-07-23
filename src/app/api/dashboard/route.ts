import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/dashboard/metrics`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // Deshabilitamos el caché de Next.js para asegurar datos en tiempo real
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Error al obtener métricas del dashboard' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error de conexión con el backend' }, { status: 500 });
  }
}
