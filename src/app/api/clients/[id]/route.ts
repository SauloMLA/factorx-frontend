import { NextRequest, NextResponse } from 'next/server';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005').replace(/\/$/, '');

function getToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get('access_token')?.value ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  );
}

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const accessToken = getToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/clientes/${id}/resumen`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Cliente no encontrado' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Error de conexión con el backend' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const accessToken = getToken(req);

    if (!accessToken) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/clientes/${id}/aprobar`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: data.message || 'Error al aprobar cliente' },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error de conexión con el backend' }, { status: 500 });
  }
}
