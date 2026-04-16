import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import type { ProductDto } from "../../types/product";

interface UseProductsParams {
  page: number;
  pageSize: number;
}

export function useProducts({ page, pageSize }: UseProductsParams) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts({ page, pageSize });
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produtos"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page, pageSize]);

  return { products, loading, error };
}