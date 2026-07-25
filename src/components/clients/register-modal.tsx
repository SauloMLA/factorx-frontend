'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useRegisterClientMutation } from '@/hooks/useClients';
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
import { Input } from '@/components/ui/input';

const registerClientSchema = z.object({
  rfc: z
    .string()
    .min(1, 'RFC required')
    .regex(
      /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/i,
      'Valid Mexican Corporate RFC required (12 chars)'
    ),
  name: z.string().min(3, 'At least 3 characters required'),
  email: z.string().min(1, 'Email required').email('Invalid email format'),
});

type RegisterClientFormValues = z.infer<typeof registerClientSchema>;

export default function RegisterClientModal() {
  const [open, setOpen] = useState(false);
  const registerMutation = useRegisterClientMutation();
  const { t, language } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterClientFormValues>({
    resolver: zodResolver(registerClientSchema),
    defaultValues: {
      rfc: '',
      name: '',
      email: '',
    },
  });

  const onSubmit = (values: RegisterClientFormValues) => {
    registerMutation.mutate(
      {
        rfc: values.rfc.toUpperCase(),
        name: values.name,
        email: values.email,
      },
      {
        onSuccess: (data) => {
          toast.success(t('clients.btn_register'), {
            description: `ID: ${data.id.substring(0, 8)}...`,
          });
          reset();
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error('Error', {
            description: error.message || 'Error',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer">
          <Plus className="h-4 w-4" />
          {t('clients.btn_register')}
        </Button>
      } />
      <DialogContent className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 sm:max-w-[425px] rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-lg font-bold">{t('clients.btn_register')}</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 text-xs">
            {language === 'en'
              ? 'Enter corporate tax details. Every client starts in pending status and requires analyst approval.'
              : 'Ingresa los datos fiscales de la empresa. Todo cliente inicia en estado pendiente y requerirá aprobación para originar operaciones.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('clients.col_rfc')} (12 Chars)
            </label>
            <Input
              id="rfc"
              placeholder="e.g. CAP220101XYZ"
              className="bg-slate-50 dark:bg-[#171e30] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs font-mono uppercase rounded-xl"
              {...register('rfc')}
            />
            {errors.rfc && (
              <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{errors.rfc.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('clients.col_name')}
            </label>
            <Input
              id="name"
              placeholder="e.g. Capital Partner S.A."
              className="bg-slate-50 dark:bg-[#171e30] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs rounded-xl"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t('clients.col_email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. partner@capital.mx"
              className="bg-slate-50 dark:bg-[#171e30] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 text-xs font-mono rounded-xl"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset();
                setOpen(false);
              }}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 text-xs rounded-xl"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] text-xs font-semibold rounded-xl cursor-pointer"
            >
              {registerMutation.isPending ? t('common.loading') : t('clients.btn_register')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
