import { Outlet } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
import { AppToaster } from "../components/ui/AppToaster";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen flex-col">
        <AdminHeader />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <AppToaster />
    </div>
  );
}