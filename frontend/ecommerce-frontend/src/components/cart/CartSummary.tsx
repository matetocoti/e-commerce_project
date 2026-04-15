import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { formatPrice } from "../../utils/currency/formatPrice";

interface CartSummaryProps {
  readonly total: number;
  readonly submitting?: boolean;
  readonly onClear: () => void;
  readonly onCheckout?: () => void;
}

export function CartSummary({total, submitting = false, onClear, onCheckout}: Readonly<CartSummaryProps>) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-600">Total do carrinho</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(total)}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={submitting}
          >
            Limpar carrinho
          </Button>

          <Button type="button" onClick={onCheckout} disabled>
            Finalizar compra
          </Button>
        </div>
      </div>
    </Card>
  );
}