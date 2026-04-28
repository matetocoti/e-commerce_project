import { Link } from "react-router-dom";

export type NavLinkItem = {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
};

interface NavigationMenuProps {
  readonly navLinks: NavLinkItem[];
  readonly currentPath: string;
  readonly onLinkClick?: () => void;
  readonly isDesktop?: boolean;
  readonly theme?: "light" | "dark";
}

function isActivePath(currentPath: string, linkPath: string) {
  if (linkPath === "/") {
    return currentPath === "/";
  }
  return currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);
}

function getLightDesktopClass(isActive: boolean, isDisabled?: boolean): string {
  const baseClass =
    "flex items-center gap-2 text-sm font-medium transition-colors";
  const disabledClass = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const activeClass = isActive
    ? "text-blue-600 hover:text-blue-700"
    : "text-gray-600 hover:text-blue-600";
  return `${baseClass} ${disabledClass} ${activeClass}`;
}

function getDarkDesktopClass(isActive: boolean, isDisabled?: boolean): string {
  const baseClass =
    "flex items-center gap-2 text-sm font-medium transition-colors";
  const disabledClass = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const activeClass = isActive
    ? "text-blue-400 hover:text-blue-300"
    : "text-gray-300 hover:text-blue-400";
  return `${baseClass} ${disabledClass} ${activeClass}`;
}

function getLightMobileClass(isActive: boolean, isDisabled?: boolean): string {
  const baseClass = "flex items-center gap-2 rounded-lg px-4 py-2 transition-colors";
  const disabledClass = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const activeClass = isActive
    ? "bg-blue-50 text-blue-600"
    : "text-gray-600 hover:bg-gray-50";
  return `${baseClass} ${disabledClass} ${activeClass}`;
}

function getDarkMobileClass(isActive: boolean, isDisabled?: boolean): string {
  const baseClass = "flex items-center gap-2 rounded-lg px-4 py-2 transition-colors";
  const disabledClass = isDisabled ? "opacity-50 cursor-not-allowed" : "";
  const activeClass = isActive
    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
    : "text-gray-300 hover:bg-gray-800";
  return `${baseClass} ${disabledClass} ${activeClass}`;
}

function getNavLinkClass(
  isActive: boolean,
  isDesktop: boolean,
  theme: "light" | "dark",
  isDisabled?: boolean
): string {
  if (isDesktop) {
    return theme === "light"
      ? getLightDesktopClass(isActive, isDisabled)
      : getDarkDesktopClass(isActive, isDisabled);
  }
  return theme === "light"
    ? getLightMobileClass(isActive, isDisabled)
    : getDarkMobileClass(isActive, isDisabled);
}

export function NavigationMenu({
  navLinks,
  currentPath,
  onLinkClick,
  isDesktop = true,
  theme = "light",
}: Readonly<NavigationMenuProps>) {
  const isActive = (path: string) => isActivePath(currentPath, path);

  return (
    <>
      {navLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.path);

        return (
          <Link
            key={link.path}
            to={link.path}
            onClick={(e) => {
              if (link.disabled) {
                e.preventDefault();
              }
              if (!link.disabled && !isDesktop) {
                onLinkClick?.();
              }
            }}
            className={getNavLinkClass(active, isDesktop, theme, link.disabled)}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
