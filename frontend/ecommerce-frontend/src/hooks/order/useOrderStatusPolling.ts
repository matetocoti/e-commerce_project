import { useCallback, useEffect, useRef } from "react";
import { getOrderById } from "../../api/orderApi";
import type { OrderDto } from "../../types/order";

interface UseOrderStatusPollingParams {
  orderId: string;
  onStatusChange?: (newStatus: string, oldStatus: string) => void;
  onOrderUpdate?: (order: OrderDto) => void;
  interval?: number;
  enabled?: boolean;
}

export function useOrderStatusPolling({
  orderId,
  onOrderUpdate,
  interval = 10000,
  enabled = true,
}: UseOrderStatusPollingParams) {
  const pollingIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollStatus = useCallback(async () => {
    if (!orderId) return;

    try {
      const order = await getOrderById(orderId);
      if (onOrderUpdate) {
        onOrderUpdate(order);
      }
    } catch (error) {
      console.error("Erro ao fazer polling do status do pedido:", error);
    }
  }, [orderId, onOrderUpdate]);

  useEffect(() => {
    if (!enabled || !orderId || document.hidden) return;

    pollStatus().catch(console.error);

    pollingIdRef.current = setInterval(() => {
      pollStatus().catch(console.error);
    }, interval);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (pollingIdRef.current) {
          clearInterval(pollingIdRef.current);
          pollingIdRef.current = null;
        }
      } else {
        pollStatus().catch(console.error);
        pollingIdRef.current = setInterval(() => {
          pollStatus().catch(console.error);
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
  }, [enabled, orderId, interval, pollStatus]);
}
