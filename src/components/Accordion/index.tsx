import React, { useState, useCallback } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./accordion.module.scss";
import CheckboxComponent from "../CheckboxComponent";
import SimpleTable from "../TableComponent ";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext"; // Adjust the path as needed

interface AccordionProps {
  hasCheckbox: boolean;
  id: string | number;
  customerDetails: any;
  customerName: string;
  children: React.ReactNode;
}

interface Invoice {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  invoiceDate: string;
  outstandingAmount: string;
  dueDate: string;
  status: string | null;
  lastRemainder: string;
  invoiceAmount: string;
  discount: string;
  region: string | null;
  division: string;
  documentType: string;
  documentNumber: string;
  additionalInfo: Array<{
    label: string;
    value: string;
    sequence: number;
  }>;
}

const Accordion: React.FC<AccordionProps> = ({
  customerDetails,
  hasCheckbox,
  id,
  children,
}) => {
  const { toggleInvoiceId } = useCustomerInvoiceContext();
  const [expandedAccordion, setExpandedAccordion] = useState<string | number>(
    ""
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  // Assume this is part of your component where invoices are rendered
  const handleCheckboxChange = (
    checked: boolean | "intermediate",
    invoices: Invoice[]
  ) => {
    if (checked === "intermediate") {
      setIsIndeterminate(true);
      setSelectAll(false);
    } else {
      setSelectAll(true);
      setIsChecked(checked);
      setIsIndeterminate(false);

      // If checked is true, add all invoice IDs from the selected customer
      if (checked) {
        invoices.forEach((invoice) => {
          toggleInvoiceId(invoice.invoiceId);
        });
      }
      //  {
      //   // If unchecked, remove all invoice IDs from the selected customer
      //   invoices.forEach((invoice) => {
      //     removeInvoiceId(invoice.invoiceId); // This should be your existing remove function
      //   });
      // }
    }
  };

  // Example of calling this function
  // Assuming `customerInvoices` is the invoice data for the selected customer
  // handleCheckboxChange(isChecked, customerInvoices.invoices.data.invoices);

  const handleIconClick = useCallback(
    (customerId: string | number) => {
      setExpandedAccordion(expandedAccordion === customerId ? "" : customerId);
    },
    [expandedAccordion]
  );

  return (
    <div className={styles.accordionContainer}>
      <div key={id} className={styles.subContainer}>
        {hasCheckbox && (
          <CheckboxComponent
            checked={isChecked}
            onChange={(e) =>
              handleCheckboxChange(
                e.target.checked,
                customerDetails?.invoices?.data?.invoices
              )
            }
            indeterminate={isIndeterminate}
          />
        )}
        {children}
        <FontAwesomeIcon
          onClick={() => handleIconClick(id)}
          icon={faAngleDown}
          className={`${styles.arrowIcon} ${
            expandedAccordion === id ? styles.rotate : ""
          }`}
        />
      </div>
      {expandedAccordion === id && (
        <div>
          <SimpleTable
            customerDetails={customerDetails}
            selectAll={selectAll}
            handleIntermediateChange={handleCheckboxChange}
          />
        </div>
      )}
    </div>
  );
};

export default Accordion;
