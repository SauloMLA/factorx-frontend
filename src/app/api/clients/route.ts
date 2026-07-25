import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005').replace(/\/$/, '');

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get('access_token')?.value ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  );
}

export async function GET(req: NextRequest) {
  try {
    const accessToken = getToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/clientes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Error al obtener clientes' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error de conexión con el backend' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = getToken(req);
    const body = await req.json();

    const res = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Error al registrar cliente' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error de conexión con el backend' }, { status: 500 });
  }
}
