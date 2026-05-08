import { Edit2, Package, Zap, AlertCircle, Clock } from "lucide-react";
import type { AdminProductDto } from "../../../types/product";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { ConfirmModal } from "../../ui/ConfirmModal";
import { formatPrice } from "../../../utils/currency/formatPrice";
import { formatDate } from "../../../utils/date/formatDate";
import { Link } from "react-router-dom";
import { useConfirm } from "../../../hooks/ui/useConfirm";


interface AdminProductCardProps {
  readonly product: AdminProductDto;
  readonly onActivate?: (id: string) => void;
  readonly onDeactivate?: (id: string) => void;
}

export function ProductCard({product, onActivate, onDeactivate}: Readonly<AdminProductCardProps>) {
  const confirm = useConfirm();
  const imageSrc = product.imageUrl || "/placeholder-tech.png";
  
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const stockStatus = isOutOfStock ? "Sem estoque" : `${product.stock} un.`;
  
  const getStockColor = (): string => {
    if (isOutOfStock) return "bg-red-600 text-white";
    if (isLowStock) return "bg-orange-600 text-white";
    return "bg-emerald-600 text-white";
  };
  
 

  const stockColor = getStockColor();

  
  const lastModified = new Date(product.updatedAt);
  const now = new Date();
  const hoursSinceUpdate = (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60);
  const isRecentlyModified = hoursSinceUpdate < 24;

  const formattedPrice = formatPrice(product.price);

  const handleDeactivate = () => {
    confirm.open({
      title: "Desativar produto",
      description: `Tem certeza que deseja desativar "${product.name}"? O produto não será mais exibido para clientes.`,
      variant: "warning",
      confirmText: "Sim, desativar",
      cancelText: "Cancelar",
      confirmButtonVariant: "default",
      onConfirm: () => {
        onDeactivate?.(product.id);
        confirm.close();
      },
    });
  };

  const handleActivate = () => {
    confirm.open({
      title: "Ativar produto",
      description: `Tem certeza que deseja ativar "${product.name}"? O produto será exibido para clientes.`,
      variant: "success",
      confirmText: "Sim, ativar",
      cancelText: "Cancelar",
      confirmButtonVariant: "default",
      onConfirm: () => {
        onActivate?.(product.id);
        confirm.close();
      },
    });
  };

  return (
    <>
      <ConfirmModal 
        isOpen={confirm.isOpen}
        title={confirm.title}
        description={confirm.description}
        variant={confirm.variant}
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
        confirmButtonVariant={confirm.confirmButtonVariant}
        isLoading={confirm.isLoading}
        onConfirm={confirm.onConfirm}
        onCancel={confirm.onCancel}
      />
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
          <Link to={`/admin/products/${product.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
          </Link>

          {product.isActive ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-orange-600 hover:bg-orange-50 hover:text-orange-700 border-orange-200"
              onClick={handleDeactivate}
            >
              Desativar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-green-600 hover:bg-green-50 hover:text-green-700 border-green-200"
              onClick={handleActivate}
            >
              Ativar
            </Button>
          )}
        </div>
      </div>
      </li>
    </>
  );
}
