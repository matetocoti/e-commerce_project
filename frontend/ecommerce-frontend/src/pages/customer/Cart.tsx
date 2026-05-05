import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../../components/ui/Card";
import { CartItemRow } from "../../components/cart/CartItemRow";
import { CartSummary } from "../../components/cart/CartSummary";
import { PhysicalOrderForm } from "../../components/order/PhysicalOrderForm";
import { DigitalOrderForm } from "../../components/order/DigitalOrderForm";
import { useCart } from "../../hooks/cart/useCart";
import { useCheckout } from "../../hooks/order/useCheckout";
import { useProduct } from "../../hooks/product/useProduct";
import { ProductType } from "../../types/product";
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
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const submitting = cartSubmitting || checkoutSubmitting;

  // Get first item's product to check types
  const firstItemId = items[0]?.productId;
  const { product: firstProduct } = useProduct({ id: firstItemId || "" });
  
  // Determine product types from cart items
  const hasDigitalProducts = useMemo(() => {
    return items.length > 0 && firstProduct?.type === ProductType.DIGITAL;
  }, [items.length, firstProduct]);
  
  const hasPhysicalProducts = useMemo(() => {
    return items.length > 0 && firstProduct?.type === ProductType.PHYSICAL;
  }, [items.length, firstProduct]);


  async function handleCheckout() {
    // Validate physical products
    if (hasPhysicalProducts && (!street || !city || !zipCode || !state)) {
      toast.error("Preencha todos os dados de endereço para produtos físicos.");
      return;
    }

    // Validate digital products
    if (hasDigitalProducts && (!email || !phoneNumber)) {
      toast.error("Preencha email e telefone para produtos digitais.");
      return;
    }

    const orderData: Record<string, string | undefined> = {};
    
    if (hasPhysicalProducts) {
      orderData.street = street;
      orderData.city = city;
      orderData.zipCode = zipCode;
      orderData.state = state;
      if (notes) {
        orderData.notes = notes;
      } else {
        orderData.notes = "";
      }
    }

    if (hasDigitalProducts) {
      orderData.email = email;
      orderData.phoneNumber = phoneNumber;
    }

    // @ts-expect-error - Order data is built dynamically based on product types
    const order = await checkout(orderData);

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
            {hasPhysicalProducts && (
              <PhysicalOrderForm
                street={street}
                city={city}
                zipCode={zipCode}
                state={state}
                notes={notes}
                onStreetChange={setStreet}
                onCityChange={setCity}
                onZipCodeChange={setZipCode}
                onStateChange={setState}
                onNotesChange={setNotes}
              />
            )}

            {hasDigitalProducts && (
              <DigitalOrderForm
                email={email}
                phoneNumber={phoneNumber}
                onEmailChange={setEmail}
                onPhoneNumberChange={setPhoneNumber}
              />
            )}
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