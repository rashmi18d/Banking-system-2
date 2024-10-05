import React, { useState, useCallback } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./accordion.module.scss";
import CheckboxComponent from "../CheckboxComponent";
import SimpleTable from "../TableComponent ";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";

interface AccordionProps {
  hasCheckbox: boolean;
  id: string | number;
  customerDetails: any;
  customerName: string;
  children: React.ReactNode;
  handleAccordionClick: (id: string | number) => void; // Accepts function from parent
  isExpanded: boolean; // Controls whether the accordion is expanded or not
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
  handleAccordionClick,
  isExpanded, // Whether this accordion is expanded or not
}) => {
  const { toggleInvoiceId, removeInvoiceId } = useCustomerInvoiceContext();
  const [isChecked, setIsChecked] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

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

  const handleIconClick = useCallback(() => {
    handleAccordionClick(id);
  }, [id, handleAccordionClick]);

  return (
    <div className={styles.accordionContainer}>
      <div className={styles.subContainer}>
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
          onClick={handleIconClick}
          icon={faAngleDown}
          className={`${styles.arrowIcon} ${isExpanded ? styles.rotate : ""}`}
        />
      </div>
      {isExpanded && (
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
