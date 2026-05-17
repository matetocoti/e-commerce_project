import { Link } from "react-router-dom";
import { Package, ShoppingBag, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

import { useOrders } from "../../hooks/order/useOrders";
import { useOrdersStatusPolling } from "../../hooks/order/useOrdersStatusPolling";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { formatPrice } from "../../utils/currency/formatPrice";
import { formatDate } from "../../utils/date/formatDate";
import { getOrderStatusInfo } from "../../utils/order/getOrderStatusInfo";



// todo: refactor for better separation of concerns, maybe split into smaller components and hooks if needed. Also consider adding error handling and edge case handling as needed.
export function Orders() {
  const { orders, loading, error, loadMoreOrders, loadingMore, hasMore, updateOrderStatus } =
    useOrders();
  const [showScrollTop, setShowScrollTop] = useState(false);

  
  const shouldPoll = () => {
    return orders.some(
      (order) =>
        order.status !== "Paid" &&
        order.status !== "Cancelled" &&
        order.status !== "Expired",
    );
  }

  useOrdersStatusPolling({
    orderIds: orders.map((order) => order.id),
    onOrderUpdate: updateOrderStatus,
    interval: 10000,
    enabled: orders.length > 0 && shouldPoll(),
  });




  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <h1 className="mb-2 text-2xl font-bold">Nenhum pedido encontrado</h1>
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
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Meus Pedidos</h1>
        <p className="text-gray-600">Acompanhe o status dos seus pedidos</p>
      </div>

      <div className="relative space-y-4">
        {orders.map((order) => {
          const statusInfo = getOrderStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;
          const totalItems =
            order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

          return (
            <Card
              key={order.id}
              className="p-6 transition-shadow hover:shadow-md"
            >
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
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {totalItems}
                      {totalItems === 1 ? " item" : " itens"}
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

      {hasMore && (
        <div className="mt-12 flex justify-center pb-6">
          <Button
            onClick={loadMoreOrders}
            disabled={loadingMore}
            size="lg"
            className="
              min-w-[240px]
              rounded-12x5lg
              bg-blue-700
              px-8
              py-5
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-500/20
              transition-all
              duration-200
              hover:bg-blue-800
              hover:shadow-blue-500/30
              active:scale-[0.95]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loadingMore ? "Carregando pedidos..." : "Carregar mais pedidos"}
          </Button>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
          className="
            group
            fixed
            bottom-6
            right-6
            z-50
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-blue-600
            text-white
            shadow-xl
            shadow-blue-500/25
            ring-1
            ring-white/10
            backdrop-blur-md
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-blue-700
            hover:shadow-2xl
            hover:shadow-blue-500/35
            active:scale-95
            focus:outline-none
            focus:ring-4
            focus:ring-blue-400/30
          "
        >
          <ArrowUp
            className="
              h-6
              w-6
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
            "
          />

          <span
            className="
              pointer-events-none
              absolute
              right-16
              whitespace-nowrap
              rounded-xl
              bg-gray-900
              px-3
              py-2
              text-xs
              font-medium
              text-white
              opacity-0
              shadow-lg
              transition-all
              duration-200
              group-hover:translate-x-0
              group-hover:opacity-100
            "
          >
            Voltar ao topo
          </span>
        </button>
      )}
    </div>
  );
}
