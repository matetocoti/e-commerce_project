import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard } from "lucide-react";

import { Card } from "../../components/ui/Card";
import { CollapsibleCard } from "../../components/ui/CollapsibleCard";
import { PageHeader } from "../../components/ui/PageHeader";
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
import { EmptyCart } from "../../components/cart/EmptyCart";

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

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    zipCode: "",
    state: "",
    notes: "",
    email: "",
    phoneNumber: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const submitting = cartSubmitting || checkoutSubmitting;

  
  const firstItemId = items[0]?.productId;
  const { product: firstProduct } = useProduct({ id: firstItemId || "" });
  
  const hasDigitalProducts = useMemo(() => {
    return items.length > 0 && firstProduct?.type === ProductType.DIGITAL;
  }, [items.length, firstProduct]);
  
  const hasPhysicalProducts = useMemo(() => {
    return items.length > 0 && firstProduct?.type === ProductType.PHYSICAL;
  }, [items.length, firstProduct]);


  async function handleCheckout() {
    
    if (hasPhysicalProducts && (!formData.street || !formData.city || !formData.zipCode || !formData.state)) {
      toast.error("Preencha todos os dados de endereço para produtos físicos.");
      return;
    }

    
    if (hasDigitalProducts && (!formData.email || !formData.phoneNumber)) {
      toast.error("Preencha email e telefone para produtos digitais.");
      return;
    }

    const orderData: Record<string, string | undefined> = {};
    
    if (hasPhysicalProducts) {
      orderData.street = formData.street;
      orderData.city = formData.city;
      orderData.zipCode = formData.zipCode;
      orderData.state = formData.state;
      if (formData.notes) {
        orderData.notes = formData.notes;
      } else {
        orderData.notes = "";
      }
    }

    if (hasDigitalProducts) {
      orderData.email = formData.email;
      orderData.phoneNumber = formData.phoneNumber;
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
      <PageHeader
        title="Carrinho de Compras"
        description="Revise os itens do seu pedido, forneça os dados de entrega e finalize sua compra."
        icon={<ShoppingCart className="h-6 w-6" />}
      />

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
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <div className="space-y-6 lg:col-span-8">
            <CollapsibleCard title="Itens do Pedido" defaultExpanded>
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
            </CollapsibleCard>

            <CollapsibleCard title="Dados da Entrega" defaultExpanded>
              {hasPhysicalProducts && (
                <div className="mb-2">
                  <PhysicalOrderForm
                    street={formData.street}
                    city={formData.city}
                    zipCode={formData.zipCode}
                    state={formData.state}
                    notes={formData.notes}
                    onStreetChange={(value) => handleChange("street", value)}
                    onCityChange={(value) => handleChange("city", value)}
                    onZipCodeChange={(value) => handleChange("zipCode", value)}
                    onStateChange={(value) => handleChange("state", value)}
                    onNotesChange={(value) => handleChange("notes", value)}
                  />
                </div>
              )}

              {hasDigitalProducts && (
                <div className="mt-2">
                  <DigitalOrderForm
                    email={formData.email}
                    phoneNumber={formData.phoneNumber}
                    userEmail={user?.email ?? undefined}
                    userPhoneNumber={user?.phoneNumber ?? undefined}
                    onEmailChange={(value) => handleChange("email", value)}
                    onPhoneNumberChange={(value) => handleChange("phoneNumber", value)}
                  />
                </div>
              )}
            </CollapsibleCard>
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