import { useState } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ProductType } from "../../types/product";

interface FilterBarProps {
  readonly onFiltersChange: (filters: FilterState) => void;
  readonly isLoading?: boolean;
  readonly isAdmin?: boolean;
}

export interface FilterState {
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  hasImage?: boolean;
  hasLowStock?: boolean;
  outOfStock?: boolean;
}

const PRODUCT_TYPES = [
  { value: ProductType.PHYSICAL, label: "Físico" },
  { value: ProductType.DIGITAL, label: "Digital" },
];

export function FilterBar({ onFiltersChange, isLoading = false, isAdmin = false }: Readonly<FilterBarProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [type, setType] = useState<number | "">("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isActive, setIsActive] = useState<"" | "true" | "false">("");
  const [hasImage, setHasImage] = useState(false);
  const [hasLowStock, setHasLowStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);

  function handleApplyFilters() {
    const filters: FilterState = {
      type: type === "" ? undefined : Number(type),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      isActive: isActive === "" ? undefined : isActive === "true",
      hasImage: hasImage ? false : undefined,
      hasLowStock: hasLowStock ? true : undefined,
      outOfStock: outOfStock ? true : undefined,
    };
    onFiltersChange(filters);
  }

  function handleClearFilters() {
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setIsActive("");
    setHasImage(false);
    setHasLowStock(false);
    setOutOfStock(false);
    onFiltersChange({});
  }

  const hasActiveFilters = type !== "" || minPrice || maxPrice || isActive !== "" || hasImage || hasLowStock || outOfStock;

  return (
    <div className="w-full rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-300/80 overflow-hidden">
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center justify-between p-4 sm:p-5 transition-colors hover:bg-gray-50/50 focus:outline-none ${isExpanded ? "border-b border-gray-100 bg-gray-50/30" : ""}`}
        disabled={isLoading}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100/50">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-bold text-gray-800 text-sm sm:text-base tracking-wide flex items-center">
            Filtros & Pesquisa
            {hasActiveFilters && (
              <span className="ml-3 inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] sm:text-xs font-black text-white shadow-sm ring-2 ring-white">
                {Number(type !== "") + Number(!!minPrice) + Number(!!maxPrice) + Number(isActive !== "") + Number(hasImage) + Number(hasLowStock) + Number(outOfStock)}
              </span>
            )}
          </span>
        </div>
        <div className={`rounded-full p-2 transition-all duration-300 ${isExpanded ? "bg-white shadow-sm border border-gray-200 text-gray-800" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700"}`}>
          <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 ease-out ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      
      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200 space-y-4 sm:space-y-5 p-4 sm:p-5">
          {/* Type */}
          <div>
            <label htmlFor="type-select" className="mb-2 block text-sm font-medium text-gray-700">
              Tipo
            </label>
            <select
              id="type-select"
              value={type}
              onChange={(e) => setType(e.target.value === "" ? "" : Number(e.target.value))}
              disabled={isLoading}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            >
              <option value="">Todos os tipos</option>
              {PRODUCT_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>

          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="min-price" className="mb-2 block text-sm font-medium text-gray-700">
                Preço mínimo
              </label>
              <Input
                id="min-price"
                type="number"
                placeholder="R$ 0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                disabled={isLoading}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="max-price" className="mb-2 block text-sm font-medium text-gray-700">
                Preço máximo
              </label>
              <Input
                id="max-price"
                type="number"
                placeholder="R$ 9999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                disabled={isLoading}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Status - Only for Admin */}
          {isAdmin && (
            <>
              <div>
                <label htmlFor="status-select" className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status-select"
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value as "" | "true" | "false")}
                  disabled={isLoading}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option value="">Todos os status</option>
                  <option value="true">Ativado</option>
                  <option value="false">Desativado</option>
                </select>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 pb-2 rounded-lg bg-gray-50 border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <input
                    id="image-check"
                    type="checkbox"
                    checked={hasImage}
                    onChange={(e) => setHasImage(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 transition-colors"
                  />
                  <label htmlFor="image-check" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Sem Imagem
                  </label>
                </div>

                
                <div className="flex items-center gap-3">
                  <input
                    id="lowstock-check"
                    type="checkbox"
                    checked={hasLowStock}
                    onChange={(e) => setHasLowStock(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 transition-colors"
                  />
                  <label htmlFor="lowstock-check" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Estoque Baixo
                  </label>
                </div>

                
                <div className="flex items-center gap-3">
                  <input
                    id="outofstock-check"
                    type="checkbox"
                    checked={outOfStock}
                    onChange={(e) => setOutOfStock(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50 transition-colors"
                  />
                  <label htmlFor="outofstock-check" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                    Sem Estoque
                  </label>
                </div>
              </div>
            </>
          )}

          
          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <Button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                disabled={isLoading}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors justify-center"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
