import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./invoicesModal.module.scss";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import Button from "../Button";
import { generateInvoiceData } from "../../constants/invoiceModalDetails"; // Assuming you have this file
import { getButtonLabel, isOverdue } from "../../utils/invoiceUtils"; // Importing the utility functions

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
  const [requestPaymentClicked, setRequestPaymentClicked] = useState(false);
  const [sendReminderClicked, setSendReminderClicked] = useState(false);

  useEffect(() => {
    if (overdueInvoicesCount > 0) {
      setActiveTab(Tab.RequestPayment);
    } else if (remainderInvoicesCount > 0) {
      setActiveTab(Tab.SendRemainder);
    }
  }, [overdueInvoicesCount, remainderInvoicesCount, isOpen]);

  const invoiceData = generateInvoiceData(
    overdueInvoicesCount,
    overdueCustomers.size,
    overdueTotalAmount,
    remainderInvoicesCount,
    remainderCustomers.size,
    remainderTotalAmount
  );

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

  const handleButtonClick = () => {
    const today = new Date();

    // const isOverdue = (dueDate: string): boolean => {
    //   const [day, month, year] = dueDate
    //     .split("/")
    //     .map((value) => parseInt(value, 10));
    //   const invoiceDate = new Date(parseInt(`20${year}`, 10), month - 1, day);
    //   return invoiceDate < today;
    // };

    const updatedCustomerDetails = { ...selectedCustomerDetails };

    const selectedInvoicesArray: Array<{
      customerId: string;
      invoices: any[];
    }> = [];

    Object.keys(updatedCustomerDetails).forEach((customerId) => {
      const customerInvoices = updatedCustomerDetails[customerId];

      if (customerInvoices) {
        let filteredInvoices: any[] = [];

        if (activeTab === Tab.RequestPayment) {
          filteredInvoices = customerInvoices.filter((invoice: any) =>
            isOverdue(invoice.dueDate)
          );
          setRequestPaymentClicked(true);
        } else if (activeTab === Tab.SendRemainder) {
          filteredInvoices = customerInvoices.filter(
            (invoice: any) => !isOverdue(invoice.dueDate)
          );
          setSendReminderClicked(true);
        }

        if (filteredInvoices.length > 0) {
          selectedInvoicesArray.push({
            customerId,
            invoices: filteredInvoices,
          });

          updatedCustomerDetails[customerId] = customerInvoices.map(
            (invoice: any) => ({
              ...invoice,
              lastRemainder: today.toLocaleDateString("en-GB"),
            })
          );

          if (activeTab === Tab.RequestPayment) {
            updatedCustomerDetails[customerId] = customerInvoices.filter(
              (invoice: any) => !isOverdue(invoice.dueDate)
            );
          } else if (activeTab === Tab.SendRemainder) {
            updatedCustomerDetails[customerId] = customerInvoices.filter(
              (invoice: any) => isOverdue(invoice.dueDate)
            );
          }

          if (updatedCustomerDetails[customerId].length === 0) {
            delete updatedCustomerDetails[customerId];
          }
        }
      }
    });

    console.log("Selected Invoices Array:", selectedInvoicesArray);

    setSelectedCustomerDetails(updatedCustomerDetails);
    onClose();
  };

  const getTotalAmount = () => {
    if (activeTab === Tab.RequestPayment) {
      return `₹${overdueTotalAmount.toFixed(2)}`;
    } else if (activeTab === Tab.SendRemainder) {
      return `₹${remainderTotalAmount.toFixed(2)}`;
    }
    return "₹0.00";
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          {overdueInvoicesCount <= 0 && remainderInvoicesCount <= 0 && (
            <ModalTitle title="No Invoices Available" />
          )}
          {overdueInvoicesCount === 0 || remainderInvoicesCount === 0 ? (
            <ModalTitle
              title={
                activeTab === Tab.RequestPayment
                  ? "Request Payment"
                  : "Send Reminder"
              }
            />
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
            <div className={styles.invoicesSection}>
              {invoiceData[
                activeTab === Tab.RequestPayment
                  ? "requestPayment"
                  : "sendReminder"
              ].map((item, index) => (
                <p key={index} className={styles.invoiceHeader}>
                  {item.label}
                  <div className={styles.invoiceValue}>{item.value}</div>
                </p>
              ))}
            </div>
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
        </div>

        <div className={styles.buttonContainer}>
          <Button variant="primary" onClick={handleButtonClick} size="large">
            {getButtonLabel(activeTab)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
