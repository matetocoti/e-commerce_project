import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AppToaster } from "../components/ui/AppToaster";
import { useCart } from "../hooks/cart/useCart";

export function DefaultLayout() {
  const { cart, reloadCart } = useCart();
  const cartCount = cart?.items?.length ?? 0;

  useEffect(() => {
    const interval = setInterval(() => {
      void reloadCart();
    }, 2000);

    return () => clearInterval(interval);
  }, [reloadCart]);
  
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