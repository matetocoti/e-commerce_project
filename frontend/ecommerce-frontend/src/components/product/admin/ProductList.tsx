import type { AdminProductDto } from "../../../types/product";
import { ProductCard } from "./ProductCard";

interface AdminProductListProps {
  readonly products: AdminProductDto[];
  readonly onActivate?: (id: string) => void;
  readonly onDeactivate?: (id: string) => void;
}

export function ProductList({products, onActivate, onDeactivate}: Readonly<AdminProductListProps>) {
  if (products.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-gray-600">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
        />
      ))}
    </ul>
  );
}
