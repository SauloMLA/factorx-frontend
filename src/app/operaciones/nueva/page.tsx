'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar, FileSpreadsheet, AlertTriangle, BadgeAlert, ArrowLeft, ShieldAlert } from 'lucide-react';

import { useClientsQuery } from '@/hooks/useClients';
import { useCreateOperationMutation } from '@/hooks/useOperations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Helper para calcular la diferencia de días calendario exactos
const getRemainingDays = (reqDate: Date, dueDate: Date) => {
  const req = new Date(reqDate);
  req.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - req.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Esquema de validación estricto para cada Factura del lote
const invoiceSchema = z.object({
  folio: z.string().min(1, 'El Folio es obligatorio'),
  debtorRfc: z
    .string()
    .min(1, 'El RFC del deudor es obligatorio')
    .regex(/^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/i, 'RFC deudor inválido (Persona Moral 12 chars)'),
  debtorName: z.string().min(3, 'Nombre o Razón Social del deudor requerido'),
  amount: z.number().positive('El monto debe ser estrictamente mayor a cero'),
  issueDate: z.string().min(1, 'Fecha de emisión obligatoria'),
  dueDate: z.string().min(1, 'Fecha de vencimiento obligatoria'),
});

// Esquema de validación de la Operación Completa (Lote de Facturas)
const originationSchema = z
  .object({
    clientId: z.string().uuid('Selecciona un cliente aprobado'),
    requestDate: z.string().min(1, 'La fecha de solicitud es obligatoria'),
    invoices: z.array(invoiceSchema).min(1, 'Debes agregar al menos una factura al lote'),
  })
  .superRefine((data, ctx) => {
    const reqDate = new Date(data.requestDate);

    // 1. Validar duplicidad de folios en el lote actual en tiempo real
    const folios = data.invoices.map((inv) => inv.folio.trim().toUpperCase());
    const uniqueFolios = new Set(folios);
    if (uniqueFolios.size !== folios.length) {
      folios.forEach((folio, index) => {
        if (folios.indexOf(folio) !== index) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['invoices', index, 'folio'],
            message: 'Folio duplicado en este lote de facturas',
          });
        }
      });
    }

    // 2. Validar reglas de fechas por factura respecto a la fecha de solicitud
    data.invoices.forEach((invoice, index) => {
      if (invoice.issueDate && invoice.dueDate) {
        const issue = new Date(invoice.issueDate);
        const due = new Date(invoice.dueDate);

        if (issue > reqDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['invoices', index, 'issueDate'],
            message: 'La emisión no puede estar en el futuro respecto a la solicitud',
          });
        }

        if (due <= reqDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['invoices', index, 'dueDate'],
            message: 'El vencimiento debe ser posterior a la fecha de solicitud',
          });
        } else {
          // Plazo de Elegibilidad (RD-INV-003): Entre 15 y 120 días calendario
          const remainingDays = getRemainingDays(reqDate, due);
          if (remainingDays < 15 || remainingDays > 120) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['invoices', index, 'dueDate'],
              message: `El plazo restante (${remainingDays} días) debe estar estrictamente entre 15 y 120 días`,
            });
          }
        }
      }
    });
  });

type OriginationFormValues = z.infer<typeof originationSchema>;

function NewOperationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get('clientId') || '';

  const { data: clients, isLoading: isClientsLoading } = useClientsQuery();
  const createOperationMutation = useCreateOperationMutation();

  // Filtrar solo los clientes aprobados para operar
  const approvedClients = (clients || []).filter((c) => c.status === 'APPROVED');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<OriginationFormValues>({
    resolver: zodResolver(originationSchema),
    mode: 'onChange',
    defaultValues: {
      clientId: preselectedClientId,
      requestDate: new Date().toISOString().substring(0, 10), // Hoy por defecto
      invoices: [
        {
          folio: '',
          debtorRfc: '',
          debtorName: '',
          amount: 0,
          issueDate: '',
          dueDate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoices',
  });

  const watchInvoices = watch('invoices') || [];
  const selectedClientId = watch('clientId');
  const watchRequestDate = watch('requestDate');

  // Cálculos financieros en tiempo real (Invariantes RD-OP-003)
  const totalAmount = watchInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
  const advancedAmount = Math.round(totalAmount * 0.85 * 100) / 100; // 85% Aforo
  const commission = Math.round(totalAmount * 0.015 * 100) / 100; // 1.5% Comisión
  const depositAmount = Math.round((advancedAmount - commission) * 100) / 100; // Depósito neto

  // Si cambia el cliente preseleccionado en la URL
  useEffect(() => {
    if (preselectedClientId) {
      setValue('clientId', preselectedClientId);
    }
  }, [preselectedClientId, setValue]);

  const onSubmit = (values: OriginationFormValues) => {
    const payload = {
      clientId: values.clientId,
      requestDate: new Date(values.requestDate).toISOString(),
      invoices: values.invoices.map((inv) => ({
        folio: inv.folio.trim().toUpperCase(),
        debtorRfc: inv.debtorRfc.trim().toUpperCase(),
        debtorName: inv.debtorName.trim(),
        amount: Number(inv.amount),
        issueDate: new Date(inv.issueDate).toISOString(),
        dueDate: new Date(inv.dueDate).toISOString(),
      })),
    };

    createOperationMutation.mutate(payload, {
      onSuccess: (data) => {
        toast.success('Operación originada exitosamente', {
          description: `Se han fondeado ${values.invoices.length} facturas. ID Operación: ${data.operationId.substring(0, 8)}...`,
        });
        router.push(`/clientes/${values.clientId}`);
      },
      onError: (error: any) => {
        toast.error('Fallo en la originación financiera', {
          description: error.message || 'Verifica los plazos y folios duplicados.',
        });
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Botón de regreso */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e293b]/40 pb-4">
        <div className="space-y-1">
          <Link href="/operaciones" className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a Operaciones
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Originación de Operaciones</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Carga de lotes de facturas para la cesión de derechos y anticipo de liquidez.
          </p>
        </div>
      </div>

      {isClientsLoading ? (
        <div className="py-20 text-center text-sm text-slate-500">Cargando catálogo de clientes...</div>
      ) : approvedClients.length === 0 ? (
        <Card className="bg-amber-50/50 dark:bg-[#17111e]/20 border-amber-200 dark:border-amber-500/20 py-16 text-center">
          <CardContent className="flex flex-col items-center justify-center p-8 max-w-md mx-auto">
            <BadgeAlert className="h-12 w-12 text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No hay clientes aprobados</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Para originar una operación financiera de factoraje, primero debes registrar y aprobar al menos un cliente en el sistema.
            </p>
            <Link href="/clientes">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Ir a Directorio de Clientes
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Lado Izquierdo: Carga de Facturas y Configuración */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Configuración de Origen (Cliente y Fecha) */}
            <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
              <CardHeader className="py-4 border-b border-slate-200 dark:border-[#1e293b]/20">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Configuración del Origen
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Selector de Cliente */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Cliente (Solo Aprobados)
                  </label>
                  <select
                    {...register('clientId')}
                    className="w-full bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/40 rounded-lg p-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="">-- Selecciona un Cliente --</option>
                    {approvedClients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.rfc})
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.clientId.message}</p>
                  )}
                </div>

                {/* Fecha de la Solicitud */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    Fecha de la Solicitud
                  </label>
                  <Input
                    type="date"
                    className="bg-slate-50 dark:bg-[#111625] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 focus-visible:ring-blue-500"
                    {...register('requestDate')}
                  />
                  {errors.requestDate && (
                    <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.requestDate.message}</p>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Lote de Facturas Dinámico */}
            <Card className="bg-white dark:bg-[#0c101a] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 shadow-xs">
              <CardHeader className="py-4 border-b border-slate-200 dark:border-[#1e293b]/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                    Lote de Facturas
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Carga los folios, RFC deudor, importes y fechas de vencimiento de las facturas.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    append({
                      folio: '',
                      debtorRfc: '',
                      debtorName: '',
                      amount: 0,
                      issueDate: '',
                      dueDate: '',
                    })
                  }
                  className="bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 font-semibold text-xs gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Añadir Fila
                </Button>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                
                {fields.map((field, index) => {
                  const itemErrors = errors.invoices?.[index];
                  
                  // Calcular días restantes de vencimiento para visualización reactiva
                  const invDueDate = watchInvoices[index]?.dueDate;
                  const invIssueDate = watchInvoices[index]?.issueDate;
                  const daysRemaining =
                    invDueDate && watchRequestDate
                      ? getRemainingDays(new Date(watchRequestDate), new Date(invDueDate))
                      : null;

                  return (
                    <div
                      key={field.id}
                      className="bg-slate-50/70 dark:bg-[#111625]/40 border border-slate-200 dark:border-[#1e293b]/20 rounded-xl p-4 space-y-4 relative hover:border-slate-300 dark:hover:border-slate-700/50 transition-colors"
                    >
                      {/* Cabecera de Fila */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase">Factura #{index + 1}</span>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => remove(index)}
                            className="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 h-7 w-7"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>

                      {/* Campos Fila */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Folio */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Folio</label>
                          <Input
                            placeholder="e.g. FAC-001"
                            className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs uppercase"
                            {...register(`invoices.${index}.folio`)}
                          />
                          {itemErrors?.folio && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{itemErrors.folio.message}</p>
                          )}
                        </div>

                        {/* RFC Deudor */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RFC Deudor</label>
                          <Input
                            placeholder="e.g. DEF020202ABC"
                            className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs uppercase"
                            {...register(`invoices.${index}.debtorRfc`)}
                          />
                          {itemErrors?.debtorRfc && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{itemErrors.debtorRfc.message}</p>
                          )}
                        </div>

                        {/* Razón Social Deudor */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Razón Social Deudor</label>
                          <Input
                            placeholder="e.g. Distribuidora S.A."
                            className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs"
                            {...register(`invoices.${index}.debtorName`)}
                          />
                          {itemErrors?.debtorName && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{itemErrors.debtorName.message}</p>
                          )}
                        </div>

                        {/* Importe (Monto) */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monto Factura (MXN)</label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs font-mono"
                            {...register(`invoices.${index}.amount`, { valueAsNumber: true })}
                          />
                          {itemErrors?.amount && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{itemErrors.amount.message}</p>
                          )}
                        </div>

                        {/* Fecha de Emisión */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha Emisión</label>
                          <Input
                            type="date"
                            className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 text-xs"
                            {...register(`invoices.${index}.issueDate`)}
                          />
                          {itemErrors?.issueDate && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{itemErrors.issueDate.message}</p>
                          )}
                        </div>

                        {/* Fecha de Vencimiento */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha Vencimiento</label>
                          <Input
                            type="date"
                            className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/40 text-slate-800 dark:text-slate-200 text-xs"
                            {...register(`invoices.${index}.dueDate`)}
                          />
                          
                          {/* Visualización del plazo restante en tiempo real */}
                          {daysRemaining !== null && !isNaN(daysRemaining) && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                daysRemaining >= 15 && daysRemaining <= 120
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              }`}>
                                Plazo: {daysRemaining} días {daysRemaining >= 15 && daysRemaining <= 120 ? '✅' : '❌'}
                              </span>
                            </div>
                          )}

                          {itemErrors?.dueDate && (
                            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{itemErrors.dueDate.message}</p>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

          </div>

          {/* Lado Derecho: Resumen Financiero Lateral (SaaS) */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-[#0a0d16] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 sticky top-24 shadow-xl">
              <CardHeader className="py-4 border-b border-slate-200 dark:border-[#1e293b]/40 bg-slate-50 dark:bg-[#0c111e]">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-pulse" />
                  Resumen de Originación
                </CardTitle>
                <CardDescription className="text-[10px] text-slate-500">
                  Desglose financiero en tiempo real calculado bajo reglas de Capital X.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                
                {/* Desglose de Operación */}
                <div className="space-y-4 text-sm">
                  
                  {/* Total del Lote */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Total Facturado</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(totalAmount)}
                    </span>
                  </div>

                  {/* Aforo (85%) */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-slate-500 dark:text-slate-400">Monto Adelantado</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Aforo Fijo del 85.0%</span>
                    </div>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(advancedAmount)}
                    </span>
                  </div>

                  {/* Comisión (1.5%) */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-slate-500 dark:text-slate-400">Comisión por Servicio</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Comisión Fija del 1.5%</span>
                    </div>
                    <span className="font-mono font-semibold text-slate-500 dark:text-slate-400">
                      -{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(commission)}
                    </span>
                  </div>

                  <div className="h-px bg-slate-200 dark:bg-[#1e293b]/40"></div>

                  {/* Depósito Neto Recibido */}
                  <div className="bg-emerald-50/50 dark:bg-[#111726]/60 border border-emerald-200 dark:border-blue-500/10 rounded-xl p-4 space-y-1">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">Total a Depositar</span>
                    <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 block tracking-tighter">
                      {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(depositAmount)}
                    </span>
                    <span className="text-[9px] text-slate-500 block leading-tight">
                      Monto neto resultante tras la retención de aforo y el cobro de la comisión de factoraje.
                    </span>
                  </div>

                </div>

                {/* Mensaje de validación rápida antes de enviar */}
                {!selectedClientId && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-start gap-2 text-[10px] text-slate-600 dark:text-slate-400 leading-normal">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>Debes seleccionar un cliente aprobado para poder originar la operación.</span>
                  </div>
                )}

                {/* Acciones del Analista */}
                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={!isValid || createOperationMutation.isPending || !selectedClientId}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-5 rounded-lg shadow-lg text-xs uppercase tracking-wider transition-all duration-200"
                  >
                    {createOperationMutation.isPending ? 'Procesando Originación...' : 'Confirmar y Originar Lote'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push('/operaciones')}
                    className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-xs py-5"
                  >
                    Cancelar
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </form>
      )}
    </div>
  );
}

export default function NewOperationPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">Iniciando asistente de originación...</p>
      </div>
    }>
      <NewOperationForm />
    </Suspense>
  );
}
