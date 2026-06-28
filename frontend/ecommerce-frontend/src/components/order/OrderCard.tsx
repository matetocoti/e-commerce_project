import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { formatPrice } from "../../utils/currency/formatPrice";
import { formatDate } from "../../utils/date/formatDate";
import { getOrderStatusInfo } from "../../utils/order/getOrderStatusInfo";
import type { OrderDto } from "../../types/order"; // Importe o tipo Order do seu projeto


interface OrderCardProps {
  order: OrderDto;
}

export function OrderCard({ order }: Readonly<OrderCardProps>) {
  const statusInfo = getOrderStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  const totalItems = order.items?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) || 0;

  return (
    <Card className="p-6 transition-shadow hover:shadow-md">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                Pedido #{order.id.slice(-8)}
              </h2>
              <p className="text-sm text-gray-600">
                Realizado em {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              {totalItems} {totalItems === 1 ? " item" : " itens"}
            </p>
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(order.totalAmount)}
            </p>
          </div>
          <Link to={`/orders/${order.id}`}>
            <Button>Ver detalhes</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}