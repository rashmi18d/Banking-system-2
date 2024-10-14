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
