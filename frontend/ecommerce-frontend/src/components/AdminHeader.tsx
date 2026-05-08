import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Store, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";
import { Button } from "./ui/Button";
import { NavigationMenu, type NavLinkItem } from "./ui/NavigationMenu";

const navLinks: NavLinkItem[] = [
  //{ path: "/admin/products", label: "Produtos", icon: Package },
];


export function AdminHeader() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
  }

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

          <nav className="hidden items-center gap-6 md:flex  border-gray-700 ">
            <NavigationMenu
              navLinks={navLinks}
              currentPath={pathname}
              isDesktop
              theme="dark"
            />
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-gray-300">{user?.username}</span>

              <Link to="/" aria-label="Voltar para loja">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Store className="h-5 w-5" />
                </Button>
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded px-3 py-1 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="space-y-2 border-t border-gray-700 py-4 md:hidden">
            <NavigationMenu
              navLinks={navLinks}
              currentPath={pathname}
              onLinkClick={() => setMobileMenuOpen(false)}
              isDesktop={false}
              theme="dark"
            />

            <div className="border-t border-gray-700 pt-2">
              <div className="px-4 py-2 text-sm text-gray-400">{user?.username}</div>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800"
              >
                <Store className="h-4 w-4" />
                Voltar para Loja
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-300 transition-colors hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}