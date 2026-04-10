import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
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
    return <h2>Carregando produtos...</h2>;
  }

  if (error) {
    return <h2>Erro: {error}</h2>;
  }

  if (products.length === 0) {
    return <h2>Nenhum produto encontrado.</h2>;
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id} className="border rounded p-4">
            <strong>{product.name}</strong>

            <p className="text-sm text-gray-600 mt-2">{product.description}</p>

            <div className="mt-4 font-semibold">
              R$ {product.price.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
