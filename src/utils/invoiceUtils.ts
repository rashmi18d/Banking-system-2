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

export const calculateAndLogDueStatus = (dueDate: string) => {
  const today = new Date();

  const [day, month, year] = dueDate
    .split("/")
    .map((value) => parseInt(value, 10));
  const invoiceDate = new Date(parseInt(`20${year}`, 10), month - 1, day);

  const timeDiff = invoiceDate.getTime() - today.getTime(); // Calculate time difference in milliseconds
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days

  let statusMessage = "";

  if (dayDiff < 0) {
    statusMessage = ` Overdue by ${Math.abs(dayDiff)} days.`; // Negative means overdue
  } else if (dayDiff === 0) {
    statusMessage = `Invoice is due today.`; // Due today
  } else {
    statusMessage = `Upcoming in ${dayDiff} days.`; // Positive means upcoming
  }

  return statusMessage;
};
