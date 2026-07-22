import Link from 'next/link';
import { ArrowRight, Layers, CreditCard, ShieldCheck, Users, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import ClientStatusBadge from '@/components/clients/status-badge';
import ApproveClientDialog from '@/components/clients/approve-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Obligar a Next.js a no cachear estáticamente la página, garantizando datos en tiempo real
export const revalidate = 0;

export default async function DashboardPage() {
  // 1. Consultas a la base de datos SQLite de forma directa en el Servidor (BFF)
  const totalOperations = await prisma.operationRecord.count();
  
  const aggregates = await prisma.operationRecord.aggregate({
    _sum: {
      totalAmount: true,
      advancedAmount: true,
      commission: true,
    },
  });

  const totalClients = await prisma.clientRecord.count();
  const approvedClients = await prisma.clientRecord.count({ where: { status: 'APPROVED' } });
  const pendingClients = await prisma.clientRecord.count({ where: { status: 'PENDING' } });

  // Obtener operaciones recientes con información del cliente
  const recentOperations = await prisma.operationRecord.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      client: true,
    },
  });

  // Obtener clientes pendientes de aprobación
  const pendingApprovalClients = await prisma.clientRecord.findMany({
    where: { status: 'PENDING' },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const formattedTotalVolume = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
    aggregates._sum.totalAmount ?? 0
  );
  
  const formattedCommissions = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
    aggregates._sum.commission ?? 0
  );

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Ejecutivo</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Panel de control de originación de factoraje y administración de mesa de control.
        </p>
      </div>

      {/* Grid de KPIs Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volumen Originado</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">{formattedTotalVolume}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Comisiones Netas</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 font-mono">{formattedCommissions}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operaciones Fondeadas</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalOperations}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardContent className="pt-6 flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Clientes (Apr / Pend)</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {approvedClients} <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">/ {pendingClients}</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Paneles de Detalle y Acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mesa de Control: Aprobaciones Pendientes */}
        <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Mesa de Control
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Clientes registrados pendientes de aprobación formal para operar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApprovalClients.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-55" />
                No hay aprobaciones pendientes en este momento.
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 dark:border-[#1e293b]/20 rounded-lg">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-[#111625]">
                    <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/20 hover:bg-transparent">
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-2">Cliente</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-2">RFC</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-2 text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovalClients.map((client) => (
                      <TableRow key={client.id} className="border-b border-slate-100 dark:border-[#1e293b]/10 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1e293b]/5">
                        <TableCell className="font-semibold text-slate-900 dark:text-white py-2">{client.name}</TableCell>
                        <TableCell className="font-mono text-slate-500 dark:text-slate-400 py-2 text-xs">{client.rfc}</TableCell>
                        <TableCell className="text-right py-2">
                          <ApproveClientDialog
                            clientId={client.id}
                            clientName={client.name}
                            clientRfc={client.rfc}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Últimas Originaciones */}
        <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-slate-900 dark:text-white text-base font-bold flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Actividad Reciente
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Últimas operaciones de factoraje originadas en la plataforma.
              </CardDescription>
            </div>
            <Link href="/operaciones">
              <Button size="sm" variant="ghost" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 gap-1.5 p-0">
                Ver todo <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOperations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No se han originado operaciones de factoraje todavía.
              </div>
            ) : (
              <div className="overflow-hidden border border-slate-200 dark:border-[#1e293b]/20 rounded-lg">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-[#111625]">
                    <TableRow className="border-b border-slate-200 dark:border-[#1e293b]/20 hover:bg-transparent">
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-2">Cliente</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-2">Monto Neto</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400 font-semibold py-2 text-right">Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOperations.map((op) => (
                      <TableRow key={op.id} className="border-b border-slate-100 dark:border-[#1e293b]/10 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1e293b]/5">
                        <TableCell className="font-semibold text-slate-900 dark:text-white py-2 truncate max-w-[150px]">
                          {op.client.name}
                        </TableCell>
                        <TableCell className="font-mono text-emerald-600 dark:text-emerald-400 py-2 text-xs">
                          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(op.depositAmount)}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 text-right py-2 text-xs">
                          {new Date(op.createdAt).toLocaleDateString('es-MX', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
