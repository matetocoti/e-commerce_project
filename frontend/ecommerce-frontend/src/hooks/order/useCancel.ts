import { useState } from "react";
import { cancelOrder } from "../../api/orderApi";

export function useCancel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await cancelOrder(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cancelar pedido.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { 
    cancel, 
    loading, 
    error 
 };
}