import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function PageHeader({ title, description, icon }: Readonly<PageHeaderProps>) {
  return (
    <div className="mb-3">
      <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-gray-900">
        {icon && (
          <div className="text-blue-600 flex items-center justify-center">
            {icon}
          </div>
        )}
        {title}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}