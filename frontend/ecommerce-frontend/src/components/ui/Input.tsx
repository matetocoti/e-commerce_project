import * as React from "react";

import { cn } from "./utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2.5 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none",
        className
      )}
      {...props}
    />
  );
}


