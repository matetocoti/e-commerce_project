import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, PackageOpen, CreditCard } from "lucide-react";

import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { CartItemRow } from "../../components/cart/CartItemRow";
import { CartSummary } from "../../components/cart/CartSummary";
import { PhysicalOrderForm } from "../../components/order/PhysicalOrderForm";
import { DigitalOrderForm } from "../../components/order/DigitalOrderForm";
import { useCart } from "../../hooks/cart/useCart";
import { useCheckout } from "../../hooks/order/useCheckout";
import { useProduct } from "../../hooks/product/useProduct";
import { useAccount } from "../../hooks/account/useAccount";
import { ProductType } from "../../types/product";
import { toast } from "sonner";

// Todo: Refactor this page into separate components for better readability and maintainability. 
export function Cart() {
  const navigate = useNavigate();
  const { user } = useAccount();

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
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

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
    
    if (hasPhysicalProducts && (!street || !city || !zipCode || !state)) {
      toast.error("Preencha todos os dados de endereço para produtos físicos.");
      return;
    }

    
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
      <Loading 
        message="Carregando seu carrinho..." 
        minHeight="min-h-[50vh]"
        maxWidth="max-w-6xl"
        size="md"
      />
    );
  }

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 xl:gap-8">
      <div className="mb-3">
        <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-gray-900">
          <ShoppingCart className="h-8 w-8 text-blue-600" />
          Meu Carrinho
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Confira seus itens e preencha os dados para finalizar a compra.
        </p>
      </div>

      {cartError && (
        <div className="mb-8 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          <span>{cartError}</span>
        </div>
      )}

      {checkoutError && (
        <div className="mb-8 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
          <span>{checkoutError}</span>
        </div>
      )}

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center overflow-hidden border-dashed py-16 text-center shadow-none bg-gray-50/50">
          <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
            <PackageOpen className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Seu carrinho está vazio</h2>
          <p className="mt-2 max-w-md text-gray-500">
            Parece que você ainda não adicionou nenhum produto. Navegue pela nossa loja e encontre o que precisa.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continuar Comprando
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="space-y-6 lg:col-span-8">
            <Card className="overflow-hidden border-gray-200 shadow-sm transition-shadow hover:shadow-md">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Itens do Pedido</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
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
              </div>
            </Card>

            <Card className="overflow-hidden border-gray-200 shadow-sm transition-shadow hover:shadow-md">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Dados da Entrega</h2>
              </div>
              <div className="p-6">
                {hasPhysicalProducts && (
                  <div className="mb-2">
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
                  </div>
                )}

                {hasDigitalProducts && (
                  <div className="mt-2">
                    <DigitalOrderForm
                      email={email}
                      phoneNumber={phoneNumber}
                      userEmail={user?.email ?? undefined}
                      userPhoneNumber={user?.phoneNumber ?? undefined}
                      onEmailChange={setEmail}
                      onPhoneNumberChange={setPhoneNumber}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-blue-100 to-transparent opacity-50 blur"></div>
              <Card className="relative overflow-hidden border-blue-100 shadow-md">
                <div className="border-b border-gray-100 bg-blue-50/80 px-6 py-4 flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Resumo da Compra</h2>
                </div>
                <div className="p-6">
                  <CartSummary
                    total={total}
                    itemCount={itemCount}
                    submitting={submitting}
                    onClear={() => void clear()}
                    onCheckout={() => void handleCheckout()}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}