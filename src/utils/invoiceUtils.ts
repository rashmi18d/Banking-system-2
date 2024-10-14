export const getButtonLabel = (activeTab: string) => {
  switch (activeTab) {
    case "requestPayment":
      return "Request Payment via Email";
    case "sendRemainder":
      return "Send Reminder via Email";
    default:
      return "";
  }
};

export const isOverdue = (dueDate: string): boolean => {
  const today = new Date();

  const [day, month, year] = dueDate
    .split("/")
    .map((value) => parseInt(value, 10));
  const invoiceDate = new Date(parseInt(`20${year}`, 10), month - 1, day);
  return invoiceDate < today;
};
