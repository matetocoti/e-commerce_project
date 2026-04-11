import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AppToaster } from "../components/ui/AppToaster";

export function DefaultLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen flex-col">
        <Header cartItemsCount={0} />

        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <AppToaster />
    </div>
  );
}