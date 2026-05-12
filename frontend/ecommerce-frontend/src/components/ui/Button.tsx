import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "ghost";

type ButtonSize =
  | "default"
  | "sm"
  | "lg"
  | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly children?: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:bg-blue-800",

  destructive:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md active:bg-red-800",

  outline:
    "border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  default:
    "h-10 px-4 text-sm sm:h-11 sm:px-5 sm:text-[15px]",

  sm:
    "h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm",

  lg:
    "h-11 px-5 text-sm sm:h-12 sm:px-6 sm:text-base",

  icon:
    "h-10 w-10 sm:h-11 sm:w-11 p-0",
};

export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  type = "button",
  ...props
}: Readonly<ButtonProps>) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-semibold",
        "whitespace-nowrap",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "disabled:shadow-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}