import React, { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import CheckboxComponent from "../CheckboxComponent";
import styles from "./simpletable.module.scss";
import { sortArray } from "../../utils/sorting";
import { useCustomerInvoiceContext } from "../../context/CustomerInvoiceContext";

interface Invoice {
  invoiceId: string;
  documentType: string;
  invoiceDate: string;
  outstandingAmount: string;
  dueDate: string;
  status: string | null;
  lastReminder: string;
}

interface CustomerDetails {
  invoices: {
    data: {
      invoices: Invoice[];
    };
  };
}

interface TableComponentProps {
  customerDetails: CustomerDetails;
  selectAll: boolean;
  handleIntermediateChange: (
    checked: boolean | "intermediate",
    arg2: any
  ) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  customerDetails,
  selectAll,
  handleIntermediateChange,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ascending",
  });
  const { selectedRows, setSelectedRows, toggleRowSelection } =
    useCustomerInvoiceContext();

  const data = customerDetails?.invoices?.data?.invoices || [];

  const handleCheckboxChange = (id: string) => {
    const rowsSelected = toggleRowSelection(id); // rowsSelected is now correctly returned
    console.log(rowsSelected, "rowsSelected2");

    invoiceCheckboxMethod(rowsSelected); // Now rowsSelected.length is valid
  };

  useEffect(() => {
    if (selectAll) {
      const allInvoiceIds = data.map((row: any) => row.invoiceId);
      const uniqueInvoiceIds = Array.from(
        new Set([...selectedRows, ...allInvoiceIds])
      );
      setSelectedRows(uniqueInvoiceIds);
    } else {
      console.log("==> ntg");
    }
  }, [selectAll]);

  const invoiceCheckboxMethod = (selectedCount: any) => {
    const totalInvoices = selectedRows.length;
    // const customerInvoices = data.length;

    if (selectedCount > 0 && selectedCount < totalInvoices) {
      handleIntermediateChange("intermediate", ""); // Trigger intermediate state
    } else if (selectedCount === totalInvoices) {
      handleIntermediateChange(true, ""); // All selected
    } else {
      handleIntermediateChange(false, ""); // None selected
    }
  };

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = useMemo(
    () => sortArray(data, sortConfig.key, sortConfig.direction),
    [data, sortConfig]
  );

  const renderSortIcon = (key: string) => {
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
              <td>
                <CheckboxComponent
                  checked={
                    selectedRows.includes(row.invoiceId) && row.invoiceId
                  }
                  onChange={() => handleCheckboxChange(row.invoiceId)}
                />
              </td>
              <td>{row?.invoiceId || "N/A"}</td>
              <td>{row?.documentType || "N/A"}</td>
              <td>{row?.invoiceDate || "N/A"}</td>
              <td>{row?.outstandingAmount || "N/A"}</td>
              <td>{row?.dueDate || "N/A"}</td>
              <td>{row?.status || "Pending"}</td>
              <td>{row?.lastReminder || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
