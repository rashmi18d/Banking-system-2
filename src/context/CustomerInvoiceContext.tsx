import React, { createContext, useState, useContext, useEffect } from "react";
import { InvoiceType } from "../types/Invoice";

interface SelectedCustomerDetails {
  [customerId: string]: InvoiceType[];
}

interface CustomerInvoiceContextProps {
  selectedCustomerDetails: SelectedCustomerDetails;
  setSelectedCustomerDetails: (data: any) => any;
  overdueInvoicesCount: number;
  remainderInvoicesCount: number;
  overdueTotalAmount: number;
  remainderTotalAmount: number;
  overdueCustomers: Set<string>;
  remainderCustomers: Set<string>;
  processCustomerDetails: () => void;
}

const CustomerInvoiceContext = createContext<
  CustomerInvoiceContextProps | undefined
>(undefined);

export const CustomerInvoiceProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedCustomerDetails, setSelectedCustomerDetails] =
    useState<SelectedCustomerDetails>({});
  const [overdueInvoicesCount, setOverdueInvoicesCount] = useState<number>(0);
  const [remainderInvoicesCount, setRemainderInvoicesCount] =
    useState<number>(0);
  const [overdueTotalAmount, setOverdueTotalAmount] = useState<number>(0);
  const [remainderTotalAmount, setRemainderTotalAmount] = useState<number>(0);
  const [overdueCustomers, setOverdueCustomers] = useState<Set<string>>(
    new Set()
  );
  const [remainderCustomers, setRemainderCustomers] = useState<Set<string>>(
    new Set()
  );

  const today = new Date();

  const isOverdue = (dueDate: string): boolean => {
    const [day, month, year] = dueDate.split("/").map(Number);
    const invoiceDueDate = new Date(year + 2000, month - 1, day);
    return invoiceDueDate < today;
  };

  const processCustomerDetails = () => {
    let overdueInvoices = 0;
    let remainderInvoices = 0;
    let overdueTotal = 0;
    let remainderTotal = 0;
    const overdueCustomersSet = new Set<string>();
    const remainderCustomersSet = new Set<string>();

    Object.keys(selectedCustomerDetails).forEach((customerId) => {
      const customerInvoices = selectedCustomerDetails[customerId];

      let hasOverdue = false;
      let hasRemainder = false;

      customerInvoices.forEach((invoice) => {
        const outstandingAmount = parseFloat(invoice.outstandingAmount) || 0;

        if (isOverdue(invoice.dueDate)) {
          overdueInvoices += 1;
          overdueTotal += outstandingAmount;
          hasOverdue = true;
        } else {
          remainderInvoices += 1;
          remainderTotal += outstandingAmount;
          hasRemainder = true;
        }
      });

      if (hasOverdue) overdueCustomersSet.add(customerId);
      if (hasRemainder) remainderCustomersSet.add(customerId);
    });

    setOverdueInvoicesCount(overdueInvoices);
    setOverdueTotalAmount(overdueTotal);
    setOverdueCustomers(overdueCustomersSet);

    setRemainderInvoicesCount(remainderInvoices);
    setRemainderTotalAmount(remainderTotal);
    setRemainderCustomers(remainderCustomersSet);
  };

  useEffect(() => {
    processCustomerDetails();
  }, [selectedCustomerDetails]);

  return (
    <CustomerInvoiceContext.Provider
      value={{
        selectedCustomerDetails,
        setSelectedCustomerDetails,
        overdueInvoicesCount,
        remainderInvoicesCount,
        overdueTotalAmount,
        remainderTotalAmount,
        overdueCustomers,
        remainderCustomers,
        processCustomerDetails,
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
