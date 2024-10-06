export interface InvoiceType {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  outstandingAmount: string;
  dueDate: string;
  status: string | null;
  lastRemainder: string;
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
