import { useCallback, useEffect, useRef } from "react";
import { getOrderById } from "../../api/orderApi";
import type { OrderDto } from "../../types/order";

interface UseOrdersStatusPollingParams {
  orderIds: string[];
  onOrderUpdate?: (order: OrderDto) => void;
  interval?: number;
  enabled?: boolean;
}

export function useOrdersStatusPolling({
  orderIds,
  onOrderUpdate,
  interval = 10000,
  enabled = true,
}: UseOrdersStatusPollingParams) {
  const pollingIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollStatuses = useCallback(async () => {
    if (!orderIds || orderIds.length === 0) return;

    try {
      const promises = orderIds.map((id) =>
        getOrderById(id).catch((error) => {
          console.error(`Erro ao fazer polling do pedido ${id}:`, error);
          return null;
        }),
      );

      const results = await Promise.all(promises);

      results.forEach((order) => {
        if (order && onOrderUpdate) {
          onOrderUpdate(order);
        }
      });
    } catch (error) {
      console.error("Erro ao fazer polling dos status dos pedidos:", error);
    }
  }, [orderIds, onOrderUpdate]);

  useEffect(() => {
    if (!enabled || !orderIds || orderIds.length === 0 || document.hidden)
      return;

    pollStatuses().catch(console.error);

    pollingIdRef.current = setInterval(() => {
      pollStatuses().catch(console.error);
    }, interval);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (pollingIdRef.current) {
          clearInterval(pollingIdRef.current);
          pollingIdRef.current = null;
        }
      } else {
        pollStatuses().catch(console.error);
        pollingIdRef.current = setInterval(() => {
          pollStatuses().catch(console.error);
        }, interval);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (pollingIdRef.current) {
        clearInterval(pollingIdRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, orderIds, interval, pollStatuses]);
}
