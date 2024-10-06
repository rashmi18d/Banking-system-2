import React, { useCallback, useEffect, useMemo } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./accordion.module.scss";
import CheckboxComponent from "../CheckboxComponent";
import TableComponent from "../TableComponent ";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import { InvoiceType } from "../../types/Invoice";

interface AccordionProps {
  hasCheckbox: boolean;
  id: string | number;
  customerDetails: any;
  customerName: string;
  children: React.ReactNode;
  handleAccordionClick: (id: string | number) => void;
  isExpanded: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  customerDetails,
  hasCheckbox,
  id,
  children,
  handleAccordionClick,
  isExpanded,
}) => {
  const { selectedCustomerDetails, setSelectedCustomerDetails } =
    useCustomerInvoiceContext();

  const handleIconClick = useCallback(() => {
    handleAccordionClick(id);
  }, [id, handleAccordionClick]);

  const allInvoices = customerDetails?.invoices?.data?.invoices || [];
  const selectedInvoices = selectedCustomerDetails[id] || [];

  const isSelectAll = useMemo(() => {
    return (
      selectedInvoices.length === allInvoices.length && allInvoices.length > 0
    );
  }, [selectedInvoices, allInvoices]);

  const isIndeterminate = useMemo(() => {
    return (
      selectedInvoices.length > 0 &&
      selectedInvoices.length < allInvoices.length
    );
  }, [selectedInvoices, allInvoices]);

  useEffect(() => {
    console.log("==> selectedCustomerDetails", selectedCustomerDetails);
  }, [selectedCustomerDetails]);

  const handleCheckboxChange = (checked: boolean, invoices: InvoiceType[]) => {
    setSelectedCustomerDetails((prevDetails: any) => {
      const updatedDetails = { ...prevDetails };
      if (checked) {
        updatedDetails[id] = invoices;
      } else {
        delete updatedDetails[id];
      }
      return updatedDetails;
    });
  };

  return (
    <div className={styles.accordionContainer}>
      <div className={styles.subContainer}>
        {hasCheckbox && (
          <CheckboxComponent
            checked={isSelectAll}
            indeterminate={isIndeterminate}
            onChange={(e) => {
              handleCheckboxChange(
                e.target.checked,
                customerDetails?.invoices?.data?.invoices || []
              );
            }}
          />
        )}
        {children}
        <FontAwesomeIcon
          onClick={handleIconClick}
          icon={faAngleDown}
          className={`${styles.arrowIcon} ${isExpanded ? styles.rotate : ""}`}
        />
      </div>
      {isExpanded && <TableComponent customerDetails={customerDetails} />}
    </div>
  );
};

export default Accordion;
