import { useEffect, useState } from "react";
import { getAdminProductById } from "../../api/adminApi";
import type { AdminProductDto } from "../../types/product";

interface UseProductParams {
  id: string;
}

export function useProduct({ id }: UseProductParams) {
  const [product, setProduct] = useState<AdminProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setError("Produto não encontrado");
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const data = await getAdminProductById(id);
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produto",
        );
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  return { product, loading, error };
}