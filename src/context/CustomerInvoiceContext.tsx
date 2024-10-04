import React, { createContext, useState, useContext } from "react";

interface CustomerInvoiceContextProps {
  customerIds: string[];
  invoiceIds: string[];
  addCustomerId: (id: string) => void;
  removeCustomerId: (id: string) => void;
  addInvoiceId: (id: string) => void;
  removeInvoiceId: (id: string) => void;
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
  toggleRowSelection: (id: string) => void;
  toggleInvoiceId: (id: string) => void;
}

const CustomerInvoiceContext = createContext<
  CustomerInvoiceContextProps | undefined
>(undefined);

export const CustomerInvoiceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [customerIds, setCustomerIds] = useState<string[]>([]);
  const [invoiceIds, setInvoiceIds] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const addCustomerId = (id: string) => {
    console.log("==> id", id);

    setCustomerIds((prevIds) => [...prevIds, id]);
    console.log(customerIds);
  };

  const removeCustomerId = (id: string) => {
    console.log("==> id", id);
    setCustomerIds((prevIds) =>
      prevIds.filter((customerId) => customerId !== id)
    );
  };

  const addInvoiceId = (id: string) => {
    setInvoiceIds((prevIds) => [...prevIds, id]);
  };

  const removeInvoiceId = (id: string) => {
    setInvoiceIds((prevIds) => prevIds.filter((invoiceId) => invoiceId !== id));
  };

  const toggleInvoiceId = (id: string) => {
    setInvoiceIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((invoiceId) => invoiceId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const toggleRowSelection = (id: string) => {
    const rowsSelected = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(rowsSelected);
    console.log("==> rowsSelected", rowsSelected);

    return rowsSelected.length;
  };

  return (
    <CustomerInvoiceContext.Provider
      value={{
        customerIds,
        invoiceIds,
        addCustomerId,
        removeCustomerId,
        addInvoiceId,
        removeInvoiceId,
        selectedRows,
        setSelectedRows,
        toggleRowSelection,
        toggleInvoiceId,
      }}
    >
      {children}
    </CustomerInvoiceContext.Provider>
  );
};

export const useCustomerInvoiceContext = () => {
  const context = useContext(CustomerInvoiceContext);
  if (!context) {
    throw new Error(
      "useCustomerInvoice must be used within a CustomerInvoiceProvider"
    );
  }
  return context;
};
