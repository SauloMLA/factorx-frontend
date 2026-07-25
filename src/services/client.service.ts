import apiClient from '../api/client';
import { Client, ClientSummary, RegisterClientPayload } from '../types/client';

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const clientService = {
  /**
   * Registra un nuevo cliente en el backend NestJS (inicia en estado PENDING)
   */
  async registerClient(payload: RegisterClientPayload): Promise<{ id: string }> {
    const { data } = await apiClient.post<{ id: string }>('/clientes', payload);
    return data;
  },

  /**
   * Aprueba a un cliente en el backend NestJS
   */
  async approveClient(clientId: string): Promise<void> {
    await apiClient.patch(`/clientes/${clientId}/aprobar`);
  },

  /**
   * Obtiene el resumen ejecutivo del comportamiento del cliente desde NestJS
   */
  async getClientSummary(clientId: string): Promise<ClientSummary> {
    const { data } = await apiClient.get<ClientSummary>(`/clientes/${clientId}/resumen`);
    return data;
  },

  /**
   * Obtiene el listado de clientes a través del BFF (Next.js API Route)
   */
  async getClients(): Promise<Client[]> {
    const response = await fetch('/api/clients', {
      headers: getAuthHeaders(),
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error('Error al obtener la lista de clientes del servidor BFF');
    }
    return response.json();
  },

  /**
   * Obtiene los detalles básicos de un cliente específico a través del BFF
   */
  async getClientDetails(clientId: string): Promise<Client> {
    const response = await fetch(`/api/clients/${clientId}`, {
      headers: getAuthHeaders(),
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error('Error al obtener los detalles del cliente del servidor BFF');
    }
    return response.json();
  }
};
