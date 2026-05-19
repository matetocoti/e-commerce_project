import { useState } from "react";
import { Link } from "react-router-dom";

import { ProductList } from "../../components/product/admin/ProductList";
import { FilterBar, type FilterState } from "../../components/ui/FilterBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/Loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
} from "../../components/ui/Pagination";
import { useProducts } from "../../hooks/admin/useProducts";
import { useProductActions } from "../../hooks/admin/useProductActions";

const PAGE_SIZE = 9;

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});

  const { products, loading, error, updateProductLocal } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    search: searchQuery || undefined,
    type: filters.type,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    isActive: filters.isActive,
    hasImage: filters.hasImage,
    hasLowStock: filters.hasLowStock,
    outOfStock: filters.outOfStock,
  });
  const { toggleProductStatus } = useProductActions();

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    setPage(1);
  }

  function handleFiltersChange(newFilters: FilterState) {
    setFilters(newFilters);
    setPage(1);
  }

  const handleActivateProduct = async (id: string) => {
    setDeleteError(null);
    setDeleteSuccess(null);

    const productName = products.find((p) => p.id === id)?.name;

    try {
      await toggleProductStatus(id);
      updateProductLocal(id, { isActive: true });
      setDeleteSuccess(`Produto "${productName}" ativado com sucesso!`);
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao ativar produto";
      setDeleteError(
        `Falha ao ativar "${productName}": ${errorMessage}`
      );
      setTimeout(() => setDeleteError(null), 5000);
    }
  };

  const handleDeactivateProduct = async (id: string) => {
    setDeleteError(null);
    setDeleteSuccess(null);

    const productName = products.find((p) => p.id === id)?.name;

    try {
      await toggleProductStatus(id);
      updateProductLocal(id, { isActive: false });
      setDeleteSuccess(`Produto "${productName}" desativado com sucesso!`);
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao desativar produto";
      setDeleteError(
        `Falha ao desativar "${productName}": ${errorMessage}`
      );
      setTimeout(() => setDeleteError(null), 5000);
    }
  };

  

  const hasPreviousPage = page > 1;
  const hasNextPage = products.length === PAGE_SIZE;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Gerenciar Produtos</h1>
          <p className="text-gray-500 mt-1 font-medium">
            Visualize, edite e gerencie o inventário da loja.
          </p>
        </div>
        <Link to="/admin/products/create">
          <Button className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all rounded-lg font-semibold bg-blue-600 hover:bg-blue-700">
            <span className="text-lg mr-1 leading-none">+</span> Criar Produto
          </Button>
        </Link>
      </div>

      {deleteSuccess && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">✓ {deleteSuccess}</p>
        </div>
      )}

      {deleteError && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">✗ {deleteError}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <FilterBar onFiltersChange={handleFiltersChange} isLoading={loading} isAdmin={true} />
      </div>

      {loading && (
        <Loading message="Carregando produtos..." size="sm" minHeight="h-40" />
      )}

      {error && <p className="text-sm text-red-600">Erro: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum produto encontrado.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductList 
            products={products} 
            onActivate={handleActivateProduct}
            onDeactivate={handleDeactivateProduct}
          />

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={!hasPreviousPage}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationButton isActive>{page}</PaginationButton>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={!hasNextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}