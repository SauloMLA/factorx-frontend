'use client';

import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useState } from 'react';

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export function AuditTable() {
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data: logs, isLoading, error } = useAuditLogs({
    entity: entityFilter || undefined,
    action: actionFilter || undefined,
  });

  if (isLoading) return <div className="p-4 text-slate-500 text-sm">Cargando bitácora de auditoría...</div>;
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm space-y-1">
        <p className="font-semibold">Error al cargar la bitácora</p>
        <p>{error instanceof Error ? error.message : 'No se pudo obtener la información de auditoría.'}</p>
        {error instanceof Error && (error.message.includes('Forbidden') || error.message.includes('403')) && (
          <p className="text-xs text-red-600 mt-2">
            Nota: Este módulo requiere permisos de Administrador (UserRole.ADMINISTRATOR).
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <input
          type="text"
          placeholder="Filtrar por Entidad (ej. Client)"
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="border border-slate-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Filtrar por Acción (ej. CREATE)"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border border-slate-300 rounded-md p-2"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Usuario (ID)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Entidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID Entidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detalles</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {logs?.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {formatDate(log.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {log.performedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                    log.action === 'APPROVE' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {log.entity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 truncate max-w-xs">
                  {log.entityId}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  <details className="cursor-pointer">
                    <summary className="text-blue-600 hover:text-blue-800">Ver cambios</summary>
                    <div className="mt-2 text-xs bg-slate-50 p-2 rounded-md overflow-x-auto">
                      <div className="font-semibold text-slate-700">Valor Anterior:</div>
                      <pre className="mb-2">{JSON.stringify(log.oldValue, null, 2)}</pre>
                      <div className="font-semibold text-slate-700">Valor Nuevo:</div>
                      <pre>{JSON.stringify(log.newValue, null, 2)}</pre>
                      <div className="font-semibold text-slate-700 mt-2">IP: {log.ip}</div>
                      <div className="font-semibold text-slate-700">User Agent: {log.userAgent}</div>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
            {logs?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                  No se encontraron registros de auditoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
