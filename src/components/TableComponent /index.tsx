import React, { useState, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import CheckboxComponent from "../CheckboxComponent";
import styles from "./table.module.scss";
import { sortArray } from "../../utils/sorting";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";
import { InvoiceType } from "../../types/Invoice";

interface SelectedCustomerDetails {
  [customerId: string]: InvoiceType[];
}

interface CustomerDetails {
  customerId: string | number;
  invoices: {
    data: {
      invoices: InvoiceType[];
    };
  };
}

interface TableComponentProps {
  customerDetails: CustomerDetails;
}

const TableComponent: React.FC<TableComponentProps> = ({ customerDetails }) => {
  const { selectedCustomerDetails, setSelectedCustomerDetails } =
    useCustomerInvoiceContext();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof InvoiceType | "";
    direction: "ascending" | "descending";
  }>({
    key: "",
    direction: "ascending",
  });

  const [, setUpdate] = useState(0);

  const data: InvoiceType[] = customerDetails?.invoices?.data?.invoices || [];

  const requestSort = (key: keyof InvoiceType) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(
    () => sortArray(data, sortConfig.key, sortConfig.direction),
    [data, sortConfig]
  );

  const selectedInvoices =
    selectedCustomerDetails[customerDetails.customerId] || [];

  const handleCheckboxChange = useCallback(
    (checked: boolean, invoice: InvoiceType) => {
      setSelectedCustomerDetails((prevDetails: SelectedCustomerDetails) => {
        const updatedDetails = { ...prevDetails };
        const currentInvoices: InvoiceType[] =
          updatedDetails[customerDetails.customerId] || [];

        if (checked) {
          updatedDetails[customerDetails.customerId] = [
            ...currentInvoices,
            invoice,
          ];
        } else {
          updatedDetails[customerDetails.customerId] = currentInvoices.filter(
            (inv) => inv.invoiceId !== invoice.invoiceId
          );

          if (updatedDetails[customerDetails.customerId].length === 0) {
            delete updatedDetails[customerDetails.customerId];
          }
        }

        setUpdate((prev) => prev + 1);

        return updatedDetails;
      });
    },
    [setSelectedCustomerDetails, customerDetails.customerId]
  );

  const renderCheckbox = (invoice: InvoiceType) => {
    const isChecked = selectedInvoices.some(
      (selectedInvoice) => selectedInvoice.invoiceId === invoice.invoiceId
    );

    return (
      <CheckboxComponent
        checked={isChecked}
        onChange={(e) => handleCheckboxChange(e.target.checked, invoice)}
      />
    );
  };

  const renderSortIcon = (key: keyof InvoiceType) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <FontAwesomeIcon icon={faSortUp} />
      ) : (
        <FontAwesomeIcon icon={faSortDown} />
      );
    }
    return <FontAwesomeIcon icon={faSort} />;
  };

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Invoice#</th>
            <th>Document Details</th>
            <th>Invoice Date</th>
            <th
              onClick={() => requestSort("outstandingAmount")}
              style={{ cursor: "pointer" }}
              className={styles.sortableHeader}
            >
              Outstanding Amount
              <span className={styles.sortIcons}>
                {renderSortIcon("outstandingAmount")}
              </span>
            </th>
            <th
              onClick={() => requestSort("dueDate")}
              style={{ cursor: "pointer" }}
              className={styles.sortableHeader}
            >
              Due Date
              <span className={styles.sortIcons}>
                {renderSortIcon("dueDate")}
              </span>
            </th>
            <th>Status</th>
            <th>Last Reminder</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.invoiceId}>
              <td>{renderCheckbox(row)}</td>
              <td>{row.invoiceId || "--"}</td>
              <td>{row.invoiceNumber || "--"}</td>
              <td>{row.invoiceDate || "--"}</td>
              <td>₹{row.outstandingAmount || "--"}</td>
              <td>{row.dueDate || "--"}</td>
              <td>{row.status || "--"}</td>
              <td>{row.lastRemainder || "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
