'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import { useApproveClientMutation } from '@/hooks/useClients';
import { useLanguage } from '@/context/language-context';

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
  const { t, language } = useLanguage();

  const handleApprove = () => {
    approveMutation.mutate(clientId, {
      onSuccess: () => {
        toast.success(t('clients.approve_btn'), {
          description: `${clientName} ${t('common.approved')}`,
        });
        setOpen(false);
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        toast.error('Error', {
          description: error.message || 'Error',
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger || (
          <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold gap-1 rounded-xl">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t('clients.approve_btn')}
          </Button>
        )
      } />
      <DialogContent className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 sm:max-w-[400px] rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <DialogTitle className="text-slate-900 dark:text-white text-center text-lg font-bold">
            {language === 'en' ? 'Confirm Approval' : 'Confirmar Aprobación'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400 text-center text-sm">
            {language === 'en' ? 'Are you sure you want to approve' : '¿Estás seguro de que deseas aprobar a'}{' '}
            <span className="text-slate-900 dark:text-slate-200 font-semibold">{clientName}</span> ({clientRfc})?
          </DialogDescription>
        </DialogHeader>
        <div className="bg-slate-50 dark:bg-[#111625] border border-slate-200 dark:border-[#1e293b]/40 rounded-xl p-3 my-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
          <p className="font-semibold text-slate-800 dark:text-slate-300">
            {language === 'en' ? 'Financial implications:' : 'Implicaciones financieras:'}
          </p>
          <p>• {language === 'en' ? 'Enables operation origination & invoice funding.' : 'Habilita la originación de operaciones y el fondeo de facturas.'}</p>
          <p>• {language === 'en' ? 'Client will be eligible for 85% liquidity advances.' : 'El cliente podrá ceder derechos de cobro bajo el esquema de aforo al 85%.'}</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-xs rounded-xl"
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs min-w-[100px] rounded-xl cursor-pointer"
          >
            {approveMutation.isPending ? t('common.loading') : t('common.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
