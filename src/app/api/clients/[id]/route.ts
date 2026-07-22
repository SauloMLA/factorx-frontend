import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    
    const client = await prisma.clientRecord.findUnique({
      where: { id },
    });

    if (!client) {
      return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      id: client.id,
      rfc: client.rfc,
      name: client.name,
      email: client.email,
      status: client.status,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar cliente en BFF: ' + error.message },
      { status: 500 }
    );
  }
}
