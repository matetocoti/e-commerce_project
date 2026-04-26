import { Edit2, Trash2, Package, Zap, AlertCircle, Clock } from "lucide-react";
import type { AdminProductDto } from "../../../types/product";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { formatPrice } from "../../../utils/currency/formatPrice";
import { formatDate } from "../../../utils/date/formatDate";


interface AdminProductCardProps {
  readonly product: AdminProductDto;
  readonly onEdit?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
}

export function ProductCard({product, onEdit, onDelete}: Readonly<AdminProductCardProps>) {
  const imageSrc = product.imageUrl || "/placeholder-tech.png";
  
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const stockStatus = isOutOfStock ? "Sem estoque" : `${product.stock} un.`;
  
  const getStockColor = (): string => {
    if (isOutOfStock) return "bg-red-600 text-white";
    if (isLowStock) return "bg-orange-600 text-white";
    return "bg-emerald-600 text-white";
  };
  
  const getProductStatus = (): boolean => {
    return product.isActive ;
  }
  
 

  const stockColor = getStockColor();

  
  const lastModified = new Date(product.updatedAt);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60);
  const isRecentlyModified = hoursSinceUpdate < 24;

  const formattedPrice = formatPrice(product.price);

  return (
    <li className="overflow-hidden rounded border border-gray-200 bg-white transition-all duration-200 hover:shadow-lg hover:border-gray-300">

      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        
        {isLowStock && !isOutOfStock && (
          <div className="absolute left-2 top-2">
            <Badge className="gap-1 bg-yellow-500 text-white animate-pulse">
              <AlertCircle className="h-3 w-3" />
              Estoque baixo
            </Badge>
          </div>
        )}

        
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <Badge className={product.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
            {product.isActive ? "✓ Ativo" : "✗ Inativo"}
          </Badge>
          <Badge className="gap-1 bg-blue-600 text-white text-xs">
            {product.type === 0 ? (
              <>
                <Package className="h-3 w-3" />
                Físico
              </>
            ) : (
              <>
                <Zap className="h-3 w-3" />
                Digital
              </>
            )}
          </Badge>
        </div>

        
        {isRecentlyModified && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
            <Clock className="h-3 w-3" />
            Atualizado
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Nome do produto */}
        <div className="flex items-start justify-between gap-2">
          <strong className="flex-1 text-sm font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </strong>
        </div>

        <p className="mt-1 text-xs text-gray-400 font-mono">
          ID: {product.id.slice(0, 8)}...
        </p>

        <p className="mt-2 line-clamp-2 text-xs text-gray-600">
          {product.description}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded bg-gray-50 p-2">
            <p className="text-xs text-gray-500">Preço</p>
            <p className="text-sm font-bold text-blue-600">{formattedPrice}</p>
          </div>
          <div className="rounded bg-gray-50 p-2">
            <p className="text-xs text-gray-500">Estoque</p>
            <Badge className={`text-xs justify-center ${stockColor}`}>
              {stockStatus}
            </Badge>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
          <div className="text-xs">
            <p className="text-gray-400">Criado</p>
            <p className="text-gray-700 font-medium">{formatDate(product.createdAt)}</p>
          </div>
          <div className="text-xs">
            <p className="text-gray-400">Atualizado</p>
            <p className="text-gray-700 font-medium">{formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => onEdit?.(product.id)}
          >
            <Edit2 className="h-4 w-4" />
            Editar
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
            onClick={() => onDelete?.(product.id)}
            disabled={!getProductStatus()}
          >
            <Trash2 className="h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>
    </li>
  );
}
