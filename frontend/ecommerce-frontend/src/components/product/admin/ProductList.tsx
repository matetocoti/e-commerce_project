import type { AdminProductDto } from "../../../types/product";
import { ProductCard } from "./ProductCard";

interface AdminProductListProps {
  readonly products: AdminProductDto[];
  readonly onEdit?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
  readonly isActive?: boolean;
}

export function ProductList({products, onEdit, onDelete}: Readonly<AdminProductListProps>) {
  if (products.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-gray-600">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
