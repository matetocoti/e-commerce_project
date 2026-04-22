import { useEffect, useState } from "react";

interface PaymentProgressProps {
  readonly isLoading: boolean;
}

export function PaymentProgress({ isLoading }: Readonly<PaymentProgressProps>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 30;
      });
    }, 200);

    // Cleanup: reseta progress quando para de carregar
    return () => {
      clearInterval(interval);
      setProgress(0);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 h-1 w-full bg-gray-200">
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}