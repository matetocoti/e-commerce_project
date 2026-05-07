import type { OrderDto } from "../../types/order";
import { Card } from "../ui/Card";
import { formatPrice } from "../../utils/currency/formatPrice";

interface OrderSummaryProps {
  readonly order: OrderDto;
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="p-6 sm:p-8 border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo do pedido</h3>
          <div className="flex justify-between items-center text-gray-600 mb-2">
            <span>Total de itens</span>
            <span className="font-medium">{totalItems}</span>
          </div>
          <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-end">
            <span className="text-gray-900 font-semibold">Total</span>
            <span className="text-3xl font-bold text-blue-600">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
