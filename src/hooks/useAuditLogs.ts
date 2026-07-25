import { useQuery } from '@tanstack/react-query';

export interface AuditLog {
  id: string;
  entity: string;
  entityId: string;
  action: string;
  performedBy: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  ip: string;
  userAgent: string;
  timestamp: string;
}

interface AuditLogFilters {
  entity?: string;
  action?: string;
  performedBy?: string;
}

export const useAuditLogs = (filters?: AuditLogFilters) => {
  return useQuery({
    queryKey: ['auditLogs', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.entity) params.append('entity', filters.entity);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.performedBy) params.append('performedBy', filters.performedBy);
      
      const queryString = params.toString();
      const url = `/api/auditoria${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        const msg = typeof errorData.message === 'string'
          ? errorData.message
          : Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.error || 'Error al obtener registros de auditoría';
        throw new Error(msg);
      }
      
      return response.json() as Promise<AuditLog[]>;
    },
  });
};
