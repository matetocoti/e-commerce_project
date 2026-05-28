import { Outlet } from "react-router-dom";
import { usePolling } from "../hooks/ui/usePolling";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AppToaster } from "../components/ui/AppToaster";
import { useCart } from "../hooks/cart/useCart";

export function DefaultLayout() {
  const { cart, reloadCart } = useCart();
  const cartCount = cart?.items?.length ?? 0;

  usePolling(() => reloadCart(), 3000);
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen flex-col">
        <Header cartItemsCount={cartCount} />

        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <AppToaster />
    </div>
  );
}