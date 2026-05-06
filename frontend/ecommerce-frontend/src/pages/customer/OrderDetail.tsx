import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Package, Loader, ChevronDown, Mail, Phone, X } from "lucide-react";

import { usePayment } from "../../hooks/payment/usePayment";
import { useCancel } from "../../hooks/order/useCancel";
import { useConfirm } from "../../hooks/ui/useConfirm";
import { PaymentProgress } from "../../components/payment/PaymentProgress";
import { PaymentLoadingModal } from "../../components/payment/PaymentLoadingModal";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

import { useOrder } from "../../hooks/order/useOrder";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { formatPrice } from "../../utils/currency/formatPrice";
import { formatDate } from "../../utils/date/formatDate";
import { getOrderStatusInfo } from "../../utils/order/getOrderStatusInfo";


export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

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

            <Card className="p-0 border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <button
                onClick={() => setIsItemsExpanded(!isItemsExpanded)}
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
                    isItemsExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isItemsExpanded && (
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

            <Card className="p-0 border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <button
                onClick={() => setIsAddressExpanded(!isAddressExpanded)}
                className="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isPhysical ? "bg-green-50" : "bg-blue-50"
                  }`}>
                    {isPhysical ? (
                      <MapPin className="h-5 w-5 text-green-600" />
                    ) : (
                      <Mail className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {isPhysical ? "Endereço de entrega" : "Dados de contato"}
                  </h2>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                    isAddressExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAddressExpanded && isPhysical && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-6 sm:px-8 py-4 sm:py-5 bg-gray-50 space-y-2 text-sm text-gray-700">
                  <p className="font-medium text-gray-900">{order.address?.street}</p>
                  <p>{order.address?.city} - {order.address?.state}</p>
                  <p className="text-gray-600">CEP: {order.address?.zipCode}</p>
                  <p>{order.address?.notes}</p>
                </div>
              )}

              {isAddressExpanded && isDigital && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200 border-t border-gray-100 px-6 sm:px-8 py-4 sm:py-5 bg-gray-50 space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <p className="font-medium text-gray-900">{order.digitalContact?.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <p className="font-medium text-gray-900">{order.digitalContact?.phoneNumber}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div>
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
                       <span className="text-3xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => handlePayment(order.id)} 
                      disabled={isPaid() || paymentLoading || order.status === "Cancelled"}
                      className="w-full"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Pagar agora"
                      )}
                    </Button>
                    <Button 
                      onClick={handleCancelOrder}
                      disabled={cancelLoading || isPaid() || order.status === "Cancelled" || order.status === "Expired"}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelLoading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Cancelando...
                        </>
                      ) : (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Cancelar pedido
                        </>
                      )}
                    </Button>
                    <Link to="/orders" className="w-full">
                      <Button variant="outline" disabled={paymentLoading || cancelLoading} className="w-full">Voltar para pedidos</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}