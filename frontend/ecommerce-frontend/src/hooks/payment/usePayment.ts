import { useState } from "react";
import { payOrder as payOrderApi } from "../../api/paymentApi";
import { PaymentMethod, type PayOrderRequestDto } from "../../types/payment";
import { toast } from "sonner";



interface UsePaymentOptions {
  onSuccess?: () => void | Promise<void>;
}

export function usePayment(options?: UsePaymentOptions) {
  const [loading, setLoading] = useState(false);
  


  const payOrder = async (orderId: string, method: PaymentMethod, email: string, cpf: string) =>{
    try {
      setLoading(true);

      const payload: PayOrderRequestDto = { 
        method,
        customerEmail: email,
        customerCpf: cpf 
      };

      
      const response = await payOrderApi(orderId, payload);
      console.log("Resposta da API:", response);

      // Simulate real processing (2-3 segundos) -- only for demonstration purposes, remove in production
      await new Promise(resolve => setTimeout(resolve, 2500));

      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao processar pagamento.";

      console.error("Erro no pagamento:", err);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId: string, email: string, cpf: string) => {
    
    const success = await payOrder(orderId, PaymentMethod.PIX, email, cpf);

    if (success) {
      toast.success("Pagamento realizado com sucesso!");
      await options?.onSuccess?.();
    }

    return success;
  };
  return {
    payOrder,
    handlePayment,
    loading,
  };
}