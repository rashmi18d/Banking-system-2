import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./invoicesModal.module.scss";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";

const InvoicesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { selectedCustomerDetails } = useCustomerInvoiceContext();

  const [overdueInvoicesCount, setOverdueInvoicesCount] = useState<number>(0);
  const [overdueCustomers, setOverdueCustomers] = useState<Set<string>>(
    new Set()
  );
  const [totalOverdueAmount, setTotalOverdueAmount] = useState<number>(0);

  const [remainderInvoicesCount, setRemainderInvoicesCount] =
    useState<number>(0);
  const [remainderCustomers, setRemainderCustomers] = useState<Set<string>>(
    new Set()
  );
  const [totalRemainderAmount, setTotalRemainderAmount] = useState<number>(0);

  const today = new Date();

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

      Object.keys(selectedCustomerDetails).forEach((customerId) => {
        const customerInvoices = selectedCustomerDetails[customerId];

        let hasOverdue = false;
        let hasRemainder = false;

        customerInvoices.forEach((invoice) => {
          const outstandingAmount = parseFloat(invoice.outstandingAmount) || 0;

          if (isOverdue(invoice.dueDate)) {
            overdueInvoices += 1;
            overdueTotal += outstandingAmount;
            hasOverdue = true;
          } else {
            remainderInvoices += 1;
            remainderTotal += outstandingAmount;
            hasRemainder = true;
          }
        });

        if (hasOverdue) overdueCustomersSet.add(customerId);
        if (hasRemainder) remainderCustomersSet.add(customerId);
      });

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

        <div className={styles.invoicesSection}>
          <h3>Request Payment</h3>
          <p>Invoices: {overdueInvoicesCount}</p>
          <p>Customers: {overdueCustomers.size}</p>
          <p>Total Overdue Amount: ₹{totalOverdueAmount.toFixed(2)}</p>
        </div>

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
