import { Metadata } from 'next';
import { AuditTable } from '@/components/auditoria/audit-table';
import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bitácora de Auditoría | FactorCore',
  description: 'Bitácora de auditoría de FactorCore',
};

export default function AuditoriaPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <ShieldAlert className="mr-3 h-8 w-8 text-blue-600" />
          Bitácora de Auditoría
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Registro inmutable de todas las acciones y operaciones del sistema. Solo para uso de Administradores.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <AuditTable />
      </div>
    </div>
  );
}
