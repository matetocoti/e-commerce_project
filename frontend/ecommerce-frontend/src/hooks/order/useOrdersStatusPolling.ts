import { useEffect, useRef } from "react";
import { checkOrderStatus } from "../../api/orderApi";
import type { CheckOrderStatusResponse } from "../../types/order";

interface UseOrdersStatusPollingParams {
  orderIds: string[];
  onOrderUpdate?: (status: CheckOrderStatusResponse) => void;
  interval?: number;
  enabled?: boolean;
}

export function useOrdersStatusPolling({
  orderIds,
  onOrderUpdate,
  interval = 20000,
  enabled = true,
}: UseOrdersStatusPollingParams) {
  const pollingIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onOrderUpdateRef = useRef(onOrderUpdate);
  const intervalRef = useRef(interval);
  const orderIdsRef = useRef(orderIds);

  
  useEffect(() => {
    onOrderUpdateRef.current = onOrderUpdate;
    intervalRef.current = interval;
    orderIdsRef.current = orderIds;
  }, [onOrderUpdate, interval, orderIds]);

  useEffect(() => {
    if (!enabled || !orderIdsRef.current || orderIdsRef.current.length === 0 || document.hidden)
      return;

    const pollStatuses = async () => {
      const orderIds = orderIdsRef.current;
      if (!orderIds || orderIds.length === 0) return;

      const promises = orderIds.map(async (id) => {
        try {
          return await checkOrderStatus(id);
        } catch (error) {
          console.error(`Erro ao fazer polling do pedido ${id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      results.forEach((status) => {
        if (status && onOrderUpdateRef.current) {
          onOrderUpdateRef.current(status);
        }
      });
    };

    
    pollStatuses().catch(console.error);

    
    const startPolling = () => {
      pollingIdRef.current = setInterval(() => {
        pollStatuses().catch(console.error);
      }, intervalRef.current);
    };

    startPolling();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (pollingIdRef.current) {
          clearInterval(pollingIdRef.current);
          pollingIdRef.current = null;
        }
      } else {
        pollStatuses().catch(console.error);
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (pollingIdRef.current) {
        clearInterval(pollingIdRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled]);
}
