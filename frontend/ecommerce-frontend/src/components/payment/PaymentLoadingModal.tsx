import { Loader } from "lucide-react";

interface PaymentLoadingModalProps {
  readonly isOpen: boolean;
}

export function PaymentLoadingModal({ isOpen }: PaymentLoadingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-lg bg-white p-8 text-center">
        <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg font-semibold text-gray-900">
          Processando pagamento...
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Aguarde alguns momentos
        </p>
      </div>
    </div>
  );
}