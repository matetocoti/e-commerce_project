import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { usePayment } from "../../hooks/payment/usePayment";
import { useCancel } from "../../hooks/order/useCancel";
import { useConfirm } from "../../hooks/ui/useConfirm";
import { usePolling } from "../../hooks/ui/usePolling";
import { PaymentProgress } from "../../components/payment/PaymentProgress";
import { PaymentLoadingModal } from "../../components/payment/PaymentLoadingModal";
import { PaymentMethodModal } from "../../components/payment/PaymentMethodModal";
import { PixPaymentModal } from "../../components/payment/PixPaymentModal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { OrderHeader } from "../../components/order/OrderHeader";
import { OrderItemsSection } from "../../components/order/OrderItemsSection";
import { OrderAddressSection } from "../../components/order/OrderAddressSection";
import { OrderSummary } from "../../components/order/OrderSummary";
import { OrderActions } from "../../components/order/OrderActions";


import { useOrder } from "../../hooks/order/useOrder";
import { Button } from "../../components/ui/Button";

import { formatPrice } from "../../utils/currency/formatPrice";


export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);
  const [isPixPaymentModalOpen, setIsPixPaymentModalOpen] = useState(false);
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const { order, loading, error , isPaid, reloadOrder} = useOrder({ id: id ?? "" });
  const { handlePayment, loading: paymentLoading } = usePayment({ onSuccess: reloadOrder });
  const { cancel: cancelOrder, loading: cancelLoading } = useCancel();
  const confirm = useConfirm();

  const handleCancelOrder = async () => {
    if (!id) return;
    
    confirm.open({
      title: "Cancelar pedido",
      description: "Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.",
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

  const handlePaymentClick = (orderId: string) => {
    setPendingOrderId(orderId);
    setIsPaymentMethodModalOpen(true);
  };

  const handleSelectPixPayment = () => {
    setIsPaymentMethodModalOpen(false);
    setIsPixPaymentModalOpen(true);
  };

 const handleGeneratePixPayment = async () => {
   if (!pendingOrderId) return;

   setIsGeneratingPayment(true);
   try {
     const success = await handlePayment(pendingOrderId);

     if (success) {
       setIsPixPaymentModalOpen(false);
       setPendingOrderId(null);
     }
   } finally {
     setIsGeneratingPayment(false);
   }
 };
  
  
  function shouldPoll() {
    return (
      !!order &&
      !isPaid() &&
      order.status !== "Cancelled" &&
      order.status !== "Expired"
    );
  }
  
  usePolling(() => reloadOrder(), 10000, shouldPoll());
  

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

  const hasAddress =
    !!order.address?.street ||
    !!order.address?.city ||
    !!order.address?.state ||
    !!order.address?.zipCode ||
    !!order.address?.notes;

  const hasDigitalContact =
    !!order.digitalContact?.email ||
    !!order.digitalContact?.phoneNumber;

  const isPhysical = hasAddress;
  const isDigital = !hasAddress && hasDigitalContact;

  return (
    <>
      <PaymentMethodModal 
        isOpen={isPaymentMethodModalOpen}
        onSelectPix={handleSelectPixPayment}
        onClose={() => setIsPaymentMethodModalOpen(false)}
        isLoading={paymentLoading}
      />
      <PixPaymentModal
        isOpen={isPixPaymentModalOpen}
        onClose={() => setIsPixPaymentModalOpen(false)}
        onBack={() => {
          setIsPixPaymentModalOpen(false);
          setIsPaymentMethodModalOpen(true);
        }}
        onGeneratePayment={handleGeneratePixPayment}
        isLoading={isGeneratingPayment}
        orderTotal={order?.totalAmount ? `R$ ${formatPrice(order.totalAmount)}` : "R$ 0,00"}
        orderId={order?.id ?? ""}
      />
      <PaymentLoadingModal isOpen={paymentLoading} />
      <PaymentProgress isLoading={paymentLoading} />
      <ConfirmModal 
        isOpen={confirm.isOpen}
        title={confirm.title}
        description={confirm.description}
        variant={confirm.variant}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        confirmButtonVariant={confirm.confirmButtonVariant}
        isLoading={confirm.isLoading}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
      />
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
              isExpanded={isItemsExpanded}
              onToggle={setIsItemsExpanded}
            />
            <OrderAddressSection
              order={order}
              isExpanded={isAddressExpanded}
              onToggle={setIsAddressExpanded}
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
