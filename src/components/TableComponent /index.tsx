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
import { InvoiceTableHeaders } from "../../constants/invoiceTable";
import { calculateAndLogDueStatus } from "../../utils/invoiceUtils";

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
            {InvoiceTableHeaders.map((column) => (
              <th
                key={column.key}
                onClick={() =>
                  column.sortable
                    ? requestSort(column.key as keyof InvoiceType)
                    : undefined
                }
                style={{ cursor: column.sortable ? "pointer" : "default" }}
                className={column.sortable ? styles.sortableHeader : ""}
              >
                {column.label}
                {column.sortable && (
                  <span className={styles.sortIcons}>
                    {renderSortIcon(column.key as keyof InvoiceType)}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.invoiceId}>
              {InvoiceTableHeaders.map((column) => {
                if (column.key === "status") {
                  return (
                    <td key={column.key}>
                      <div className={styles.statusClass}>
                        {calculateAndLogDueStatus(row?.dueDate)}
                      </div>
                    </td>
                  );
                }

                if (column.key === "checkbox") {
                  return <td key={column.key}>{renderCheckbox(row)}</td>;
                }

                return (
                  <td key={column.key}>
                    {row[column.key as keyof InvoiceType] || "--"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
