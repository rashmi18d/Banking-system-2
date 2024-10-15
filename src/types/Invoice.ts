export interface InvoiceType {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  outstandingAmount: string;
  dueDate: string;
  status: string | null;
  lastRemainder: string | null;
  invoiceAmount: string;
  discount: string;
  region: string | null;
  division: string;
  documentType: string;
  documentNumber: string;
  additionalInfo: Array<{
    label: string;
    value: string;
    sequence: number;
  }>;
}

export interface CustomerDetailsType {
  customerId: string;
  customerName: string;
  totalInvoices: string;
  outstandingAmount: string;
  overDueInvoices: string;
  overDueAmount: string;
  creditOrDebitNote?: string;
  invoices?: {
    data: {
      invoices: InvoiceType[] | [];
    };
  };
}
