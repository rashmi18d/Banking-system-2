import "./App.css";
import { CustomerInvoiceProvider } from "./context/CustomerInvoiceContext";
import CustomerDetails from "./pages/customerDetails";

function App() {
  return (
    <CustomerInvoiceProvider>
      <CustomerDetails />
    </CustomerInvoiceProvider>
  );
}

export default App;
