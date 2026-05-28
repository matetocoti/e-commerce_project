import { useEffect, useRef } from "react";

export function usePolling(
  callback: () => Promise<void>,
  interval = 20000,
  enabled = true
) {
  const pollingIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(callback);
  const intervalRef = useRef(interval);

  useEffect(() => {
    callbackRef.current = callback;
    intervalRef.current = interval;
  }, [callback, interval]);

  useEffect(() => {
    if (!enabled || document.hidden) return;

    const pollOnce = async () => {
      try {
        await callbackRef.current();
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    
    pollOnce().catch(console.error);

    
    const startPolling = () => {
      pollingIdRef.current = setInterval(() => {
        pollOnce().catch(console.error);
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
        pollOnce().catch(console.error);
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