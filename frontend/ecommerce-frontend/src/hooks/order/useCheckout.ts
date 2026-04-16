import { useState } from "react";
import { toast } from "sonner";

import { checkout } from "../../api/orderApi";
import type { CreateOrderDto, OrderDto } from "../../types/order";

export function useCheckout() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(
    orderData: CreateOrderDto
  ): Promise<OrderDto | null> {
    try {
      setSubmitting(true);
      setError(null);

      const order = await checkout(orderData);

      toast.success("Pedido realizado com sucesso!");
      return order;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao finalizar compra.";

      setError(message);
      toast.error(message);
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    checkout: handleCheckout,
    submitting,
    error,
  };
}