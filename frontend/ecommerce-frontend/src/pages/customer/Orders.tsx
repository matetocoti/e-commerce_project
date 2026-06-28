import { useOrders } from "../../hooks/order/useOrders";
import { useOrdersStatusPolling } from "../../hooks/order/useOrdersStatusPolling";
import { ScrollToTop } from "../../components/ui/ScrollToTop";
import { Loading } from "../../components/ui/Loading";
import { MyError } from "../../components/ui/MyError";
import { Button } from "../../components/ui/Button";
import { NoOrder } from "../../components/order/NoOrder";
import { OrderCard } from "../../components/order/OrderCard";
import { PageHeader } from "../../components/ui/PageHeader";


export function Orders() {
  const { orders, loading, error, loadMoreOrders, loadingMore, hasMore, updateOrderStatus } = useOrders();
  
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
    interval: 20000,
    enabled: orders.length > 0 && shouldPoll(),
  });

  if (loading) {
    return (
      <Loading 
        message="Carregando pedidos..." 
        maxWidth="max-w-5xl"
        minHeight="py-10"
        showSpinner={false}
      />
    );
  }

  if (error) {
    return (
      <MyError
        title="Erro ao carregar pedidos"
        message={error}
        variant="simple"
        maxWidth="max-w-5xl"
        minHeight="py-10"
        showIcon={false}
      />
    );
  }

  if (orders.length === 0) {
    return (
      <NoOrder />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader
        title="Meus Pedidos"
        description="Acompanhe o status dos seus pedidos"
      />
      <div className="relative space-y-4">
        {orders.map((order) => {
          return (
            <OrderCard key={order.id} order={order} />
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
      <ScrollToTop />
    </div>
  );
}
