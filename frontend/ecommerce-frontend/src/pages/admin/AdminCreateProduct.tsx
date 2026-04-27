import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle } from "lucide-react";

import { useProductActions } from "../../hooks/admin/useProductActions";
import { ProductForm } from "../../components/product/admin/ProductForm";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { ProductType, type UpdateProductDto } from "../../types/product";

export function AdminCreateProduct() {
  const navigate = useNavigate();
  const { createProduct, isLoading: creating, error: updateError } = useProductActions();

  const [formData, setFormData] = useState<UpdateProductDto>({
    name: "",
    description: "",
    info: "",
    price: 0,
    stock: 0,
    type: ProductType.PHYSICAL,
    imageUrl: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "price" || name === "stock") {
        updated[name] = Number(value) as never;
      }

      if (name === "type") {
        updated.type = Number(value) as ProductType;
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setLocalError("Nome do produto é obrigatório");
      return;
    }

    if (!formData.description.trim()) {
      setLocalError("Descrição é obrigatória");
      return;
    }

    if (!formData.info.trim()) {
      setLocalError("Informações adicionais são obrigatórias");
      return;
    }

    if (formData.price <= 0) {
      setLocalError("Preço deve ser maior que zero");
      return;
    }

    if (formData.stock < 0) {
      setLocalError("Estoque não pode ser negativo");
      return;
    }

    try {
      const newProduct = await createProduct(formData);
      if (newProduct) {
        setSuccessMessage("Produto criado com sucesso!");
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      }
    } catch (err) {
      console.error("Error creating product:", err);
      // Error is already set by the hook
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Link to="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Criar Novo Produto</h1>
          <p className="text-sm text-gray-600">Preencha os campos abaixo</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">✓ {successMessage}</p>
        </div>
      )}

      {/* Error Message */}
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
          isLoading={creating}
          submitButtonText="Criar Produto"
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
