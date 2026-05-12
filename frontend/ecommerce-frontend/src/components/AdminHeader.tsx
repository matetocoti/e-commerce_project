import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, Store, Menu, X } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/60 bg-gray-900/95 backdrop-blur-xl shadow-md shadow-gray-950/50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          <Link
            to="/admin/products"
            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Logo size="md" variant="white" />
            <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-300 shadow-inner transition-all duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-500/20">
              Admin
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavigationMenu
              navLinks={navLinks}
              currentPath={pathname}
              isDesktop
              theme="dark"
            />
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-3 pr-4 border-r border-gray-700/80">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-300 font-semibold text-sm border border-gray-700">
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-400">
                  Olá, <span className="font-semibold text-gray-200">{user?.username}</span>
                </span>
              </div>

              <Link to="/" aria-label="Voltar para loja">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9 rounded-full px-4 border-gray-700 bg-transparent text-gray-300 hover:border-gray-600 hover:bg-gray-800 transition-all"
                >
                  <Store className="h-4 w-4 text-gray-400" />
                  Loja
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 h-9 rounded-full px-4 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                aria-label="Sair"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-10 w-10 pl-2 rounded-full text-gray-300 hover:bg-gray-800"
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
          <div className="absolute left-0 top-full w-full bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-xl shadow-black/40 md:hidden animate-in slide-in-from-top-2 origin-top">
            <div className="px-4 py-6 space-y-4">
              <nav className="space-y-1">
                <NavigationMenu
                  navLinks={navLinks}
                  currentPath={pathname}
                  onLinkClick={() => setMobileMenuOpen(false)}
                  isDesktop={false}
                  theme="dark"
                />
              </nav>

              <div className="border-t border-gray-800 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-gray-200 font-bold border border-gray-600">
                      {user?.username?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Painel Admin</span>
                      <span className="text-sm font-bold text-gray-200">{user?.username}</span>
                    </div>
                  </div>

                  <div className="space-y-1 px-2">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                      <Store className="h-5 w-5 text-gray-400" />
                      Voltar para a Loja
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-5 w-5" />
                      Sair do painel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
