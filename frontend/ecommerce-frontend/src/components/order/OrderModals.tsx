import { PaymentLoadingModal } from "../payment/PaymentLoadingModal";
import { PaymentMethodModal } from "../payment/PaymentMethodModal";
import { PaymentDataModal } from "../payment/PaymentDataModal";
import { PixPaymentModal } from "../payment/PixPaymentModal";
import { ConfirmModal } from "../ui/ConfirmModal";
import type { OrderDto } from "../../types/order";
import { useConfirm } from "../../hooks/ui/useConfirm";
import { formatPrice } from "../../utils/currency/formatPrice";

type UseConfirmReturn = ReturnType<typeof useConfirm>;

interface OrderModalsProps {
  readonly order: OrderDto | null;
  readonly confirm: UseConfirmReturn;
  readonly paymentMethodOpen: boolean;
  readonly paymentDataOpen: boolean;
  readonly pixPaymentOpen: boolean;
  readonly generatingPayment: boolean;
  readonly paymentLoading: boolean;
  readonly onSelectPixPayment: () => void;
  readonly onPaymentDataConfirm: (email: string, cpf: string) => void;
  readonly onGeneratePixPayment: () => Promise<void>;
  readonly onClosePaymentMethod: () => void;
  readonly onClosePaymentData: () => void;
  readonly onBackFromPaymentData: () => void;
  readonly onClosePixPayment: () => void;
  readonly onBackFromPixPayment: () => void;
}

export function OrderModals({
  order,
  confirm,
  paymentMethodOpen,
  paymentDataOpen,
  pixPaymentOpen,
  generatingPayment,
  paymentLoading,
  onSelectPixPayment,
  onPaymentDataConfirm,
  onGeneratePixPayment,
  onClosePaymentMethod,
  onClosePaymentData,
  onBackFromPaymentData,
  onClosePixPayment,
  onBackFromPixPayment,
}: OrderModalsProps) {
  return (
    <>
      <PaymentMethodModal
        isOpen={paymentMethodOpen}
        onSelectPix={onSelectPixPayment}
        onClose={onClosePaymentMethod}
        isLoading={paymentLoading}
      />
      <PaymentDataModal
        isOpen={paymentDataOpen}
        onClose={onBackFromPaymentData}
        onConfirm={onPaymentDataConfirm}
        isLoading={paymentLoading}
      />
      <PixPaymentModal
        isOpen={pixPaymentOpen}
        onClose={onClosePixPayment}
        onBack={onBackFromPixPayment}
        onGeneratePayment={onGeneratePixPayment}
        isLoading={generatingPayment}
        orderTotal={
          order?.totalAmount
            ? `R$ ${formatPrice(order.totalAmount)}`
            : "R$ 0,00"
        }
        orderId={order?.id ?? ""}
      />
      <PaymentLoadingModal isOpen={paymentLoading} />
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
    </>
  );
}
