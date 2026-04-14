import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useCart } from "../hooks/useCart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function Cart() {
  const { cart, loading, submitting, error, removeItem, clear } = useCart();

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-gray-600">Carregando carrinho...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carrinho</h1>
        <p className="mt-2 text-gray-600">
          Veja os itens adicionados antes de finalizar sua compra.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <Card className="p-8">
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {item.productName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Quantidade: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Unitário: {formatPrice(item.unitPrice)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 md:justify-end">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.subtotal)}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => void removeItem(item.productId)}
                      disabled={submitting}
                      aria-label={`Remover uma unidade de ${item.productName}`}
                      title="Remover uma unidade"
                    >
                      -
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-600">Total do carrinho</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(total)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void clear()}
                  disabled={submitting}
                >
                  Limpar carrinho
                </Button>

                <Button type="button" disabled>
                  Finalizar compra
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
