import { Package } from "lucide-react";

interface LogoProps {
  readonly className?: string;
  readonly size?: "sm" | "md" | "lg";
  readonly variant?: "default" | "light" | "white";
  readonly hideText?: boolean;
}

const sizeConfig = {
  sm: {
    container: "w-8 h-8 rounded-lg",
    icon: "w-4 h-4",
    textSize: "text-lg",
    dot: "w-1 h-1 mb-1",
    gap: "gap-2",
  },
  md: {
    container: "w-10 h-10 rounded-xl",
    icon: "w-5 h-5",
    textSize: "text-2xl",
    dot: "w-1.5 h-1.5 mb-1.5",
    gap: "gap-3",
  },
  lg: {
    container: "w-14 h-14 rounded-2xl",
    icon: "w-7 h-7",
    textSize: "text-4xl",
    dot: "w-2 h-2 mb-2",
    gap: "gap-4",
  },
};

const variantConfig = {
  default: {
    container:
      "bg-blue-700 text-white shadow-blue-700/20 hover:bg-blue-800",
    textColor: "text-gray-900",
    dot: "bg-blue-700",
  },

  light: {
    container:
      "bg-blue-50 text-blue-700 border border-blue-100 shadow-blue-900/5 hover:bg-blue-100",
    textColor: "text-gray-900",
    dot: "bg-blue-700",
  },

  white: {
    container:
      "bg-white text-blue-700 shadow-black/5 hover:bg-gray-50 border-gray-200",
    textColor: "text-white",
    dot: "bg-white",
  },
};

export function Logo({
  className = "",
  size = "md",
  variant = "default",
  hideText = false,
}: LogoProps) {
  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  return (
    <div
      className={`group flex select-none items-center ${currentSize.gap} ${className}`}
    >
      <div
        className={`
          relative flex items-center justify-center overflow-hidden
          transition-all duration-200
          shadow-lg
          group-hover:scale-[1.00]
          group-active:scale-[0.98]
          ${currentSize.container}
          ${currentVariant.container}
        `}
      >
        <div
          className="
            absolute inset-0 opacity-0
            bg-white mix-blend-overlay
            transition-opacity duration-200
            group-hover:opacity-10
          "
        />

        <Package
          strokeWidth={2.5}
          className={`
            relative z-10
            transition-transform duration-200
            group-hover:-rotate-2
            ${currentSize.icon}
          `}
        />
      </div>

      {!hideText && (
        <div className="flex items-end font-bold leading-none tracking-tight">
          <span
            className={`
              transition-colors
              tracking-tighter
              ${currentVariant.textColor}
              ${currentSize.textSize}
            `}
          >
            TechStore
          </span>

          <span
            className={`
              ml-1 rounded-full
              transition-transform duration-200
              group-hover:scale-110
              ${currentSize.dot}
              ${currentVariant.dot}
            `}
          />
        </div>
      )}
    </div>
  );
}