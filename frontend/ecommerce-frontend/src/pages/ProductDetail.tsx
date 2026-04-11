import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import type { ProductDto } from "../types/product";
import { getProductById } from "../api/productApi";

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError("Produto não encontrado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getProductById(id);
        setProduct(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produto.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

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

  const formattedPrice = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-4xl font-bold text-blue-600">{formattedPrice}</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 font-semibold">Descrição do Produto</h3>
              <p className="text-gray-600">{product.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Package className="mt-1 h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="mb-1 font-semibold">Informações</h3>
                  <p className="text-sm text-gray-600">
                    Confira os detalhes do produto antes de adicionar ao carrinho.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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