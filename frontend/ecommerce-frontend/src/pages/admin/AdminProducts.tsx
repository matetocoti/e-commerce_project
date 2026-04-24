import { useState } from "react";
import { ProductList } from "../../components/product/admin/ProductList";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
} from "../../components/ui/Pagination";
import { useProducts } from "../../hooks/admin/useProducts";

const PAGE_SIZE = 9;

export function AdminProducts() {
  const [page, setPage] = useState(1);

  const { products, loading, error } = useProducts({
    page,
    pageSize: PAGE_SIZE,
  });

  const hasPreviousPage = page > 1;
  const hasNextPage = products.length === PAGE_SIZE;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar produtos</h1>

        <p className="text-muted-foreground">
          Visualize, edite e gerencie os produtos cadastrados.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-500">Carregando produtos...</p>
      )}

      {error && <p className="text-sm text-red-600">Erro: {error}</p>}

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