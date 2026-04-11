import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import type { ProductDto } from "../../types/product";
import { ProductList } from "../../components/ProductList";
import { Input } from "../../components/ui/input";
import { useProductSearch } from "../../hooks/useProductSearch";

export function Home() {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    products: searchedProducts,
    loading: searchLoading,
    error: searchError,
  } = useProductSearch(searchQuery);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await getProducts({ page: 1, pageSize: 9 });
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

  const isSearching = searchQuery.trim() !== "";
  const displayedProducts = isSearching ? searchedProducts : products;
  const displayedLoading = isSearching ? searchLoading : loading;
  const displayedError = isSearching ? searchError : error;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">Produtos</h1>

      <p className="text-muted-foreground">
        Descubra os melhores produtos do mercado.
      </p>

      <Input
        placeholder="Buscar produtos..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
      />

      {displayedLoading && (
        <p className="text-sm text-gray-500">Carregando produtos...</p>
      )}

      {displayedError && (
        <p className="text-sm text-red-600">Erro: {displayedError}</p>
      )}

      {!displayedLoading && !displayedError && displayedProducts.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum produto encontrado.</p>
      )}

      {!displayedLoading && !displayedError && displayedProducts.length > 0 && (
        <ProductList products={displayedProducts} />
      )}
    </div>
  );
}