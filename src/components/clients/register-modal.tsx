'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useRegisterClientMutation } from '@/hooks/useClients';

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

// Esquema de validación en base a las invariantes de FactorCore
const registerClientSchema = z.object({
  rfc: z
    .string()
    .min(1, 'El RFC es obligatorio')
    .regex(
      /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/i,
      'Debe ser un RFC válido de Persona Moral en México (12 caracteres alfanuméricos)'
    ),
  name: z.string().min(3, 'La Razón Social debe tener al menos 3 caracteres'),
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('Formato de correo electrónico inválido'),
});

type RegisterClientFormValues = z.infer<typeof registerClientSchema>;

export default function RegisterClientModal() {
  const [open, setOpen] = useState(false);
  const registerMutation = useRegisterClientMutation();

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
          toast.success('Cliente registrado exitosamente', {
            description: `Se ha registrado el cliente con ID: ${data.id.substring(0, 8)}...`,
          });
          reset();
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error('Error al registrar cliente', {
            description: error.message || 'Verifica los datos e inténtalo de nuevo.',
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2">
          <Plus className="h-4 w-4" />
          Registrar Cliente
        </Button>
      } />
      <DialogContent className="bg-white dark:bg-[#0f1422] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-lg">Registrar Cliente</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Ingresa los datos fiscales de la empresa. Todo cliente inicia en estado pendiente y requerirá aprobación para originar operaciones.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              RFC (Persona Moral)
            </label>
            <Input
              id="rfc"
              placeholder="e.g. CAP220101XYZ"
              className="bg-slate-50 dark:bg-[#171e30] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus-visible:ring-blue-500 uppercase"
              {...register('rfc')}
            />
            {errors.rfc && (
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.rfc.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Razón Social / Nombre Legal
            </label>
            <Input
              id="name"
              placeholder="e.g. Capital Partner S.A."
              className="bg-slate-50 dark:bg-[#171e30] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus-visible:ring-blue-500"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. partner@capital.mx"
              className="bg-slate-50 dark:bg-[#171e30] border-slate-200 dark:border-[#1e293b]/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus-visible:ring-blue-500"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errors.email.message}</p>
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
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[100px]"
            >
              {registerMutation.isPending ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
