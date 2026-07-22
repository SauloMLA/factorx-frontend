import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    const operations = await prisma.operationRecord.findMany({
      where: clientId ? { clientId } : undefined,
      include: {
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const mappedOperations = operations.map(op => ({
      id: op.id,
      clientId: op.clientId,
      totalAmount: op.totalAmount,
      advancedAmount: op.advancedAmount,
      commission: op.commission,
      depositAmount: op.depositAmount,
      createdAt: op.createdAt.toISOString(),
      invoices: op.invoices.map(inv => ({
        id: inv.id,
        operationId: inv.operationId,
        folio: inv.folio,
        debtorRfc: inv.debtorRfc,
        debtorName: inv.debtorName,
        amount: inv.amount,
        issueDate: inv.issueDate.toISOString(),
        dueDate: inv.dueDate.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json(mappedOperations);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al obtener operaciones desde el BFF: ' + error.message },
      { status: 500 }
    );
  }
}
