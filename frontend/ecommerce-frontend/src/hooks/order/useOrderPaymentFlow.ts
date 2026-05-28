import { useState } from "react";
import { usePayment } from "../payment/usePayment";
import type { PaymentDataResponse } from "../../types/payment";

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
  paymentData: PaymentDataResponse | null;
  paymentLoading: boolean;
  handlePaymentClick: (orderId: string) => void;
  handleSelectPixPayment: () => void;
  handlePaymentDataConfirm: (email: string, cpf: string) => Promise<void>;
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
  const [paymentData, setPaymentData] = useState<PaymentDataResponse | null>(null);

  const { getPaymentData, loading: paymentLoading } = usePayment();

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

  const handlePaymentDataConfirm = async (email: string, cpf: string) => {
    if (!pendingOrderId) {
      console.warn("OrderId não encontrado");
      return;
    }

   
    const paymentDataResponse = await getPaymentData(pendingOrderId, email, cpf);
    
    if (paymentDataResponse) {
      setPendingEmail(email);
      setPendingCpf(cpf);
      setPaymentData(paymentDataResponse);
      setPaymentState((prev) => ({
        ...prev,
        paymentDataOpen: false,
        pixPaymentOpen: true,
      }));
    }
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
    if (!pendingOrderId || !paymentData) {
      console.warn("OrderId ou Payment Data não encontrado");
      return;
    }
    
    
    setPaymentState((prev) => ({ ...prev, generatingPayment: true }));
    try {
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Pagamento confirmado com dados PIX:", paymentData);
      
      // Fecha modal e limpa dados
      setPaymentState((prev) => ({ ...prev, pixPaymentOpen: false }));
      setPendingOrderId(null);
      setPendingEmail("");
      setPendingCpf("");
      setPaymentData(null);
      
     
      onSuccess?.();
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
    setPaymentData(null);
  };

  return {
    paymentState,
    pendingOrderId,
    pendingEmail,
    pendingCpf,
    paymentData,
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
