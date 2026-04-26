import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./Button";

type ConfirmVariant = "info" | "warning" | "danger" | "success";

interface ConfirmModalProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description?: ReactNode;
  readonly variant?: ConfirmVariant;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly confirmButtonVariant?: "default" | "destructive" | "outline" | "ghost";
  readonly isLoading?: boolean;
  readonly onConfirm: () => void | Promise<void>;
  readonly onCancel: () => void;
}

const variantConfig: Record<
  ConfirmVariant,
  {
    icon: typeof AlertCircle;
    bgColor: string;
    iconColor: string;
  }
> = {
  info: {
    icon: AlertCircle,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  danger: {
    icon: AlertTriangle,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
  },
  success: {
    icon: CheckCircle2,
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
  },
};

export function ConfirmModal({
  isOpen,
  title,
  description,
  variant = "info",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonVariant,
  isLoading = false,
  onConfirm,
  onCancel,
}: Readonly<ConfirmModalProps>) {
  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Erro ao confirmar:", error);
    }
  };

  const defaultConfirmVariant = confirmButtonVariant || 
    (variant === "danger" ? "destructive" : "default");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-sm animate-in fade-in zoom-in-95 rounded-lg border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com ícone e botão de fechar */}
        <div className="flex items-start justify-between">
          <div className={cn("flex items-center gap-4", config.bgColor, "w-full rounded-lg p-4")}>
            <Icon className={cn("h-6 w-6 shrink-0", config.iconColor)} />
            <div className="flex-1">
              <h2
                id="confirm-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Descrição */}
        {description && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        )}

        {/* Botões de ação */}
        <div className="mt-6 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={defaultConfirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processando...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
