import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";

interface PixPaymentModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onGeneratePayment?: () => void;
  readonly isLoading?: boolean;
  readonly orderTotal?: string;
  readonly orderId?: string;
}

export function PixPaymentModal({
  isOpen,
  onClose,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md scale-100 overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-900/5 transition-all">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Pagamento via PIX</h2>
            <p className="mt-1 text-sm text-gray-500">Escaneie o QR Code ou copie a chave PIX.</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-50">
              <div className="text-center text-gray-400">
                <p className="text-sm font-medium">QR Code</p>
                <p className="text-xs text-gray-300 mt-1">(Será gerado ao confirmar)</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium text-gray-500">Leia o código com seu banco</p>
          </div>

          {/* Valor Section */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm font-medium text-gray-600">Valor a pagar</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{orderTotal}</p>
          </div>

          {/* PIX Key Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700" htmlFor="pix-key">
              Chave PIX (E-mail)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pixData.copyKey}
                readOnly
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 cursor-default"
              />
              <button
                onClick={() => handleCopyKey(pixData.copyKey, "key")}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50"
              >
                {copiedKey === "key" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order ID Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700" htmlFor="order-id">
              ID do Pedido
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="order-id"
                value={orderId}
                readOnly
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 cursor-default font-mono"
              />
              <button
                onClick={() => handleCopyKey(orderId, "orderId")}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 font-medium text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50"
              >
                {copiedKey === "orderId" ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="font-semibold">Atenção:</span> O pagamento será confirmado automaticamente em alguns minutos após a transferência. Não feche esta janela.
            </p>
          </div>
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
            onClick={onGeneratePayment}
            disabled={isLoading}
            className="flex-1 py-2.5 font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
          >
            {isLoading ? "Gerando..." : "Gerar Pagamento"}
          </Button>
        </div>
      </div>
    </div>
  );
}
