import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientService } from '../services/client.service';
import { RegisterClientPayload } from '../types/client';

// Claves de consulta de TanStack Query
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  summaries: () => [...clientKeys.all, 'summary'] as const,
  summary: (id: string) => [...clientKeys.summaries(), id] as const,
};

/**
 * Hook para obtener la lista de clientes registrados en el sistema
 */
export function useClientsQuery() {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: () => clientService.getClients(),
  });
}

/**
 * Hook para obtener los detalles de un cliente específico
 */
export function useClientDetailsQuery(clientId: string) {
  return useQuery({
    queryKey: clientKeys.detail(clientId),
    queryFn: () => clientService.getClientDetails(clientId),
    enabled: !!clientId,
  });
}

/**
 * Hook para obtener el resumen financiero ejecutivo de un cliente específico
 */
export function useClientSummaryQuery(clientId: string, enabled = true) {
  return useQuery({
    queryKey: clientKeys.summary(clientId),
    queryFn: () => clientService.getClientSummary(clientId),
    enabled: !!clientId && enabled,
  });
}

/**
 * Hook para registrar un nuevo cliente en el backend NestJS
 */
export function useRegisterClientMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: RegisterClientPayload) => clientService.registerClient(payload),
    onSuccess: () => {
      // Invalida la lista de clientes para refrescar la tabla del analista
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

/**
 * Hook para aprobar a un cliente pendiente de operación
 */
export function useApproveClientMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => clientService.approveClient(clientId),
    onSuccess: (_, clientId) => {
      // Invalida tanto la lista de clientes como el resumen y detalles específicos
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.summary(clientId) });
    },
  });
}
