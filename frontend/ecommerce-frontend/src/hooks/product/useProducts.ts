import { useEffect, useState } from "react";
import { getProducts, type PublicProductQueryParams } from "../../api/productApi";
import type { ProductDto } from "../../types/product";

interface UseProductsParams extends PublicProductQueryParams {
  page: number;
  pageSize: number;
}

export function useProducts({ page, pageSize, search, type, minPrice, maxPrice }: UseProductsParams) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProducts({ page, pageSize, search, type, minPrice, maxPrice });
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
  }, [page, pageSize, search, type, minPrice, maxPrice]);

  return { products, loading, error };
}