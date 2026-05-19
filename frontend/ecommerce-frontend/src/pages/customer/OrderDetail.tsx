import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCancel } from "../../hooks/order/useCancel";
import { useConfirm } from "../../hooks/ui/useConfirm";
import { useOrderStatusPolling } from "../../hooks/order/useOrderStatusPolling";
import { useOrderPaymentFlow } from "../../hooks/order/useOrderPaymentFlow";
import { PaymentProgress } from "../../components/payment/PaymentProgress";
import { OrderModals } from "../../components/order/OrderModals";
import { Loading } from "../../components/ui/Loading";
import { MyError } from "../../components/ui/MyError";
import { OrderHeader } from "../../components/order/OrderHeader";
import { OrderItemsSection } from "../../components/order/OrderItemsSection";
import { OrderAddressSection } from "../../components/order/OrderAddressSection";
import { OrderSummary } from "../../components/order/OrderSummary";
import { OrderActions } from "../../components/order/OrderActions";
import { useOrder } from "../../hooks/order/useOrder";

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [expandedSections, setExpandedSections] = useState({
    items: false,
    address: false,
  });

  const { 
    order, 
    loading, 
    error, 
    isPaid, 
    reloadOrder, 
    updateOrderStatus 
  } = useOrder({ id: id ?? "" });
  
  const {
    paymentState,
    handlePaymentClick,
    handleSelectPixPayment,
    handleGeneratePixPayment,
    paymentLoading,
    closePaymentModals,
  } = useOrderPaymentFlow( {onSuccess: reloadOrder,} );

  const { cancel: cancelOrder, loading: cancelLoading } = useCancel();
  const confirm = useConfirm();

  const shouldPoll = 
      !!order && !isPaid() &&
      order.status !== "Cancelled" &&
      order.status !== "Expired";

  useOrderStatusPolling({
    orderId: id ?? "",
    onOrderUpdate: updateOrderStatus,
    interval: 10000,
    enabled: shouldPoll,
  });

  const handleCancelOrder = async () => {
    if (!id) return;

    confirm.open({
      title: "Cancelar pedido",
      description:
        "Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.",
      variant: "danger",
      confirmText: "Sim, cancelar",
      cancelText: "Não, manter",
      confirmButtonVariant: "destructive",
      onConfirm: async () => {
        confirm.setLoading(true);
        try {
          await cancelOrder(id);
          await reloadOrder();
          confirm.close();
        } catch (err) {
          console.error("Erro ao cancelar pedido:", err);
          confirm.setLoading(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <Loading 
        message="Carregando pedido..." 
        maxWidth="max-w-5xl"
        minHeight="py-10"
        showSpinner={false}
      />
    );
  }

  if (error || !order) {
    return (
      <MyError
        title="Pedido não encontrado"
        message={error ?? "Não foi possível localizar este pedido."}
        variant="simple"
        maxWidth="max-w-5xl"
        minHeight="py-16"
        showIcon={false}
        actions={[
          {
            label: "Voltar para pedidos",
            onClick: () => navigate("/orders"),
            variant: "secondary"
          }
        ]}
      />
    );
  }

  const hasAddress =
    !!order.address?.street ||
    !!order.address?.city ||
    !!order.address?.state ||
    !!order.address?.zipCode ||
    !!order.address?.notes;

  const hasDigitalContact =
    !!order.digitalContact?.email || !!order.digitalContact?.phoneNumber;

  const isPhysical = hasAddress;
  const isDigital = !hasAddress && hasDigitalContact;

  return (
    <>
      <OrderModals
        order={order}
        confirm={confirm}
        paymentMethodOpen={paymentState.paymentMethodOpen}
        pixPaymentOpen={paymentState.pixPaymentOpen}
        generatingPayment={paymentState.generatingPayment}
        paymentLoading={paymentLoading}
        onSelectPixPayment={handleSelectPixPayment}
        onGeneratePixPayment={handleGeneratePixPayment}
        onClosePaymentMethod={closePaymentModals}
        onClosePixPayment={closePaymentModals}
        onBackFromPixPayment={() => {
          closePaymentModals();
          handlePaymentClick(order.id);
        }}
      />
      <PaymentProgress isLoading={paymentLoading} />
      <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:py-12 bg-transparent min-h-[calc(100vh-16rem)]">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="flex-1 space-y-6">
            <OrderHeader order={order} />
            <OrderItemsSection
              order={order}
              isExpanded={expandedSections.items}
              onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, items: expanded }))}
            />
            <OrderAddressSection
              order={order}
              isExpanded={expandedSections.address}
              onToggle={(expanded) => setExpandedSections(prev => ({ ...prev, address: expanded }))}
              isPhysical={isPhysical}
              isDigital={isDigital}
            />
          </div>
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div>
              <div className="flex flex-col gap-6">
                <OrderSummary order={order} />
                <OrderActions
                  onPayment={() => handlePaymentClick(order.id)}
                  onCancel={handleCancelOrder}
                  isPaid={isPaid()}
                  paymentLoading={paymentLoading}
                  cancelLoading={cancelLoading}
                  isCancelled={order.status === "Cancelled"}
                  isExpired={order.status === "Expired"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
