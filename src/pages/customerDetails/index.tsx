import React, { useState } from "react";
import Accordion from "../../components/Accordion";
import customerDetails from "../../../data/customer.json";
import styles from "./customerDetails.module.scss";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const CustomerDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headerKeys = [
    "customerId",
    "totalInvoices",
    "outstandingAmount",
    "overDueInvoices",
    "overDueAmount",
    "creditOrDebitNote",
  ];

  const formatHeaderKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div>
      <div className={styles.buttonContainer}>
        <Button
          variant="secondary"
          withIcon={true}
          onClick={() => setIsModalOpen(true)}
        >
          Request Payment
        </Button>
        <Button
          variant="secondary"
          withIcon={true}
          onClick={() => alert("Filter icon")}
        >
          Filter
        </Button>
        <Button
          variant="secondary"
          withIcon={true}
          onClick={() => alert("Sort")}
        >
          Sort
        </Button>
      </div>

      {customerDetails.data.data.map((customer: any) => {
        return (
          <div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2>Modal Title</h2>
              <p>This is the content of the modal.</p>
            </Modal>
            <Accordion
              hasCheckbox={true}
              id={customer.customerId}
              key={customer.customerId}
              customerDetails={customer}
              customerName={customer.customerName}
            >
              <div className={styles.customerName}>{customer.customerName}</div>
              <div className={styles.accordionContent}>
                <div className={styles.customerTable}>
                  <div className={styles.customerHeader}>
                    {headerKeys.map((key) => (
                      <span key={key}>{formatHeaderKey(key)}</span>
                    ))}
                  </div>
                  <div className={styles.customerRow}>
                    {headerKeys.map((key) => (
                      <span key={key}>{customer[key]}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
};

export default CustomerDetails;
