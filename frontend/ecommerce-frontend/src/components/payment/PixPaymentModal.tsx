import { X, Copy, Check, QrCode } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

interface PixPaymentModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onBack: () => void;
  readonly onGeneratePayment?: () => void;
  readonly isLoading?: boolean;
  readonly orderTotal?: string;
  readonly orderId?: string;
}

export function PixPaymentModal({
  isOpen,
  onClose,
  onBack,
  onGeneratePayment,
  isLoading = false,
  orderTotal = "R$ 0,00",
  orderId = "",
}: PixPaymentModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyKey = (key: string, type: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  // Exemplo de dados PIX (serão preenchidos dinamicamente na integração)
  const pixData = {
    key: "00020126580014br.gov.bcb.pix0136550e8c6-d3f6-4e7c-8c1a-123456789abc52040000530398654061234.56",
    copyKey: "seu.email@email.com",
    qrCode: "data:image/png;base64,iVBORw0KGgo...", // Será preenchido dinamicamente
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md flex flex-col max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl border border-gray-200/80 bg-white shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="border-b border-gray-100 px-5 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-700/20">
                <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">Pagamento via PIX</h2>
              <p className="mt-0.5 text-xs sm:text-sm leading-snug text-gray-500">Escaneie o QR Code ou copie a chave PIX.</p>
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

        {/* Content */}
        <div className="flex-1 space-y-3 overflow-y-auto px-5 sm:px-6 py-4 sm:py-5">


          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex h-40 w-40 sm:h-44 sm:w-44 items-center justify-center rounded-xl border-2 border-dashed border-blue-300 bg-blue-50">
              <div className="text-center text-gray-400">
                <QrCode className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-1.5 text-blue-300" />
                <p className="text-xs sm:text-sm font-medium">QR Code</p>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">(Será gerado ao confirmar)</p>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-gray-600">Leia o código com seu banco</p>
          </div>

          {/* Valor Section */}
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-gray-600">Valor a pagar</p>
            <p className="text-2xl sm:text-2xl font-bold text-blue-700 mt-1">{orderTotal}</p>
          </div>

          {/* PIX Key Section */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-800" htmlFor="pix-key">
              Chave PIX (E-mail)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={pixData.copyKey}
                readOnly
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-gray-700 cursor-default font-medium transition-colors hover:bg-gray-100"
              />
              <button
                onClick={() => handleCopyKey(pixData.copyKey, "key")}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-100 px-3 py-2 sm:px-3.5 sm:py-2.5 font-semibold text-blue-700 text-xs sm:text-sm transition-all hover:bg-blue-200 disabled:opacity-50"
              >
                {copiedKey === "key" ? (
                  <>
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-semibold text-gray-800" htmlFor="order-id">
              ID do Pedido
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                id="order-id"
                value={orderId}
                readOnly
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs sm:text-sm text-gray-700 cursor-default font-mono font-medium transition-colors hover:bg-gray-100"
              />
              <button
                onClick={() => handleCopyKey(orderId, "orderId")}
                disabled={isLoading}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-100 px-3 py-2 sm:px-3.5 sm:py-2.5 font-semibold text-blue-700 text-xs sm:text-sm transition-all hover:bg-blue-200 disabled:opacity-50"
              >
                {copiedKey === "orderId" ? (
                  <>
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50 p-2.5 sm:p-3">
            <p className="text-[10px] sm:text-xs font-medium leading-snug text-amber-900">
              <span className="font-bold">⚠️ Atenção:</span> O pagamento será confirmado automaticamente em alguns minutos após a transferência. Não feche esta janela.
            </p>
          </div>
        </div>

        
        <div className="border-t border-gray-100 px-5 sm:px-6 py-3 sm:py-4 flex flex-col-reverse sm:flex-row gap-2 flex-shrink-0 bg-white">
          <Button
            onClick={onBack}
            variant="outline"
            disabled={isLoading}
            className="w-full sm:flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Voltar
          </Button>
          <Button
            onClick={onGeneratePayment}
            disabled={isLoading}
            className="w-full sm:flex-1 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            {isLoading ? "Gerando..." : "Gerar Pagamento"}
          </Button>
        </div>
      </div>
    </div>
  );
}
