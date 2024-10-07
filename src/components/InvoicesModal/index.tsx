import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./invoicesModal.module.scss";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";

interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  outstandingAmount: string;
  dueDate: string; // Due date format: DD/MM/YY
  status: string | null;
  lastRemainder: string;
  invoiceAmount: string;
  discount: string;
  region: string | null;
  division: string;
  documentType: string;
  documentNumber: string;
  additionalInfo: { label: string; value: string; sequence: number }[];
}

interface SelectedCustomerDetails {
  [customerId: string]: Invoice[];
}

const InvoicesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { selectedCustomerDetails } = useCustomerInvoiceContext();

  // State to hold counts for overdue and remainder invoices
  const [overdueInvoicesCount, setOverdueInvoicesCount] = useState<number>(0);
  const [overdueCustomers, setOverdueCustomers] = useState<Set<string>>(
    new Set()
  );
  const [totalOverdueAmount, setTotalOverdueAmount] = useState<number>(0); // Total overdue amount

  const [remainderInvoicesCount, setRemainderInvoicesCount] =
    useState<number>(0);
  const [remainderCustomers, setRemainderCustomers] = useState<Set<string>>(
    new Set()
  );
  const [totalRemainderAmount, setTotalRemainderAmount] = useState<number>(0); // Total remainder amount

  const today = new Date();

  // Function to determine if an invoice is overdue
  const isOverdue = (dueDate: string): boolean => {
    const [day, month, year] = dueDate.split("/").map(Number);
    const invoiceDueDate = new Date(year + 2000, month - 1, day);
    return invoiceDueDate < today;
  };

  useEffect(() => {
    if (isOpen && selectedCustomerDetails) {
      let overdueInvoices = 0;
      let remainderInvoices = 0;
      let overdueTotal = 0;
      let remainderTotal = 0;
      const overdueCustomersSet = new Set<string>();
      const remainderCustomersSet = new Set<string>();

      // Iterate through customers and their invoices
      Object.keys(selectedCustomerDetails).forEach((customerId) => {
        const customerInvoices = selectedCustomerDetails[customerId];

        let hasOverdue = false;
        let hasRemainder = false;

        customerInvoices.forEach((invoice) => {
          const outstandingAmount = parseFloat(invoice.outstandingAmount) || 0;

          if (isOverdue(invoice.dueDate)) {
            overdueInvoices += 1; // Increment overdue invoice count
            overdueTotal += outstandingAmount; // Add to total overdue amount
            hasOverdue = true; // Mark customer as having overdue invoices
          } else {
            remainderInvoices += 1; // Increment remainder (request payment) count
            remainderTotal += outstandingAmount; // Add to total remainder amount
            hasRemainder = true; // Mark customer as having remainder invoices
          }
        });

        // Add customer ID to sets to ensure uniqueness
        if (hasOverdue) overdueCustomersSet.add(customerId);
        if (hasRemainder) remainderCustomersSet.add(customerId);
      });

      // Update states for invoice counts, total amounts, and unique customers
      setOverdueInvoicesCount(overdueInvoices);
      setTotalOverdueAmount(overdueTotal);
      setOverdueCustomers(overdueCustomersSet);

      setRemainderInvoicesCount(remainderInvoices);
      setTotalRemainderAmount(remainderTotal);
      setRemainderCustomers(remainderCustomersSet);
    }
  }, [isOpen, selectedCustomerDetails]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Display counts for overdue invoices, customers, and total overdue amount */}
        <div className={styles.invoicesSection}>
          <h3>Request Payment</h3>
          <p>Invoices: {overdueInvoicesCount}</p>
          <p>Customers: {overdueCustomers.size}</p>
          <p>Total Overdue Amount: ₹{totalOverdueAmount.toFixed(2)}</p>
        </div>

        {/* Display counts for remainder (request payment) invoices, customers, and total remainder amount */}
        <div className={styles.invoicesSection}>
          <h3>Send Remainders</h3>
          <p>Invoices: {remainderInvoicesCount}</p>
          <p>Customers: {remainderCustomers.size}</p>
          <p>Total Due Amount: ₹{totalRemainderAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
