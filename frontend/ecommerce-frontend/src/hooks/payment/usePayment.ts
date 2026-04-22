import { useState } from "react";
import { payOrder as payOrderApi } from "../../api/paymentApi";
import { PaymentMethod, type PayOrderRequestDto } from "../../types/payment";
import { toast } from "sonner";



interface UsePaymentOptions {
  onSuccess?: () => void | Promise<void>;
}

export function usePayment(options?: UsePaymentOptions) {
  const [loading, setLoading] = useState(false);
  


  const payOrder = async (orderId: string, method: PaymentMethod) =>{
    try {
      setLoading(true);

      const payload: PayOrderRequestDto = { method };

      await payOrderApi(orderId, payload);

      // Simula processamento real (2-3 segundos) -- only for demonstration purposes, remove in production
      await new Promise(resolve => setTimeout(resolve, 2500));

      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao processar pagamento.";

      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId: string) => {
    const success = await payOrder(orderId, PaymentMethod.PIX);

    if (success) {
      toast.success("Pagamento realizado com sucesso!");
      await options?.onSuccess?.();
    }
  };
  
  return {
    payOrder,
    handlePayment,
    loading,
  };
}