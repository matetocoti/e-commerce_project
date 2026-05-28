import { useEffect } from "react";



export function usePolling( callback: () => Promise<void>,interval = 20000,enabled = true) {
  useEffect(() => {
    if (!enabled || document.hidden) return;

    let id = setInterval(async () => {
      try {
        await callback();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(id);
      } else {
        callback().catch(console.error);
        id = setInterval(async () => {
          try {
            await callback();
          } catch (error) {
            console.error('Polling error:', error);
          }
        }, interval);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [callback, interval, enabled]);
}