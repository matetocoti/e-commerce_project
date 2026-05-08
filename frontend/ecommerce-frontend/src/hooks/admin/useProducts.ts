import { useCallback, useEffect, useState } from "react";
import { getAdminProducts } from "../../api/adminApi";
import type { AdminProductDto } from "../../types/product";

interface UseProductsParams {
  page: number;
  pageSize: number;
  isActive?: boolean;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export function useProducts({ page, pageSize, isActive, type, minPrice, maxPrice, search }: UseProductsParams) {
  const [products, setProducts] = useState<AdminProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAdminProducts({ page, pageSize, isActive, type, minPrice, maxPrice, search });
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar produtos"
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, isActive, type, minPrice, maxPrice, search]);

  useEffect(() => {
    loadProducts();
  }, [page, pageSize, isActive, type, minPrice, maxPrice, search, loadProducts, refreshKey]);

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