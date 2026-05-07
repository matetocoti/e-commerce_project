import type { OrderDto }  from "../../types/order";
import { getOrderStatusInfo } from "../../utils/order/getOrderStatusInfo";
import { formatDate } from "../../utils/date/formatDate";
import { Card } from "../ui/Card";

interface OrderHeaderProps {
  readonly order: OrderDto;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  const statusInfo = getOrderStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="p-6 sm:p-8 border-0 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pedido #{order.id.slice(-8)}
          </h1>

          <div className="space-y-2 text-sm text-gray-600">
            <p>Realizado em <span className="font-medium text-gray-700">{formatDate(order.createdAt)}</span></p>
            <p>Expira em <span className="font-medium text-gray-700">{formatDate(order.expiresAt)}</span></p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${statusInfo.className}`}
        >
          <StatusIcon className="h-4 w-4" />
          {statusInfo.label}
        </div>
      </div>
    </Card>
  );
}
