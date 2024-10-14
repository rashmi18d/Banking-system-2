export const generateInvoiceData = (
  overdueInvoicesCount: number,
  overdueCustomersSize: number,
  overdueTotalAmount: number,
  remainderInvoicesCount: number,
  remainderCustomersSize: number,
  remainderTotalAmount: number
) => ({
  requestPayment: [
    { label: "#INVOICES", value: overdueInvoicesCount },
    { label: "TOTAL CUSTOMERS", value: overdueCustomersSize },
    {
      label: "TOTAL OVERDUE AMOUNT",
      value: `₹${overdueTotalAmount.toFixed(2)}`,
    },
  ],
  sendReminder: [
    { label: "#INVOICES", value: remainderInvoicesCount },
    { label: "TOTAL CUSTOMERS", value: remainderCustomersSize },
    { label: "TOTAL DUE AMOUNT", value: `₹${remainderTotalAmount.toFixed(2)}` },
  ],
});
