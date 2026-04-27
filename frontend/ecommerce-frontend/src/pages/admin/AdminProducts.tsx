import { useState } from "react";
import { Link } from "react-router-dom";

import { ProductList } from "../../components/product/admin/ProductList";
import { Button } from "../../components/ui/Button";
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
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useConfirm } from "../../hooks/ui/useConfirm";

const PAGE_SIZE = 9;

export function AdminProducts() {
  const [page, setPage] = useState(1);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const confirm = useConfirm();

  const { products, loading, error, refetch } = useProducts({
    page,
    pageSize: PAGE_SIZE,
  });
  const { deleteProduct } = useProductActions();

  const handleDeleteProduct = async (id: string) => {
    
    setDeleteError(null);
    setDeleteSuccess(null);

    const productName = products.find((p) => p.id === id)?.name;

    confirm.open({
      title: "Deletar produto",
      description: `Deseja deletar o produto "${productName}"?`,
      variant: "danger",
      confirmText: "Deletar",
      cancelText: "Cancelar",
      confirmButtonVariant: "destructive",
      onConfirm: async () => {
        confirm.setLoading(true);
        try {
          await deleteProduct(id);
          setDeleteSuccess(`Produto "${productName}" deletado com sucesso!`);
          setTimeout(() => setDeleteSuccess(null), 3000);
          refetch();
          confirm.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Erro ao deletar produto";
          setDeleteError(
            `Falha ao deletar "${productName}": ${errorMessage}`
          );

          setTimeout(() => setDeleteError(null), 5000);
          confirm.close();
        } finally {
          confirm.setLoading(false);
        }
      },
    });
  };

  

  const hasPreviousPage = page > 1;
  const hasNextPage = products.length === PAGE_SIZE;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar produtos</h1>
          <p className="text-muted-foreground">
            Visualize, edite e gerencie os produtos cadastrados.
          </p>
        </div>
        <Link to="/admin/products/create">
          <Button>+ Criar Produto</Button>
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

      {loading && (
        <p className="text-sm text-gray-500">Carregando produtos...</p>
      )}

      {error && <p className="text-sm text-red-600">Erro: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum produto encontrado.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductList products={products} onDelete={handleDeleteProduct}/>

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

      <ConfirmModal
        isOpen={confirm.isOpen}
        title={confirm.title}
        description={confirm.description}
        variant={confirm.variant}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        confirmButtonVariant={confirm.confirmButtonVariant}
        isLoading={confirm.isLoading}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
      />
    </div>
  );
}