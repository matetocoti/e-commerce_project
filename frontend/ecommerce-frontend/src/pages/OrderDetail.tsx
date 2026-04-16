import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Package } from "lucide-react";

import { useOrder } from "../hooks/order/useOrder";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { formatPrice } from "../utils/currency/formatPrice";
import { formatDate } from "../utils/date/formatDate";
import { getOrderStatusInfo } from "../utils/order/getOrderStatusInfo";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { order, loading, error } = useOrder({ id: id ?? "" });

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-gray-600">Carregando pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Pedido não encontrado</h1>

        <p className="mb-6 text-sm text-gray-600">
          {error ?? "Não foi possível localizar este pedido."}
        </p>

        <Link to="/orders">
          <Button>Voltar para pedidos</Button>
        </Link>
      </div>
    );
  }

  const statusInfo = getOrderStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Pedido #{order.id.slice(-8)}
              </h1>

              <p className="text-sm text-gray-600">
                Realizado em {formatDate(order.createdAt)}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Expira em {formatDate(order.expiresAt)}
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Itens do pedido
            </h2>
          </div>

          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={`${item.productName}-${index}`}
                className="flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {item.productName}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantity}
                  </p>

                  <p className="text-sm text-gray-600">
                    Unitário: {formatPrice(item.unitPrice)}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Endereço
            </h2>
          </div>

          <div className="space-y-1 text-sm text-gray-700">
            <p>{order.address.street}</p>
            <p>
              {order.address.city} - {order.address.state}
            </p>
            <p>CEP: {order.address.zipCode}</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(order.totalAmount)}
              </p>
            </div>

            <Link to="/orders">
              <Button variant="outline">Voltar para pedidos</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}