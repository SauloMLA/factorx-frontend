export type ClientStatus = 'PENDING' | 'APPROVED';

export interface Client {
  id: string;
  rfc: string;
  name: string;
  email: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterClientPayload {
  rfc: string;
  name: string;
  email: string;
}

export interface ClientSummary {
  operationCount: number;
  totalAdvancedAmount: number;
  nearestDueDate: string | null;
}
