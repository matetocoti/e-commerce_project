import type { ReactNode } from "react";
import { Card, CardContent } from "./Card";

interface ProductInfoCardProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function ProductInfoCard({
  title,
  children,
}: Readonly<ProductInfoCardProps>) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-2 font-semibold">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}