import { useEffect, useState } from "react";
import { searchProducts } from "../../api/productApi";
import type { ProductDto } from "../../types/product";

export function useProductSearch(query: string, page: number, pageSize: number,) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery === "") {
      setProducts([]);
      setError(null);
      setLoading(false);
      return;
    }

    async function loadSearchResults() {
      try {
        setLoading(true);
        setError(null);

        const data = await searchProducts(trimmedQuery, page, pageSize);
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao buscar produtos",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadSearchResults();
  }, [query, page, pageSize]);

  return { products, loading, error };
}