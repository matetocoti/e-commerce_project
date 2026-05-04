import React, { useState } from "react";
import { ProductList } from "../components/product/ProductList";
import { Input } from "../components/ui/Input";
import { FilterBar, type FilterState } from "../components/ui/FilterBar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/Pagination";
import { useProducts } from "../hooks/product/useProducts";

const PAGE_SIZE = 9;

export function Home() {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({});

  const { products, loading, error } = useProducts({ 
    page, 
    pageSize: PAGE_SIZE,
    search: searchQuery || undefined,
    type: filters.type,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    setPage(1);
  }

  function handleFiltersChange(newFilters: FilterState) {
    setFilters(newFilters);
    setPage(1);
  }

  const hasNextPage = products.length === PAGE_SIZE;

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <p className="text-gray-500 mt-2">
          Descubra os melhores produtos do mercado.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <FilterBar onFiltersChange={handleFiltersChange} isLoading={loading} />
      </div>

      {loading && (
        <p className="text-sm text-gray-500">Carregando produtos...</p>
      )}

      {error && (
        <p className="text-sm text-red-600">Erro: {error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum produto encontrado.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductList products={products} />

          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
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