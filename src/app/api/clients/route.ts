import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const clients = await prisma.clientRecord.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const mappedClients = clients.map(client => ({
      id: client.id,
      rfc: client.rfc,
      name: client.name,
      email: client.email,
      status: client.status,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    }));

    return NextResponse.json(mappedClients);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al obtener clientes desde el BFF: ' + error.message },
      { status: 500 }
    );
  }
}
