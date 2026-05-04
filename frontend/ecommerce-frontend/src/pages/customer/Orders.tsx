import { Link } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";

import { useOrders } from "../../hooks/order/useOrders";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

import { formatPrice } from "../../utils/currency/formatPrice";
import { formatDate } from "../../utils/date/formatDate";
import { getOrderStatusInfo } from "../../utils/order/getOrderStatusInfo";

export function Orders() {
  const { orders, loading, error } = useOrders();
  


 
 
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-gray-600">Carregando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto mb-4 h-24 w-24 text-gray-300" />

          <h1 className="mb-2 text-2xl font-bold">
            Nenhum pedido encontrado
          </h1>

          <p className="mb-6 text-gray-600">
            Você ainda não realizou nenhum pedido
          </p>

          <Link to="/">
            <Button size="lg">Começar a comprar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Meus Pedidos
        </h1>

        <p className="text-gray-600">
          Acompanhe o status dos seus pedidos
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = getOrderStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

          return (
            <Card
              key={order.id}
              className="p-6 transition-shadow hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Header */}
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

                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {totalItems}{totalItems === 1 ? " item" : " itens"}
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
        })}
      </div>
    </div>
  );
}