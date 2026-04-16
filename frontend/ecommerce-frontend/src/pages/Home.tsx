import React, { useState } from "react";
import { ProductList } from "../components/product/ProductList";
import { Input } from "../components/ui/Input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
} from "../components/ui/Pagination";
import { useProductSearch } from "../hooks/product/useProductSearch";
import { useProducts } from "../hooks/product/useProducts";

const PAGE_SIZE = 9;

export function Home() {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { products, loading, error } = useProducts({ page, pageSize: PAGE_SIZE });

  const {
    products: searchedProducts,
    loading: searchLoading,
    error: searchError
    ,} = useProductSearch(searchQuery, page, PAGE_SIZE);



  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    setPage(1);
  }

  const isSearching = searchQuery.trim() !== "";
  const displayedProducts = isSearching ? searchedProducts : products;
  const displayedLoading = isSearching ? searchLoading : loading;
  const displayedError = isSearching ? searchError : error;

  const hasPreviousPage = page > 1;
  const hasNextPage = displayedProducts.length === PAGE_SIZE && !isSearching;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold">Produtos</h1>

      <p className="text-muted-foreground">
        Descubra os melhores produtos do mercado.
      </p>

      <Input
        placeholder="Buscar produtos..."
        value={searchQuery}
        onChange={handleSearchChange}
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
        <>
          <ProductList products={displayedProducts} />

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