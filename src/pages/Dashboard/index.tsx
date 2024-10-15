import { useState, useEffect } from "react";
import Accordion from "../../components/Accordion";
import customerDetails from "../../../data/customer.json";
import styles from "./dashboard.module.scss";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";
import InvoicesModal from "../../components/InvoicesModal";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import CheckboxComponent from "../../components/CheckboxComponent";
import { CustomerDetailsType, InvoiceType } from "../../types/Invoice";

const Dashboard: React.FC = () => {
  const [isInvoicesModalOpen, setIsInvoicesModalOpen] =
    useState<boolean>(false);

  const [expandedAccordion, setExpandedAccordion] = useState<string | number>(
    ""
  );

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [allCustomers, setAllCustomers] = useState<CustomerDetailsType[]>([]);

  const [buttonText, setButtonText] = useState<string>(
    "Request Payment / Send Reminder"
  );

  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

  const [indeterminate, setIndeterminate] = useState<boolean>(false);

  const itemsPerPage = 5;
  const {
    selectedCustomerDetails,
    setSelectedCustomerDetails,
    overdueInvoicesCount,
    remainderInvoicesCount,
  } = useCustomerInvoiceContext();

  useEffect(() => {
    setAllCustomers(customerDetails.data.data);
  }, []);

  useEffect(() => {
    const selectedCount = Object.keys(selectedCustomerDetails).length;
    setIsAllChecked(selectedCount === allCustomers.length);
    setIndeterminate(selectedCount > 0 && selectedCount < allCustomers.length);
    updateButtonText();
  }, [
    selectedCustomerDetails,
    allCustomers,
    overdueInvoicesCount,
    remainderInvoicesCount,
  ]);

  const headerKeys: string[] = [
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

  const formatValue = (
    key: keyof CustomerDetailsType,
    value: string | { data: { invoices: InvoiceType[] | [] } } | undefined
  ) => {
    if (!value) {
      return "-";
    }

    if (typeof value === "object") {
      const invoiceCount = value.data?.invoices?.length || 0;
      return `${invoiceCount} Invoices`;
    }

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
  const currentCustomerData = allCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(allCustomers.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const updateButtonText = () => {
    if (overdueInvoicesCount > 0 && remainderInvoicesCount > 0) {
      setButtonText("Request Payment / Send Reminder");
    } else if (overdueInvoicesCount > 0) {
      setButtonText("Request Payment");
    } else if (remainderInvoicesCount > 0) {
      setButtonText("Send Reminder");
    } else {
      setButtonText("Request Payment / Send Reminder");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const updatedSelectedInvoices = {} as { [key: string]: any[] };
      allCustomers.forEach((customer) => {
        updatedSelectedInvoices[customer.customerId] =
          customer.invoices?.data?.invoices || [];
      });
      setSelectedCustomerDetails(updatedSelectedInvoices);
    } else {
      setSelectedCustomerDetails({});
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.headerContainer}>
        <div className={styles.customerInfo}>
          {`Showing ${currentCustomerData.length} out of ${allCustomers.length} customers`}
        </div>

        <div className={styles.buttonContainer}>
          <Button
            variant="secondary"
            onClick={() => setIsInvoicesModalOpen(true)}
            disabled={
              overdueInvoicesCount === 0 && remainderInvoicesCount === 0
            }
          >
            {buttonText}
          </Button>
          <Button
            variant="secondary"
            onClick={() => alert("Filter icon")}
            disabled={true}
          >
            Filter
          </Button>
          <Button
            variant="secondary"
            onClick={() => alert("Sort")}
            disabled={true}
          >
            Sort
          </Button>
        </div>
      </div>

      <CheckboxComponent
        onChange={(e) => handleSelectAll(e.target.checked)}
        checked={isAllChecked}
        indeterminate={indeterminate}
      />

      <div className={styles.dataContainer}>
        {currentCustomerData.map((customer: CustomerDetailsType) => {
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
                          {formatValue(
                            key as keyof CustomerDetailsType,
                            customer[key as keyof CustomerDetailsType] || ""
                          )}
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
