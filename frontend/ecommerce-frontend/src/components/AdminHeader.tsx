import { Link } from "react-router-dom";
import { LogOut, Store } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";
import { Button } from "./ui/Button";

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/admin/products" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-600 to-purple-600" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">TechStore</span>
              <span className="text-xs text-gray-400">Admin</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/admin/products"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400"
            >
              Produtos
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">{user?.username}</span>

            <Link to="/" aria-label="Voltar para loja">
              <Button variant="outline" size="icon" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Store className="h-5 w-5" />
              </Button>
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded px-3 py-1 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
              aria-label="Sair"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}