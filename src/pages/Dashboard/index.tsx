import { useState } from "react";
import Accordion from "../../components/Accordion";
import customerDetails from "../../../data/customer.json";
import styles from "./dashboard.module.scss";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import InvoicesModal from "../../components/InvoicesModal";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";

const Dashboard = () => {
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] = useState(false);
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
      .replace(/or/gi, " / ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const formatValue = (key: string, value: string | number) => {
    if (key === "outstandingAmount" || key === "overDueAmount") {
      return `₹ ${value}`;
    }
    return value;
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

  const totalPages = Math.ceil(customerDetails.data.data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Extract overdue and due information from context
  const { overdueInvoicesCount, remainderInvoicesCount } =
    useCustomerInvoiceContext();

  // Determine the button text based on the invoice counts
  const getButtonText = () => {
    if (overdueInvoicesCount > 0 && remainderInvoicesCount > 0) {
      return "Request Payment / Send Reminder";
    } else if (overdueInvoicesCount > 0) {
      return "Request Payment";
    } else if (remainderInvoicesCount > 0) {
      return "Send Reminder";
    }
    // When neither overdue nor remainder invoices are selected, still show both
    return "Request Payment / Send Reminder";
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.headerContainer}>
        <div className={styles.customerInfo}>
          {`Showing ${currentCustomerData.length} out of ${customerDetails.data.data.length} customers`}
        </div>

        <div className={styles.buttonContainer}>
          <Button
            variant="secondary"
            withIcon={true}
            onClick={() => setIsInvoicesModalOpen(true)}
            disabled={
              overdueInvoicesCount === 0 && remainderInvoicesCount === 0
            }
          >
            {getButtonText()}
          </Button>
          <Button
            variant="secondary"
            withIcon={true}
            onClick={() => alert("Filter icon")}
            disabled={true}
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            withIcon={true}
            onClick={() => alert("Sort")}
            disabled={true}
          >
            Sort
          </Button>
        </div>
      </div>
      <div className={styles.dataContainer}>
        {currentCustomerData.map((customer: any) => {
          return (
            <div key={customer.customerId}>
              {isInvoicesModalOpen && (
                <InvoicesModal
                  isOpen={isInvoicesModalOpen}
                  onClose={() => setIsInvoicesModalOpen(false)}
                />
              )}
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
                <div className={styles.customerName}>
                  {customer.customerName}
                </div>
                <div className={styles.accordionContent}>
                  <div className={styles.customerTable}>
                    <div className={styles.customerHeader}>
                      {headerKeys.map((key) => (
                        <span key={key}>{formatHeaderKey(key)}</span>
                      ))}
                    </div>
                    <div className={styles.customerRow}>
                      {headerKeys.map((key) => (
                        <span
                          key={key}
                          className={
                            key.includes("overDue") ? styles.overDueClass : ""
                          }
                        >
                          {formatValue(key, customer[key])}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Accordion>
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Dashboard;
