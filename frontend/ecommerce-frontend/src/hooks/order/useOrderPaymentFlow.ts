import { useState } from "react";
import { usePayment } from "../payment/usePayment";

interface PaymentFlowState {
  paymentMethodOpen: boolean;
  paymentDataOpen: boolean;
  pixPaymentOpen: boolean;
  generatingPayment: boolean;
}

interface UseOrderPaymentFlowResult {
  paymentState: PaymentFlowState;
  pendingOrderId: string | null;
  pendingEmail: string;
  pendingCpf: string;
  paymentLoading: boolean;
  handlePaymentClick: (orderId: string) => void;
  handleSelectPixPayment: () => void;
  handlePaymentDataConfirm: (email: string, cpf: string) => void;
  handleBackFromPaymentData: () => void;
  handleBackFromPixPayment: () => void;
  handleGeneratePixPayment: () => Promise<void>;
  closePaymentModals: () => void;
}

interface UseOrderPaymentFlowProps {
  onSuccess?: () => void;
}

export function useOrderPaymentFlow({onSuccess,}: UseOrderPaymentFlowProps = {}): UseOrderPaymentFlowResult {
  const [paymentState, setPaymentState] = useState<PaymentFlowState>({
    paymentMethodOpen: false,
    paymentDataOpen: false,
    pixPaymentOpen: false,
    generatingPayment: false,
  });
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingCpf, setPendingCpf] = useState("");

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
      paymentDataOpen: true,
    }));
  };

  const handlePaymentDataConfirm = (email: string, cpf: string) => {
    console.log("✅ Dados de pagamento confirmados:", { email, cpf, orderId: pendingOrderId });
    setPendingEmail(email);
    setPendingCpf(cpf);
    setPaymentState((prev) => ({
      ...prev,
      paymentDataOpen: false,
      pixPaymentOpen: true,
    }));
  };

  const handleBackFromPixPayment = () => {
    setPaymentState((prev) => ({
      ...prev,
      pixPaymentOpen: false,
      paymentDataOpen: true,
    }));
  };

  const handleBackFromPaymentData = () => {
    setPaymentState((prev) => ({
      ...prev,
      paymentDataOpen: false,
      paymentMethodOpen: true,
    }));
  };

  const handleGeneratePixPayment = async () => {
    if (!pendingOrderId) {
      console.warn("❌ OrderId não encontrado");
      return;
    }

    console.log("🔄 Iniciando geração de PIX com dados:", {
      orderId: pendingOrderId,
      email: pendingEmail,
      cpf: pendingCpf,
    });

    setPaymentState((prev) => ({ ...prev, generatingPayment: true }));
    try {
      const success = await handlePayment(pendingOrderId, pendingEmail, pendingCpf);

      if (success) {
        setPaymentState((prev) => ({ ...prev, pixPaymentOpen: false }));
        setPendingOrderId(null);
        setPendingEmail("");
        setPendingCpf("");
      }
    } finally {
      setPaymentState((prev) => ({ ...prev, generatingPayment: false }));
    }
  };

  const closePaymentModals = () => {
    setPaymentState((prev) => ({
      ...prev,
      paymentMethodOpen: false,
      paymentDataOpen: false,
      pixPaymentOpen: false,
    }));
    setPendingOrderId(null);
    setPendingEmail("");
    setPendingCpf("");
  };

  return {
    paymentState,
    pendingOrderId,
    pendingEmail,
    pendingCpf,
    paymentLoading,
    handlePaymentClick,
    handleSelectPixPayment,
    handlePaymentDataConfirm,
    handleBackFromPaymentData,
    handleBackFromPixPayment,
    handleGeneratePixPayment,
    closePaymentModals,
  };
}
