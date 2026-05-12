import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function AppToaster() {
  const [toastPosition, setToastPosition] = useState<
    "top-center" | "top-right"
  >("top-center");

  useEffect(() => {
    const handleResize = () => {
      setToastPosition(window.innerWidth >= 768 ? "top-right" : "top-center");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Toaster
      position={toastPosition}
      duration={3500}
      gap={10}
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group flex w-full max-w-[calc(100vw-24px)] md:max-w-sm items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-xl backdrop-blur-sm transition-all duration-200 animate-in slide-in-from-top-3",

          title:
            "text-sm font-semibold leading-relaxed text-gray-900 md:text-[15px]",

          description: "hidden",

          icon:
            "h-5 w-5 shrink-0 flex-none md:h-[22px] md:w-[22px]",

          success:
            "border-emerald-200 bg-emerald-50 text-emerald-600",

          error:
            "border-red-200 bg-red-50 text-red-600",

          warning:
            "border-amber-200 bg-amber-50 text-amber-600",

          info:
            "border-blue-200 bg-blue-50 text-blue-600",

          closeButton:
            "hidden",
        },
      }}
    />
  );
}