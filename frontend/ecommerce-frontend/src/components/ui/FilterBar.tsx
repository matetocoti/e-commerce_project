import { useState } from "react";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
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
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md overflow-hidden">
      
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center justify-between p-3 sm:p-4 transition-colors hover:bg-gray-50 focus:outline-none ${isExpanded ? "border-b border-gray-100" : ""}`}
        disabled={isLoading}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <span className="font-semibold text-gray-700 text-sm sm:text-base">
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 sm:ml-3 inline-flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] sm:text-[11px] font-bold text-white shadow-sm">
                {Number(type !== "") + Number(!!minPrice) + Number(!!maxPrice)}
              </span>
            )}
          </span>
        </div>
        <div className={`rounded-full p-1.5 transition-colors ${isExpanded ? "bg-gray-100 text-gray-700" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"}`}>
          <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
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
