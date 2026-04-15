import { Card } from "../components/ui/Card";
import { CartItemRow } from "../components/cart/CartItemRow";
import { CartSummary } from "../components/cart/CartSummary";
import { useCart } from "../hooks/useCart";

export function Cart() {
  const {
    cart,
    loading,
    submitting,
    error,
    addItem,
    removeItem,
    clear,
  } = useCart();

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
                <CartItemRow
                  key={item.productId}
                  item={item}
                  disabled={submitting}
                  onDecrease={(productId) => void removeItem(productId, 1)}
                  onIncrease={(productId) => void addItem(productId, 1)}
                />
              ))}
            </div>
          </Card>

          <CartSummary
            total={total}
            submitting={submitting}
            onClear={() => void clear()}
          />
        </div>
      )}
    </div>
  );
}