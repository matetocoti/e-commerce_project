import { useRef, useEffect, type ReactNode } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();

      if (!isLoading) {
        onCancel();
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [isLoading, onCancel]);

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Erro ao confirmar:", error);
    }
  };

  const defaultConfirmVariant =
    confirmButtonVariant || (variant === "danger" ? "destructive" : "default");

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-0 shadow-lg backdrop:bg-black/50"
      aria-labelledby="confirm-title"
    >
      <div
        className={cn(
          "flex items-start justify-between gap-4 rounded-t-lg p-4",
          config.bgColor
        )}
      >
        <div className="flex flex-1 items-start gap-3">
          <Icon className={cn("mt-0.5 h-6 w-6 shrink-0", config.iconColor)} />
          <h2 id="confirm-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="shrink-0 rounded text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 pt-0">
        {description && (
          <p className="mb-6 text-sm leading-relaxed text-gray-600 sm:text-base">
            {description}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>

          <Button
            variant={defaultConfirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <span>
                  <span
                    aria-hidden="true"
                    className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                   />
                <span>Processando...</span>
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </dialog>
  );
}