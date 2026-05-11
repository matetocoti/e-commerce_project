import { useState } from "react";
import {
  ShoppingCart,
  Package,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { NavigationMenu, type NavLinkItem } from "./ui/NavigationMenu";
import { useAuth } from "../hooks/auth/useAuth";
import { UserRole } from "../types/user";

interface HeaderProps {
  readonly cartItemsCount?: number;
}

const navLinks: NavLinkItem[] = [
  { path: "/", label: "Produtos", icon: Package },
  { path: "/orders", label: "Pedidos", icon: Package },
  { path: "/account", label: "Conta", icon: User},
];

export function Header({ cartItemsCount = 0 }: Readonly<HeaderProps>) {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 border-gray-200 md:flex">
            <NavigationMenu
              navLinks={navLinks}
              currentPath={location.pathname}
              isDesktop
              theme="light"
            />
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/cart" aria-label="Ir para o carrinho">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-red-600 text-[10px] sm:text-[11px] font-bold text-white shadow-sm">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden items-center gap-2 md:flex">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Olá, {user?.username}
                  </span>

                  {user?.role === UserRole.Admin && (
                    <Link to="/admin/products">
                      <Button variant="outline" size="sm" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <Link to="/login">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
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
          <nav className="space-y-2 border-t border-gray-200 py-4 md:hidden">
            <NavigationMenu
              navLinks={navLinks}
              currentPath={location.pathname}
              onLinkClick={() => setMobileMenuOpen(false)}
              isDesktop={false}
              theme="light"
            />

            <div className="border-t border-gray-200 pt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Olá, {user?.username}
                  </div>

                  {user?.role === UserRole.Admin && (
                    <Link
                      to="/admin/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Painel Admin
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4" />
                  Entrar
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}