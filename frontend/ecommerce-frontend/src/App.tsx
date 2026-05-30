import AppRoutes from "./routes/AppRoutes";
import { AppToaster } from "./components/ui/AppToaster";
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <CartProvider>
      <AppRoutes />
      <AppToaster />
    </CartProvider>
  );
}

export default App;