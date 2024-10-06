import React, { createContext, useState, useContext } from "react";
import { InvoiceType } from "../types/Invoice";

interface SelectedCustomerDetails {
  [customerId: string]: InvoiceType[];
}

interface CustomerInvoiceContextProps {
  selectedCustomerDetails: SelectedCustomerDetails;
  setSelectedCustomerDetails: (data: any) => void;
}

const CustomerInvoiceContext = createContext<
  CustomerInvoiceContextProps | undefined
>(undefined);

export const CustomerInvoiceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedCustomerDetails, setSelectedCustomerDetails] =
    useState<SelectedCustomerDetails>({});

  return (
    <CustomerInvoiceContext.Provider
      value={{
        selectedCustomerDetails,
        setSelectedCustomerDetails,
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
      "useCustomerInvoiceContext must be used within a CustomerInvoiceProvider"
    );
  }
  return context;
};
