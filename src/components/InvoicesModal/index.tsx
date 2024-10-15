import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./invoicesModal.module.scss";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import Button from "../Button";
import { generateInvoiceData } from "../../constants/invoiceModalDetails";
import { getButtonLabel, isOverdue } from "../../utils/invoiceUtils";
import { InvoiceType } from "../../types/Invoice";

enum Tab {
  RequestPayment = "requestPayment",
  SendRemainder = "sendRemainder",
}

interface InvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalTitle: React.FC<{ title: string }> = ({ title }) => (
  <h4 className={styles.modalTitle}>{title}</h4>
);

const InvoicesModal: React.FC<InvoicesModalProps> = ({ isOpen, onClose }) => {
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

  const [activeTab, setActiveTab] = useState<Tab>(Tab.RequestPayment);

  const [sendRemainderBtnClicked, setSendRemainderBtnClicked] = useState(false);
  const [requestPaymentBtnClicked, setRequestPaymentBtnClicked] =
    useState(false);

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
    const isRequestPayment = activeTab === Tab.RequestPayment;
    const isSendRemainder = activeTab === Tab.SendRemainder;

    const updatedCustomerDetails = { ...selectedCustomerDetails };

    Object.keys(updatedCustomerDetails).forEach((customerId) => {
      const customerInvoices = updatedCustomerDetails[customerId];

      if (customerInvoices) {
        let filteredInvoices: InvoiceType[] = [];

        if (isRequestPayment) {
          filteredInvoices = customerInvoices.filter((invoice: InvoiceType) =>
            isOverdue(invoice.dueDate)
          );
          console.log({ customerId, invoices: filteredInvoices });
        }

        if (isSendRemainder) {
          filteredInvoices = customerInvoices.filter(
            (invoice: InvoiceType) => !isOverdue(invoice.dueDate)
          );
          console.log({ customerId, invoices: filteredInvoices });
        }
      }
    });

    if (isSendRemainder) {
      setSendRemainderBtnClicked(true);
    } else if (isRequestPayment) {
      setRequestPaymentBtnClicked(true);
    }
  };

  const handleClose = () => {
    const updatedCustomerDetails = { ...selectedCustomerDetails };

    if (sendRemainderBtnClicked || requestPaymentBtnClicked) {
      Object.keys(updatedCustomerDetails).forEach((customerId) => {
        const customerInvoices = updatedCustomerDetails[customerId];

        if (customerInvoices) {
          let filteredInvoices: InvoiceType[] = [];

          if (requestPaymentBtnClicked) {
            filteredInvoices = [
              ...filteredInvoices,
              ...customerInvoices.filter((invoice: InvoiceType) =>
                isOverdue(invoice.dueDate)
              ),
            ];
          }

          if (sendRemainderBtnClicked) {
            filteredInvoices = [
              ...filteredInvoices,
              ...customerInvoices.filter(
                (invoice: InvoiceType) => !isOverdue(invoice.dueDate)
              ),
            ];
          }

          if (filteredInvoices.length > 0) {
            updatedCustomerDetails[customerId] = customerInvoices.filter(
              (invoice: InvoiceType) => !filteredInvoices.includes(invoice)
            );

            if (updatedCustomerDetails[customerId].length === 0) {
              delete updatedCustomerDetails[customerId];
            }
          }
        }
      });

      setSelectedCustomerDetails(updatedCustomerDetails);
    }

    setSendRemainderBtnClicked(false);
    setRequestPaymentBtnClicked(false);

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
          <button className={styles.closeButton} onClick={handleClose}>
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
            <div className={styles.customerName}>{getCustomerGreeting()}</div>
            <div className={styles.emailDescription}>
              Your payment amounting to {getTotalAmount()} is overdue. Please
              complete the payment to stop incurring charges.
            </div>
            <div className={styles.emailInfo}>
              <div>Regards,</div>
              <div>Sanjay Kumar</div>
              <div>Senior AR Manager, ABC Company</div>
              <div>+919465863456</div>
            </div>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          {activeTab === Tab.RequestPayment && (
            <Button
              variant="primary"
              onClick={handleButtonClick}
              size="large"
              customClass={
                requestPaymentBtnClicked ? styles.activePaymentCls : ""
              }
            >
              {requestPaymentBtnClicked ? (
                <div className={styles.buttonSubContainer}>
                  <div className={styles.Circle}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ color: "green" }}
                    />
                  </div>
                  <div>
                    Email initiated
                    <div className={styles.activePaymentSubClass}>
                      Your payment request is being successfully initiated
                      against the selected Invoices
                    </div>
                  </div>
                </div>
              ) : (
                getButtonLabel(activeTab)
              )}
            </Button>
          )}

          {activeTab === Tab.SendRemainder && (
            <Button
              variant="primary"
              onClick={handleButtonClick}
              size="large"
              customClass={
                sendRemainderBtnClicked ? styles.activePaymentCls : ""
              }
            >
              {sendRemainderBtnClicked ? (
                <div className={styles.buttonSubContainer}>
                  <div className={styles.Circle}>
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ color: "green" }}
                    />
                  </div>
                  <div>
                    Email initiated
                    <div className={styles.activePaymentSubClass}>
                      Your payment request is being successfully initiated
                      against the selected Invoices
                    </div>
                  </div>
                </div>
              ) : (
                getButtonLabel(activeTab)
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
