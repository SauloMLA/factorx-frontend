'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { useApproveClientMutation } from '@/hooks/useClients';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ApproveClientDialogProps {
  clientId: string;
  clientName: string;
  clientRfc: string;
  // Permite renderizar un botón personalizado o usar el botón de aprobación por defecto
  trigger?: React.ReactElement;
  onSuccess?: () => void;
}

export default function ApproveClientDialog({
  clientId,
  clientName,
  clientRfc,
  trigger,
  onSuccess,
}: ApproveClientDialogProps) {
  const [open, setOpen] = useState(false);
  const approveMutation = useApproveClientMutation();

  const handleApprove = () => {
    approveMutation.mutate(clientId, {
      onSuccess: () => {
        toast.success('Cliente aprobado exitosamente', {
          description: `El cliente ${clientName} ahora puede originar operaciones de factoraje.`,
        });
        setOpen(false);
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        toast.error('Error al aprobar cliente', {
          description: error.message || 'Inténtalo de nuevo más tarde.',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger || (
          <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 font-semibold gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Aprobar
          </Button>
        )
      } />
      <DialogContent className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 sm:max-w-[400px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <DialogTitle className="text-slate-900 dark:text-white text-center text-lg">Confirmar Aprobación</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-center text-sm">
            ¿Estás seguro de que deseas aprobar a <span className="text-slate-900 dark:text-slate-200 font-semibold">{clientName}</span> ({clientRfc})?
          </DialogDescription>
        </DialogHeader>
        <div className="bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/40 rounded-lg p-3 my-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
          <p className="font-semibold text-slate-800 dark:text-slate-300">Implicaciones financieras:</p>
          <p>• Habilita la originación de operaciones y el fondeo de facturas.</p>
          <p>• El cliente podrá ceder derechos de cobro bajo el esquema de aforo al 85%.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium min-w-[100px]"
          >
            {approveMutation.isPending ? 'Aprobando...' : 'Confirmar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
