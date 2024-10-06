import { useState } from "react";
import Accordion from "../../components/Accordion";
import customerDetails from "../../../data/customer.json";
import styles from "./customerDetails.module.scss";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";

const CustomerDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | number>(
    ""
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleAccordionClick = (id: string | number) => {
    setExpandedAccordion(expandedAccordion === id ? "" : id);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomerData = customerDetails.data.data.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

      {currentCustomerData.map((customer: any) => {
        return (
          <div key={customer.customerId}>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2>Modal Title</h2>
              <p>This is the content of the modal.</p>
            </Modal>
            <Accordion
              hasCheckbox={true}
              id={customer.customerId}
              customerDetails={customer}
              customerName={customer.customerName}
              handleAccordionClick={() =>
                handleAccordionClick(customer.customerId)
              }
              isExpanded={expandedAccordion === customer.customerId}
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(customerDetails.data.data.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomerDetails;
