import { Save } from "lucide-react";

import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { ProductType, type UpdateProductDto } from "../../../types/product";

interface ProductFormProps {
  readonly formData: UpdateProductDto | null;
  readonly onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  readonly onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  readonly isLoading?: boolean;
  readonly submitButtonText?: string;
}

export function ProductForm({
  formData,
  onSubmit,
  onInputChange,
  isLoading = false,
  submitButtonText = "Salvar",
}: Readonly<ProductFormProps>) {
  if (!formData) {
    return null;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 sm:space-y-7">
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-semibold tracking-wide text-gray-800"
        >
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
        <label
          htmlFor="description"
          className="text-sm font-semibold tracking-wide text-gray-800"
        >
          Descrição *
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onInputChange}
          placeholder="Digite a descrição do produto"
          rows={5}
          className="
        min-h-[120px] w-full rounded-2xl border border-gray-200
        bg-white px-4 py-3 text-sm text-gray-800
        shadow-sm transition-all duration-200
        placeholder:text-gray-400
        focus:border-blue-400 focus:outline-none
        focus:ring-4 focus:ring-blue-100
        resize-none
      "
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="info"
          className="text-sm font-semibold tracking-wide text-gray-800"
        >
          Informações Adicionais *
        </label>

        <textarea
          id="info"
          name="info"
          value={formData.info}
          onChange={onInputChange}
          placeholder="Digite informações adicionais"
          rows={5}
          className="
        min-h-[120px] w-full rounded-2xl border border-gray-200
        bg-white px-4 py-3 text-sm text-gray-800
        shadow-sm transition-all duration-200
        placeholder:text-gray-400
        focus:border-blue-400 focus:outline-none
        focus:ring-4 focus:ring-blue-100
        resize-none
      "
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="text-sm font-semibold tracking-wide text-gray-800"
          >
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
          <label
            htmlFor="stock"
            className="text-sm font-semibold tracking-wide text-gray-800"
          >
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
          <label
            htmlFor="type"
            className="text-sm font-semibold tracking-wide text-gray-800"
          >
            Tipo *
          </label>

          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={onInputChange}
            className="
          h-11 w-full rounded-2xl border border-gray-200
          bg-white px-4 text-sm text-gray-800
          shadow-sm transition-all duration-200
          focus:border-blue-400 focus:outline-none
          focus:ring-4 focus:ring-blue-100
        "
            required
          >
            <option value={ProductType.PHYSICAL}>Físico</option>

            <option value={ProductType.DIGITAL}>Digital</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="imageUrl"
          className="text-sm font-semibold tracking-wide text-gray-800"
        >
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
        <div className="space-y-3">
          <p className="text-sm font-semibold tracking-wide text-gray-800">
            Prévia da Imagem
          </p>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="h-56 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-tech.png";
              }}
            />
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        size="lg"
        className="w-full gap-2"
      >
        <Save className="h-4 w-4 sm:h-5 sm:w-5" />

        {isLoading ? "Salvando..." : submitButtonText}
      </Button>
    </form>
  );
}
