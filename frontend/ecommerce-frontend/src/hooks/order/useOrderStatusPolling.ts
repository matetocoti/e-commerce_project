import { useEffect, useRef } from "react";
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
  interval = 20000,
  enabled = true,
}: UseOrderStatusPollingParams) {
  const pollingIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onOrderUpdateRef = useRef(onOrderUpdate);
  const intervalRef = useRef(interval);

  // Atualizar refs com valores mais recentes
  useEffect(() => {
    onOrderUpdateRef.current = onOrderUpdate;
    intervalRef.current = interval;
  }, [onOrderUpdate, interval]);

  useEffect(() => {
    if (!enabled || !orderId || document.hidden) return;

    const pollStatus = async () => {
      try {
        const order = await getOrderById(orderId);
        if (onOrderUpdateRef.current) {
          onOrderUpdateRef.current(order);
        }
      } catch (error) {
        console.error("Erro ao fazer polling do status do pedido:", error);
      }
    };

    // Executar poll imediato
    pollStatus().catch(console.error);

    // Configurar intervalo com delay
    const startPolling = () => {
      pollingIdRef.current = setInterval(() => {
        pollStatus().catch(console.error);
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
        pollStatus().catch(console.error);
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
  }, [enabled, orderId]);
}
