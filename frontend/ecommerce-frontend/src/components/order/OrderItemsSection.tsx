import { ChevronDown, Package } from "lucide-react";
import type { OrderDto } from "../../types/order";
import { Card } from "../ui/Card";
import { formatPrice } from "../../utils/currency/formatPrice";

interface OrderItemsSectionProps {
  readonly order: OrderDto;
  readonly isExpanded: boolean;
  readonly onToggle: (expanded: boolean) => void;
}

export function OrderItemsSection({ order, isExpanded, onToggle }: OrderItemsSectionProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="p-0 border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <button
        onClick={() => onToggle(!isExpanded)}
        className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Itens do pedido ({totalItems})
          </h2>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 divide-y divide-gray-100 border-t border-gray-100">
          {order.items.map((item) => (
            <div
              key={`${item.productName}-${item.unitPrice}`}
              className="px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Qtd: {item.quantity} × {formatPrice(item.unitPrice)}
                </p>
              </div>
              <p className="font-bold text-gray-900 text-sm sm:text-base whitespace-nowrap flex-shrink-0">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
