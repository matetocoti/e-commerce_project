import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";
import { ProductType } from "../../types/product";

interface FilterBarProps {
  readonly onFiltersChange: (filters: FilterState) => void;
  readonly isLoading?: boolean;
}

export interface FilterState {
  type?: number;
  minPrice?: number;
  maxPrice?: number;
}

const PRODUCT_TYPES = [
  { value: ProductType.PHYSICAL, label: "Físico" },
  { value: ProductType.DIGITAL, label: "Digital" },
];

export function FilterBar({ onFiltersChange, isLoading = false }: Readonly<FilterBarProps>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [type, setType] = useState<number | "">("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleApplyFilters() {
    const filters: FilterState = {
      type: type === "" ? undefined : Number(type),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };
    onFiltersChange(filters);
  }

  function handleClearFilters() {
    setType("");
    setMinPrice("");
    setMaxPrice("");
    onFiltersChange({});
  }

  const hasActiveFilters = type !== "" || minPrice || maxPrice;

  return (
    <div className="w-full space-y-3 rounded-lg border border-gray-200 bg-white p-4">
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-md p-2 hover:bg-gray-50"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 inline-block rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                {Number(type !== "") + Number(!!minPrice) + Number(!!maxPrice)}
              </span>
            )}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-600" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-600" />
        )}
      </button>

      
      {isExpanded && (
        <div className="space-y-4 border-t border-gray-200 pt-4">
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

          
          <div className="grid grid-cols-2 gap-3">
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

          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="flex-1"
            >
              Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
