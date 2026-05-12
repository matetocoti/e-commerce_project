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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-lg shadow-sm shadow-gray-100/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <Link to="/" className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavigationMenu
              navLinks={navLinks}
              currentPath={location.pathname}
              isDesktop
              theme="light"
            />
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/cart" aria-label="Ir para o carrinho">
              <Button variant="ghost" size="icon" className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                <ShoppingCart className="h-[22px] w-[22px]" />
                {cartItemsCount > 0 && (
                  <span className="absolute right-0 top-0 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] sm:text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 pr-4 border-r border-gray-200/80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                      {user?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Olá, <span className="font-semibold">{user?.username}</span>
                    </span>
                  </div>

                  {user?.role === UserRole.Admin && (
                    <Link to="/admin/products">
                      <Button variant="outline" size="sm" className="gap-2 h-9 rounded-full px-4 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
                        <BarChart3 className="h-4 w-4 text-gray-500" />
                        Admin
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 h-9 rounded-full px-4 text-gray-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <div className="pl-2">
                  <Link to="/login">
                    <Button variant="default" size="sm" className="gap-2 h-10 rounded-full px-6 bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-300">
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 rounded-full text-gray-600 hover:bg-gray-100"
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
          <div className="absolute left-0 top-full w-full bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-xl shadow-gray-200/50 md:hidden animate-in slide-in-from-top-2 origin-top">
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-1">
                <NavigationMenu
                  navLinks={navLinks}
                  currentPath={location.pathname}
                  onLinkClick={() => setMobileMenuOpen(false)}
                  isDesktop={false}
                  theme="light"
                />
              </nav>

              <div className="border-t border-gray-100 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-2xl">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Bem-vindo(a)</span>
                        <span className="text-sm font-bold text-gray-900">{user?.username}</span>
                      </div>
                    </div>

                    <div className="space-y-1 px-2">
                      {user?.role === UserRole.Admin && (
                        <Link
                          to="/admin/products"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                        >
                          <BarChart3 className="h-5 w-5" />
                          Painel Admin
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-5 w-5" />
                        Sair da conta
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-lg"
                    >
                      <LogIn className="h-5 w-5" />
                      Fazer Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}