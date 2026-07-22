export interface Invoice {
  id: string;
  operationId: string;
  folio: string;
  debtorRfc: string;
  debtorName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  createdAt: string;
}

export interface CreateInvoicePayload {
  folio: string;
  debtorRfc: string;
  debtorName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
}
