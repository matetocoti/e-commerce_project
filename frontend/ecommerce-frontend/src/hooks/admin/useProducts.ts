import { useCallback, useEffect, useState } from "react";
import { getAdminProducts } from "../../api/adminApi";
import type { AdminProductDto } from "../../types/product";

interface UseProductsParams {
  page: number;
  pageSize: number;
}

export function useProducts({ page, pageSize }: UseProductsParams) {
  const [products, setProducts] = useState<AdminProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminProducts({ page, pageSize });
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadProducts();
  }, [page, pageSize, loadProducts, refreshKey]);

  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const updateProductLocal = useCallback(
    (id: string, updatedData: Partial<AdminProductDto>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedData } : product
        )
      );
    },
    []
  );

  return { products, loading, error, refetch, updateProductLocal };
}