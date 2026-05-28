import { useState } from "react";
import { payOrder as payOrderApi } from "../../api/paymentApi";
import { PaymentMethod, type PayOrderRequestDto, type PaymentDataResponse } from "../../types/payment";
import { toast } from "sonner";

export function usePayment() {
  const [loading, setLoading] = useState(false);
  


  const getPaymentData = async (orderId: string, email: string, cpf: string): Promise<PaymentDataResponse | null> => {
    try {
      setLoading(true);

      const payload: PayOrderRequestDto = { 
        method: PaymentMethod.PIX,
        customerEmail: email,
        customerCpf: cpf 
      };

      const response = await payOrderApi(orderId, payload);
      
      
      if (!response) {
        throw new Error("Resposta vazia da API");
      }

     
      const pixData: PaymentDataResponse = {
        pixResponseData: {
          pixCopyAndPaste: response.pixResponseDto?.pixCopyAndPaste || "",
          pixLink: response.pixResponseDto?.pixLink || "",
        }
      };

      return pixData;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao gerar dados de pagamento.";

      console.error("Erro ao buscar dados de pagamento:", err);
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getPaymentData,
    loading,
  };
}