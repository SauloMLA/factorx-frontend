import apiClient from '../api/client';
import { CreateOperationPayload, Operation, OperationResponse } from '../types/operation';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const operationService = {
  /**
   * Crea una nueva operación de factoraje en el backend NestJS (origina lote de facturas)
   */
  async createOperation(payload: CreateOperationPayload): Promise<OperationResponse> {
    const { data } = await apiClient.post<OperationResponse>('/operaciones', payload);
    return data;
  },

  /**
   * Obtiene la lista de operaciones generales o filtradas por cliente desde el BFF
   */
  async getOperations(clientId?: string): Promise<Operation[]> {
    const url = clientId ? `/api/operations?clientId=${clientId}` : '/api/operations';
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error('Error al obtener el historial de operaciones del servidor BFF');
    }
    return response.json();
  }
};
