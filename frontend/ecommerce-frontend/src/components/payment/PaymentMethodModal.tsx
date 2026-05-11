import { X, QrCode, Zap, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";

interface PaymentMethodModalProps {
  readonly isOpen: boolean;
  readonly onSelectPix: () => void;
  readonly onClose: () => void;
  readonly isLoading?: boolean;
}

export function PaymentMethodModal({
  isOpen,
  onSelectPix,
  onClose,
  isLoading = false,
}: PaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md flex flex-col max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl border border-gray-200/80 bg-white shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="border-b border-gray-100 px-5 sm:px-6 py-4 sm:py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-700/20">
                <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>

              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                Método de Pagamento
              </h2>

              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm leading-relaxed text-gray-500">
                Escolha como deseja finalizar seu pedido.
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="
                flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full
                text-gray-400 transition-all duration-200
                hover:bg-gray-100 hover:text-gray-700
                active:scale-95
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 px-5 sm:px-6 py-5 sm:py-5">
          
          {/* PIX */}
          <button
            onClick={onSelectPix}
            disabled={isLoading}
            className="
              group relative flex w-full items-center justify-between
              rounded-2xl border-2 border-blue-600
              bg-blue-50/70 p-4
              transition-all duration-200
              hover:border-blue-700 hover:bg-blue-50
              active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-12 w-12 items-center justify-center rounded-2xl
                  bg-blue-100 text-blue-700
                  transition-transform duration-200
                  group-hover:scale-105
                "
              >
                <QrCode className="h-6 w-6" />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-blue-950">PIX</p>

                  <span
                    className="
                      rounded-full bg-blue-600/10 px-2 py-0.5
                      text-[10px] font-bold uppercase tracking-wide
                      text-blue-700
                    "
                  >
                    Instantâneo
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-blue-700/80">
                  Aprovação imediata e pagamento seguro
                </p>
              </div>
            </div>

            <div
              className="
                flex h-6 w-6 items-center justify-center rounded-full
                border-2 border-blue-600 bg-blue-600
                transition-colors duration-200
                group-hover:border-blue-700 group-hover:bg-blue-700
              "
            >
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </button>

          {/* Lightning */}
          <button
            disabled
            className="
              relative flex w-full cursor-not-allowed items-center justify-between
              rounded-2xl border-2 border-gray-200
              bg-gray-50 p-4 opacity-70
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-12 w-12 items-center justify-center rounded-2xl
                  bg-gray-200 text-gray-500
                "
              >
                <Zap className="h-6 w-6" />
              </div>

              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-600">
                    Lightning Network
                  </p>

                  <span
                    className="
                      rounded-full bg-gray-200 px-2 py-0.5
                      text-[10px] font-bold uppercase tracking-wide
                      text-gray-500
                    "
                  >
                    Em breve
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-gray-400">
                  Método temporariamente indisponível
                </p>
              </div>
            </div>

            <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-gray-50/60 px-5 sm:px-6 py-4 sm:py-5 flex-shrink-0">
          
          {/* Security */}
          <div className="mb-4 sm:mb-5 flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-gray-500">
            <ShieldCheck className="h-4 w-4 text-blue-600" />

            <span>
              Pagamento processado com segurança.
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isLoading}
              className="
                w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-semibold
                transition-transform duration-200
                hover:scale-[1.01]
                active:scale-[0.99]
              "
            >
              Cancelar
            </Button>

            <Button
              onClick={onSelectPix}
              disabled={isLoading}
              className="
                w-full sm:flex-1 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white
                shadow-md shadow-blue-700/20
                transition-all duration-200
                hover:scale-[1.01]
                hover:shadow-lg hover:shadow-blue-700/30
                active:scale-[0.99]
              "
            >
              {isLoading ? "Continuando..." : "Avançar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}