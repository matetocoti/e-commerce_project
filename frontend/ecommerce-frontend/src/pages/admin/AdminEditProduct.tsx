import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { useProduct } from "../../hooks/admin/useProduct";
import { useProductActions } from "../../hooks/admin/useProductActions";
import { ProductForm } from "../../components/product/admin/ProductForm";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Loading } from "../../components/ui/Loading";
import { ProductType, type UpdateProductDto } from "../../types/product";
import { PageHeader } from "../../components/ui/PageHeader";

export function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading: productLoading } = useProduct({ id: id ?? "" });
  const { updateProduct, isLoading: updating, error: updateError } = useProductActions();

  const [formData, setFormData] = useState<UpdateProductDto | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  
  useEffect(() => {
    if (product && !formData) {
      setFormData({
        name: product.name,
        description: product.description,
        info: product.info,
        type: product.type,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => {
      if (!prev) return null;

      if (type === "number") {
        return { ...prev, [name]: Number(value) };
      }

      if (name === "type") {
        return { ...prev, [name]: Number(value) as ProductType };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (!formData || !id) {
      setLocalError("Dados do produto ou ID inválido");
      return;
    }

    
    if (!formData.name.trim()) {
      setLocalError("Nome do produto é obrigatório");
      return;
    }

    if (formData.price < 0) {
      setLocalError("Preço não pode ser negativo");
      return;
    }

    if (formData.stock < 0) {
      setLocalError("Estoque não pode ser negativo");
      return;
    }

    try {
      await updateProduct(id, formData);
      setSuccessMessage("Produto atualizado com sucesso!");
      setTimeout(() => {
        navigate("/admin/products");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";
      setLocalError(errorMessage);
    }
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">Produto não encontrado</p>
        </div>

        <Link to="/admin/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para produtos
          </Button>
        </Link>
      </div>
    );
  }

  if (productLoading || !formData) {
    return (
      <Loading 
        message="Carregando formulário..." 
        maxWidth="max-w-2xl"
        minHeight="p-4"
        size="sm"
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <PageHeader
          title="Editar Produto"
          description={`ID: ${id}`}
        />
      </div>

      
      {successMessage && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">✓ {successMessage}</p>
        </div>
      )}

     
      {(localError || updateError) && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{localError || updateError}</p>
        </div>
      )}

      <Card className="p-6">
        <ProductForm
          formData={formData}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          isLoading={updating}
          submitButtonText="Salvar Alterações"
        />

        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Link to="/admin/products" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancelar
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
