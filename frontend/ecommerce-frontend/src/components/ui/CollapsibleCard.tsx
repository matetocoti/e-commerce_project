import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "./Card";

interface CollapsibleCardProps {
  title: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function CollapsibleCard({ title, defaultExpanded = true, children }: Readonly<CollapsibleCardProps>) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4 hover:bg-gray-100/50 transition-colors"
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded && (
        <div className="p-6 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </Card>
  );
}