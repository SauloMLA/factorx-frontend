import { Invoice } from './invoice';

export interface Operation {
  id: string;
  clientId: string;
  totalAmount: number;
  advancedAmount: number;
  commission: number;
  depositAmount: number;
  createdAt: string;
  invoices?: Invoice[];
}

export interface CreateOperationPayload {
  clientId: string;
  requestDate: string;
  invoices: {
    folio: string;
    debtorRfc: string;
    debtorName: string;
    amount: number;
    issueDate: string;
    dueDate: string;
  }[];
}

export interface OperationResponse {
  operationId: string;
  totalAmount: number;
  advancedAmount: number;
  commission: number;
  depositAmount: number;
}
