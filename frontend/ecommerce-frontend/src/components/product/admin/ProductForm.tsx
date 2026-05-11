import { Save } from "lucide-react";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { ProductType, type UpdateProductDto } from "../../../types/product";


interface ProductFormProps {
  readonly formData: UpdateProductDto | null;
  readonly onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  readonly onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  readonly isLoading?: boolean;
  readonly submitButtonText?: string;
}

export function ProductForm({formData, onSubmit, onInputChange, isLoading = false, submitButtonText = "Salvar",}: Readonly<ProductFormProps>) {
  if (!formData) {
    return null;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nome do Produto *
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          placeholder="Digite o nome do produto"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descrição *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Digite a descrição do produto"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="info" className="text-sm font-medium text-gray-700">
          Informações Adicionais *
        </label>
        <textarea
          id="info"
          name="info"
          value={formData.info}
          onChange={onInputChange}
          placeholder="Digite informações adicionais"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Preço (R$) *
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={onInputChange}
            placeholder="0.00"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="stock" className="text-sm font-medium text-gray-700">
            Estoque *
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={onInputChange}
            placeholder="0"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="type" className="text-sm font-medium text-gray-700">
            Tipo *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={onInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            required
          >
            <option value={ProductType.PHYSICAL}>Físico</option>
            <option value={ProductType.DIGITAL}>Digital</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
          URL da Imagem
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl || ""}
          onChange={onInputChange}
          placeholder="https://example.com/image.jpg"
          type="url"
        />
      </div>
      {formData.imageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Prévia da Imagem</p>
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="h-48 w-full rounded-lg object-cover border border-gray-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder-tech.png";
            }}
          />
        </div>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full gap-2"
      >
        <Save className="h-4 w-4" />
        {isLoading ? "Salvando..." : submitButtonText}
      </Button>
    </form>
  );
}
