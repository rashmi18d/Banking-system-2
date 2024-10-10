import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./invoicesModal.module.scss";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import Button from "../Button";

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
  } = useCustomerInvoiceContext();

  const [activeTab, setActiveTab] = useState("");
  const getCustomerGreeting = () => {
    const customers =
      activeTab === "requestPayment" ? overdueCustomers : remainderCustomers;

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
      setActiveTab("requestPayment");
    } else if (remainderInvoicesCount > 0) {
      setActiveTab("sendRemainder");
    }
  }, [overdueInvoicesCount, remainderInvoicesCount, isOpen]);

  const getTotalAmount = () => {
    if (activeTab === "requestPayment") {
      return `₹${overdueTotalAmount.toFixed(2)}`;
    } else if (activeTab === "sendRemainder") {
      return `₹${remainderTotalAmount.toFixed(2)}`;
    }
    return "₹0.00";
  };

  const getButtonLabel = () => {
    if (activeTab === "requestPayment") {
      return "Request Payment via Email";
    } else if (activeTab === "sendRemainder") {
      return "Send Reminder via Email";
    }
    return "";
  };

  if (!isOpen) {
    return null;
  }

  const title =
    activeTab === "requestPayment"
      ? "Request Payment"
      : activeTab === "sendRemainder"
      ? "Send Remainder"
      : "";

  const isDataAvailable =
    overdueInvoicesCount > 0 || remainderInvoicesCount > 0;

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

        {isDataAvailable ? (
          <>
            {/* Show tabs only if both counts are greater than zero */}
            {overdueInvoicesCount > 0 && remainderInvoicesCount > 0 && (
              <div className={styles.tabContainer}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "requestPayment" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("requestPayment")}
                >
                  Request Payment
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "sendRemainder" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("sendRemainder")}
                >
                  Send Reminder
                </button>
              </div>
            )}

            {/* Request Payment tab */}
            {activeTab === "requestPayment" && overdueInvoicesCount > 0 && (
              <div className={styles.invoicesSection}>
                <p className={styles.invoiceHeader}>
                  #INVOICES
                  <div className={styles.invoiceValue}>
                    {overdueInvoicesCount}
                  </div>{" "}
                </p>
                <p className={styles.invoiceHeader}>
                  TOTAL CUSTOMERS
                  <div className={styles.invoiceValue}>
                    {" "}
                    {overdueCustomers.size}
                  </div>
                </p>
                <p className={styles.invoiceHeader}>
                  TOTAL OVERDUE AMOUNT
                  <div className={styles.invoiceValue}>
                    {" "}
                    ₹{overdueTotalAmount.toFixed(2)}
                  </div>{" "}
                </p>
              </div>
            )}

            {/* Send Reminder tab */}
            {activeTab === "sendRemainder" && remainderInvoicesCount > 0 && (
              <div className={styles.invoicesSection}>
                <p className={styles.invoiceHeader}>
                  #INVOICES
                  <div className={styles.invoiceValue}>
                    {" "}
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
                    {" "}
                    ₹{remainderTotalAmount.toFixed(2)}
                  </div>
                </p>
              </div>
            )}
          </>
        ) : (
          <p>Loading data...</p>
        )}
        <div className={styles.infoBackground}>
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
            <Button
              variant="primary"
              onClick={() => {
                onClose();
              }}
              size="large"
            >
              {getButtonLabel()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
