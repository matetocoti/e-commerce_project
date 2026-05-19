import { useState } from "react";
import { usePayment } from "../payment/usePayment";

interface PaymentFlowState {
  paymentMethodOpen: boolean;
  pixPaymentOpen: boolean;
  generatingPayment: boolean;
}

interface UseOrderPaymentFlowResult {
  paymentState: PaymentFlowState;
  pendingOrderId: string | null;
  paymentLoading: boolean;
  handlePaymentClick: (orderId: string) => void;
  handleSelectPixPayment: () => void;
  handleGeneratePixPayment: () => Promise<void>;
  closePaymentModals: () => void;
}

interface UseOrderPaymentFlowProps {
  onSuccess?: () => void;
}

export function useOrderPaymentFlow({onSuccess,}: UseOrderPaymentFlowProps = {}): UseOrderPaymentFlowResult {
  const [paymentState, setPaymentState] = useState<PaymentFlowState>({
    paymentMethodOpen: false,
    pixPaymentOpen: false,
    generatingPayment: false,
  });
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const { handlePayment, loading: paymentLoading } = usePayment({
    onSuccess,
  });

  const handlePaymentClick = (orderId: string) => {
    setPendingOrderId(orderId);
    setPaymentState((prev) => ({ ...prev, paymentMethodOpen: true }));
  };

  const handleSelectPixPayment = () => {
    setPaymentState((prev) => ({
      ...prev,
      paymentMethodOpen: false,
      pixPaymentOpen: true,
    }));
  };

  const handleGeneratePixPayment = async () => {
    if (!pendingOrderId) return;

    setPaymentState((prev) => ({ ...prev, generatingPayment: true }));
    try {
      const success = await handlePayment(pendingOrderId);

      if (success) {
        setPaymentState((prev) => ({ ...prev, pixPaymentOpen: false }));
        setPendingOrderId(null);
      }
    } finally {
      setPaymentState((prev) => ({ ...prev, generatingPayment: false }));
    }
  };

  const closePaymentModals = () => {
    setPaymentState((prev) => ({
      ...prev,
      paymentMethodOpen: false,
      pixPaymentOpen: false,
    }));
    setPendingOrderId(null);
  };

  return {
    paymentState,
    pendingOrderId,
    paymentLoading,
    handlePaymentClick,
    handleSelectPixPayment,
    handleGeneratePixPayment,
    closePaymentModals,
  };
}
