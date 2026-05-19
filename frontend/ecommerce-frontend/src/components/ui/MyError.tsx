import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "./Button";

interface ErrorAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "destructive";
}

interface ErrorProps {
  message: string;
  title?: string;
  description?: string;
  onRetry?: () => void;
  showIcon?: boolean;
  actions?: ErrorAction[];
  maxWidth?: string;
  minHeight?: string;
  variant?: "detailed" | "simple";
  children?: ReactNode;
}

export function MyError({
  message,
  title = "Ops! Algo deu errado",
  description,
  onRetry,
  showIcon = true,
  actions,
  maxWidth = "max-w-md",
  minHeight = "py-20",
  variant = "detailed",
  children
}: ErrorProps) {
  const getVariantClass = (actionVariant?: string) => {
    if (actionVariant === "secondary") return "outline";
    if (actionVariant === "destructive") return "destructive";
    return "default";
  };

  const renderDetailedVariant = () => (
    <div className={`flex flex-col items-center justify-center ${minHeight} px-4`}>
      <div className={`bg-white border border-red-100 rounded-xl shadow-sm p-8 ${maxWidth} w-full flex flex-col items-center text-center`}>
        {showIcon && (
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        )}
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        
        <p className="text-gray-600 mb-8">{message}</p>
        
        {description && (
          <p className="text-sm text-gray-500 mb-8">{description}</p>
        )}

        {children && (
          <div className="mb-8 w-full">
            {children}
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2"
            >
              Tentar novamente
            </Button>
          )}
          
          {actions?.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              variant={getVariantClass(action.variant)}
              className="w-full"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSimpleVariant = () => (
    <div className={`mx-auto ${maxWidth} px-4 ${minHeight} text-center`}>
      {showIcon && (
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
      )}
      
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{title}</h1>
      
      <p className="mb-6 text-sm text-gray-600">{message}</p>

      {description && (
        <p className="text-sm text-gray-500 mb-8">{description}</p>
      )}

      {children && (
        <div className="mb-8">
          {children}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {onRetry && (
          <Button onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
        
        {actions?.map((action) => (
          <Button
            key={action.label}
            onClick={action.onClick}
            variant={getVariantClass(action.variant)}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );

  return variant === "simple" ? renderSimpleVariant() : renderDetailedVariant();
}
