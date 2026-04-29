import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { useProduct } from "../hooks/product/useProduct";
import { useAuth } from "../hooks/auth/useAuth";
import { useCart } from "../hooks/cart/useCart";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { ProductImage } from "../components/product/ProductImage";
import { ProductPrice } from "../components/product/ProductPrice";
import { ProductInfoCard } from "../components/product/ProductInfoCard";
import { AccordionItem } from "../components/ui/AccordionItem";


export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();
  const { addItem, submitting } = useCart();

  const { product, loading, error } = useProduct({ id: id ?? "" });

  const [quantity, setQuantity] = useState(1);

  function handleDecreaseQuantity() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncreaseQuantity() {
    setQuantity((prev) => prev + 1);
  }

  function handleQuantityChange(value: string) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 1) {
      setQuantity(1);
      return;
    }

    setQuantity(Math.floor(parsed));
  }

  async function handleAddToCart() {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    await addItem(product.id, quantity);
  }

  if (loading) {
    return <div className="p-8">Carregando produto...</div>;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Produto não encontrado</h1>

        <p className="mb-6 text-sm text-gray-600">
          {error ?? "Não foi possível localizar este produto."}
        </p>

        <Link to="/">
          <Button>Voltar para a loja</Button>
        </Link>
      </div>
    );
  }

  const imageSrc = product.imageUrl || "/placeholder-tech.png";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductImage src={imageSrc} alt={product.name} />

        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          </div>

          <ProductPrice price={product.price} />

          <div className="space-y-4">
            <ProductInfoCard title="Descrição">
              <p className="text-gray-600">{product.description}</p>
            </ProductInfoCard>
            

            <AccordionItem title="Informações Adicionais">
              <div className="flex items-start gap-2">
                <Package className="mt-0.5 h-5 w-5 text-blue-600 flex-shrink-0"/>
                <p className="text-sm text-gray-600">
                  {product.info || "Nenhuma informação adicional disponível."}
                </p>
              </div>
            </AccordionItem>
          </div>

          <ProductInfoCard title="Quantidade">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecreaseQuantity}
                disabled={submitting || quantity <= 1}
                aria-label="Diminuir quantidade"
              >
                -
              </Button>

              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-24 text-center"
                disabled={submitting}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncreaseQuantity}
                disabled={submitting}
                aria-label="Aumentar quantidade"
              >
                +
              </Button>
            </div>
          </ProductInfoCard>

          <div className="flex gap-4">
            <Button
              type="button"
              size="lg"
              className="flex-1"
              onClick={() => void handleAddToCart()}
              disabled={submitting}
            >
              {submitting ? "Adicionando..." : "Adicionar ao Carrinho"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}