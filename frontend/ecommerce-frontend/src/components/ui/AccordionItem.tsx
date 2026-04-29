import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionItemProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function AccordionItem({ title, children }: Readonly<AccordionItemProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <button
        type="button"
        className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 transition-colors hover:bg-gray-100"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isOpen && <div className="bg-white p-5">{children}</div>}
    </div>
  );
}