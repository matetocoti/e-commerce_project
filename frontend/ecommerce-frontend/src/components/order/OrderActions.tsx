import { Link } from "react-router-dom";
import { Loader, X } from "lucide-react";
import { Button } from "../ui/Button";

interface OrderActionsProps {
  readonly onPayment: () => void;
  readonly onCancel: () => void;
  readonly isPaid: boolean;
  readonly paymentLoading: boolean;
  readonly cancelLoading: boolean;
  readonly isCancelled: boolean;
  readonly isExpired: boolean;
}

export function OrderActions({
  onPayment,
  onCancel,
  isPaid,
  paymentLoading,
  cancelLoading,
  isCancelled,
  isExpired,
}: OrderActionsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={onPayment}
        disabled={isPaid || paymentLoading || isCancelled || isExpired}
        className="w-full"
      >
        {paymentLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          "Pagar agora"
        )}
      </Button>
      <Button
        onClick={onCancel}
        disabled={cancelLoading || isPaid || isCancelled || isExpired}
        variant="outline"
        className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLoading ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Cancelando...
          </>
        ) : (
          <>
            <X className="mr-2 h-4 w-4" />
            Cancelar pedido
          </>
        )}
      </Button>
      <Link to="/orders" className="w-full text-center mt-2 text-sm text-gray-500 ">
        <Button
          variant="outline"
          disabled={paymentLoading || cancelLoading}
          className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Voltar para pedidos
        </Button>
      </Link>
    </div>
  );
}
