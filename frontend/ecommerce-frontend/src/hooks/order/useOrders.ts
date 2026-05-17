import { useCallback, useEffect, useState } from "react";

import { getOrders } from "../../api/orderApi";
import type { OrderDto } from "../../types/order";

const PAGE_SIZE = 5;

export function useOrders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async (pageToLoad = 1) => {
    try {
      const isFirstPage = pageToLoad === 1;

      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      const data = await getOrders({
        page: pageToLoad,
        pageSize: PAGE_SIZE,
      });

      setOrders((prev) => (isFirstPage ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
      setPage(pageToLoad);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar pedidos.";

      setError(message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders(1);
  }, [loadOrders]);

  const loadMoreOrders = useCallback(() => {
    if (loading || loadingMore || !hasMore) return;

    void loadOrders(page + 1);
  }, [hasMore, loading, loadingMore, loadOrders, page]);

  const reloadOrders = useCallback(() => {
    setPage(1);
    setHasMore(true);
    void loadOrders(1);
  }, [loadOrders]);

  const updateOrderStatus = useCallback((updatedOrder: OrderDto) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  }, []);

  return {
    orders,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMoreOrders,
    reloadOrders,
    updateOrderStatus,
  };
}
