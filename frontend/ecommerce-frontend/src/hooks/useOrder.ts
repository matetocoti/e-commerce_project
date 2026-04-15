import { useCallback, useEffect, useState } from "react";

import { getOrderById } from "../api/orderApi";
import type { OrderDto } from "../types/order";

interface UseOrderParams {
  id: string;
}

export function useOrder({ id }: Readonly<UseOrderParams>) {
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!id) {
      setOrder(null);
      setError("Pedido inválido.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar pedido.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  return {
    order,
    loading,
    error,
    reloadOrder: loadOrder,
  };
}