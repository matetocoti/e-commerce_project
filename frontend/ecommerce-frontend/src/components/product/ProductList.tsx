import type { ProductDto } from "../../types/product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  readonly products: ProductDto[];
}

export function ProductList({ products }: Readonly<ProductListProps>) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
  );
}