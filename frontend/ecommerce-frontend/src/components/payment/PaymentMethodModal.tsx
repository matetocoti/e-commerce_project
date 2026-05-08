import { X, QrCode, Zap } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md scale-100 overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 transition-all">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Método de Pagamento</h2>
            <p className="mt-1 text-sm text-gray-500">Escolha como prefere pagar seu pedido.</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={onSelectPix}
            disabled={isLoading}
            className="group relative flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-blue-600 bg-blue-50/50 p-4 transition-all hover:border-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
                <QrCode className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-blue-900">PIX</p>
                <p className="text-sm font-medium text-blue-600/80">Aprovação imediata</p>
              </div>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-600 transition-colors group-hover:border-blue-700 group-hover:bg-blue-700">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </button>

          <button
            disabled
            className="group relative flex w-full cursor-not-allowed items-center justify-between rounded-xl border-2 border-gray-200 bg-gray-50 p-4 opacity-70 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                <Zap className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-500">Lightning (Bitcoin)</p>
                <p className="text-sm font-medium text-gray-400">Indisponível no momento</p>
              </div>
            </div>
            <div className="h-6 w-6 rounded-full border-2 border-gray-300 bg-transparent" />
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="flex-1 py-2.5 font-semibold"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSelectPix}
            disabled={isLoading}
            className="flex-1 py-2.5 font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
          >
            {isLoading ? "Processando..." : "Confirmar e Pagar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
