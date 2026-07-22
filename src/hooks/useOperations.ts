import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { operationService } from '../services/operation.service';
import { CreateOperationPayload } from '../types/operation';
import { clientKeys } from './useClients';

// Claves de consulta de TanStack Query
export const operationKeys = {
  all: ['operations'] as const,
  lists: () => [...operationKeys.all, 'list'] as const,
  filter: (clientId?: string) => [...operationKeys.lists(), { clientId }] as const,
};

/**
 * Hook para obtener la lista de operaciones del sistema (global o por cliente)
 */
export function useOperationsQuery(clientId?: string) {
  return useQuery({
    queryKey: operationKeys.filter(clientId),
    queryFn: () => operationService.getOperations(clientId),
  });
}

/**
 * Hook para originar una nueva operación de factoraje (financiar lote de facturas)
 */
export function useCreateOperationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOperationPayload) => operationService.createOperation(payload),
    onSuccess: (_, variables) => {
      // Invalida la lista global de operaciones y la del cliente específico
      queryClient.invalidateQueries({ queryKey: operationKeys.all });
      // Invalida también el resumen del cliente, ya que cambió su total de operaciones y próximo vencimiento
      queryClient.invalidateQueries({ queryKey: clientKeys.summary(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}
