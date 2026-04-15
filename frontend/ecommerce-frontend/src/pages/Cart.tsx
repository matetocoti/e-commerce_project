import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { CartItemRow } from "../components/cart/CartItemRow";
import { CartSummary } from "../components/cart/CartSummary";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import { toast } from "sonner";

export function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    submitting: cartSubmitting,
    error: cartError,
    addItem,
    removeItem,
    clear,
    reloadCart,
  } = useCart();

  const {
    checkout,
    submitting: checkoutSubmitting,
    error: checkoutError,
  } = useCheckout();

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const submitting = cartSubmitting || checkoutSubmitting;

  async function handleCheckout() {
    const order = await checkout({
      street,
      city,
      zipCode,
      state,
      notes,
    });

    if (!order) {
      toast.error("Erro ao finalizar compra.");
      return;
    }

    await reloadCart();
    navigate("/orders");
  }

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

      {cartError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {cartError}
        </div>
      )}

      {checkoutError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {checkoutError}
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

          <Card className="p-6">
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Endereço de entrega
              </h2>
              <p className="text-sm text-gray-600">
                Preencha os dados para finalizar seu pedido.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Rua"
                required
              />

              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Cidade"
                required
              />

              <Input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="CEP"
                required
              />

              <Input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Estado"
                required
              />

              <div className="md:col-span-2">
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações (opcional)"
                />
              </div>
            </div>
          </Card>

          <CartSummary
            total={total}
            submitting={submitting}
            onClear={() => void clear()}
            onCheckout={() => void handleCheckout()}
          />
        </div>
      )}
    </div>
  );
}