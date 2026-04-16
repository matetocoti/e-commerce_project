import { useCallback, useEffect, useState } from "react";

import { getOrders } from "../../api/orderApi";
import type { OrderDto } from "../../types/order";

export function useOrders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = (await getOrders()).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      setOrders(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar pedidos.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    reloadOrders: loadOrders,
  };
}