import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { useProduct } from "../hooks/useProduct";
import { Button } from "../components/ui/Button";
import { ProductImage } from "../components/product/ProductImage";
import { ProductPrice } from "../components/product/ProductPrice";
import { ProductInfoCard } from "../components/product/ProductInfoCard";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { product, loading, error } = useProduct({ id: id ?? "" });

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

          <ProductInfoCard title="Descrição do Produto">
            <p className="text-gray-600">{product.description}</p>
          </ProductInfoCard>

          <ProductInfoCard title="Informações">
            <div className="flex items-start gap-3">
              <Package className="mt-1 h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600">
                Confira os detalhes do produto antes de adicionar ao carrinho.
              </p>
            </div>
          </ProductInfoCard>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Adicionar ao Carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}