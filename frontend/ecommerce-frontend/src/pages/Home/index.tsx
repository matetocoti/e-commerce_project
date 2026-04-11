import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import { ProductCard } from "../../components/ProductCard";
import type { ProductDto } from "../../types/product";

export function Home() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts({ page: 1, pageSize: 8 });
        console.log("products response", response);

        setProducts(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produtos",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <h2 className="p-4">Carregando produtos...</h2>;
  }

  if (error) {
    return <h2 className="p-4 text-red-600">Erro: {error}</h2>;
  }

  if (products.length === 0) {
    return <h2 className="p-4">Nenhum produto encontrado.</h2>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Produtos</h1>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}