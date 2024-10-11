import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./invoicesModal.module.scss";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import Button from "../Button";

enum Tab {
  RequestPayment = "requestPayment",
  SendRemainder = "sendRemainder",
}

const ModalTitle: React.FC<{ title: string }> = ({ title }) => (
  <h4 className={styles.modalTitle}>{title}</h4>
);

const InvoicesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const {
    overdueInvoicesCount,
    remainderInvoicesCount,
    overdueCustomers,
    remainderCustomers,
    overdueTotalAmount,
    remainderTotalAmount,
    selectedCustomerDetails,
    setSelectedCustomerDetails,
  } = useCustomerInvoiceContext();

  const [activeTab, setActiveTab] = useState<Tab | "">("");

  const getCustomerGreeting = () => {
    const customers =
      activeTab === Tab.RequestPayment ? overdueCustomers : remainderCustomers;

    if (customers.size === 1) {
      const customerArray = Array.from(customers);
      const firstCustomerId = customerArray[0];
      const customerName =
        selectedCustomerDetails[firstCustomerId]?.[0]?.customerName ||
        "Customer";
      return `Hi ${customerName},`;
    } else if (customers.size > 1) {
      return "Hi Customers,";
    }
  };

  useEffect(() => {
    if (overdueInvoicesCount > 0) {
      setActiveTab(Tab.RequestPayment);
    } else if (remainderInvoicesCount > 0) {
      setActiveTab(Tab.SendRemainder);
    }
  }, [overdueInvoicesCount, remainderInvoicesCount, isOpen]);

  const getTotalAmount = () => {
    if (activeTab === Tab.RequestPayment) {
      return `₹${overdueTotalAmount.toFixed(2)}`;
    } else if (activeTab === Tab.SendRemainder) {
      return `₹${remainderTotalAmount.toFixed(2)}`;
    }
    return "₹0.00";
  };

  const getButtonLabel = () => {
    if (activeTab === Tab.RequestPayment) {
      return "Request Payment via Email";
    } else if (activeTab === Tab.SendRemainder) {
      return "Send Reminder via Email";
    }
    return "";
  };
  const handleButtonClick = () => {
    const today = new Date();

    // Helper to check if the invoice is overdue
    const isOverdue = (dueDate: string): boolean => {
      const [day, month, year] = dueDate
        .split("/")
        .map((value) => parseInt(value, 10));

      // Construct the date correctly as YYYY-MM-DD for Date object
      const invoiceDate = new Date(parseInt(`20${year}`, 10), month - 1, day);

      // Compare the invoiceDate to the current date (today)
      return invoiceDate < new Date(); // true if invoiceDate is in the past (overdue)
    };

    const updatedCustomerDetails = { ...selectedCustomerDetails };

    // Iterate over customers and update invoices based on the active tab
    Object.keys(updatedCustomerDetails).forEach((customerId) => {
      const customerInvoices = updatedCustomerDetails[customerId];

      if (customerInvoices) {
        // Update the lastRemainder date for all invoices in the current tab
        updatedCustomerDetails[customerId] = customerInvoices.map(
          (invoice: any) => ({
            ...invoice,
            lastRemainder: today.toLocaleDateString("en-GB"), // Format as DD/MM/YY
          })
        );

        // Remove invoices based on the active tab:
        if (activeTab === Tab.RequestPayment) {
          // Remove overdue invoices (dueDate < today)
          updatedCustomerDetails[customerId] = customerInvoices.filter(
            (invoice: any) => !isOverdue(invoice.dueDate) // Keep non-overdue
          );
        } else if (activeTab === Tab.SendRemainder) {
          // Remove due invoices (dueDate >= today)
          updatedCustomerDetails[customerId] = customerInvoices.filter(
            (invoice: any) => isOverdue(invoice.dueDate) // Keep only overdue
          );
        }
        if (updatedCustomerDetails[customerId].length === 0) {
          delete updatedCustomerDetails[customerId];
          onClose();
        }
      }
    });

    setSelectedCustomerDetails(updatedCustomerDetails);
  };

  const title =
    activeTab === Tab.RequestPayment
      ? "Request Payment"
      : activeTab === Tab.SendRemainder
      ? "Send Reminder"
      : "";

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {overdueInvoicesCount <= 0 && remainderInvoicesCount <= 0 && (
            <ModalTitle title="No Invoices Available" />
          )}
          {overdueInvoicesCount === 0 || remainderInvoicesCount === 0 ? (
            <ModalTitle title={title} />
          ) : null}
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <>
          {overdueInvoicesCount > 0 && remainderInvoicesCount > 0 && (
            <div className={styles.tabContainer}>
              <button
                className={`${styles.tabButton} ${
                  activeTab === Tab.RequestPayment ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(Tab.RequestPayment)}
              >
                Request Payment
              </button>
              <button
                className={`${styles.tabButton} ${
                  activeTab === Tab.SendRemainder ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(Tab.SendRemainder)}
              >
                Send Reminder
              </button>
            </div>
          )}
        </>

        <div className={styles.infoBackground}>
          <div className={styles.tabBody}>
            {activeTab === Tab.RequestPayment && overdueInvoicesCount > 0 && (
              <div className={styles.invoicesSection}>
                <p className={styles.invoiceHeader}>
                  #INVOICES
                  <div className={styles.invoiceValue}>
                    {overdueInvoicesCount}
                  </div>
                </p>
                <p className={styles.invoiceHeader}>
                  TOTAL CUSTOMERS
                  <div className={styles.invoiceValue}>
                    {overdueCustomers.size}
                  </div>
                </p>
                <p className={styles.invoiceHeader}>
                  TOTAL OVERDUE AMOUNT
                  <div className={styles.invoiceValue}>
                    ₹{overdueTotalAmount.toFixed(2)}
                  </div>{" "}
                </p>
              </div>
            )}

            {activeTab === Tab.SendRemainder && remainderInvoicesCount > 0 && (
              <div className={styles.invoicesSection}>
                <p className={styles.invoiceHeader}>
                  #INVOICES
                  <div className={styles.invoiceValue}>
                    {remainderInvoicesCount}
                  </div>
                </p>
                <p className={styles.invoiceHeader}>
                  TOTAL CUSTOMERS
                  <div className={styles.invoiceValue}>
                    {remainderCustomers.size}
                  </div>
                </p>
                <p className={styles.invoiceHeader}>
                  TOTAL DUE AMOUNT
                  <div className={styles.invoiceValue}>
                    ₹{remainderTotalAmount.toFixed(2)}
                  </div>
                </p>
              </div>
            )}
          </div>
          <div className={styles.messageTitle}>Message</div>
          <div className={styles.messageContainer}>
            <div className={styles.customerName}>{getCustomerGreeting()} </div>
            <div className={styles.emailDescription}>
              Your payment amounting to {getTotalAmount()} is overdue. Please
              complete the payment to stop incurring charges.
            </div>
            <div className={styles.emailInfo}>
              <div>Regards, </div>
              <div>Sanjay Kumar</div>
              <div>Senior AR Manager, ABC Company</div>
              <div>+919465863456</div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button variant="primary" onClick={handleButtonClick} size="large">
              {getButtonLabel()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
