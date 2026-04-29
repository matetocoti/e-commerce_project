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

import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
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
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-600 to-purple-600" />
            <span className="text-xl font-bold text-gray-900">TechStore</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex  border-gray-200 ">
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
                  <Badge className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-0 bg-red-600 px-1 text-[10px] font-bold text-white">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </Badge>
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