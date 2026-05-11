import { Edit2, Package, Zap, AlertCircle, Clock } from "lucide-react";
import type { AdminProductDto } from "../../../types/product";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";
import { ConfirmModal } from "../../ui/ConfirmModal";
import { formatPrice } from "../../../utils/currency/formatPrice";
import { Link } from "react-router-dom";
import { useConfirm } from "../../../hooks/ui/useConfirm";
import { ProductImage } from "../ProductImage";



interface AdminProductCardProps {
  readonly product: AdminProductDto;
  readonly onActivate?: (id: string) => void;
  readonly onDeactivate?: (id: string) => void;
}

export function ProductCard({product, onActivate, onDeactivate}: Readonly<AdminProductCardProps>) {
  const confirm = useConfirm();
  const imageSrc = product.imageUrl || null;

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
      <li className="group/card flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 h-full">
        <div className="relative aspect-[4/3] w-full bg-gray-50">
          <ProductImage src={imageSrc || ""} alt={product.name} className="rounded-t-xl" />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-t-xl" />

          {isLowStock && !isOutOfStock && (
            <div className="absolute left-2 top-2">
              <Badge className="gap-1 bg-yellow-500 text-white animate-pulse">
                <AlertCircle className="h-3 w-3" />
                Estoque baixo
              </Badge>
            </div>
          )}

          <div className="absolute right-2 top-2 flex flex-col gap-2 scale-90 sm:scale-100 origin-top-right">
            <Badge className={`shadow-sm backdrop-blur-md ${product.isActive ? "bg-emerald-500/90 text-white border-emerald-400/50" : "bg-gray-500/90 text-white border-gray-400/50"}`}>
              <span className={`flex items-center justify-center w-3 h-3 mr-1.5 rounded-full ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                {product.isActive ? "✓" : "✗"}
              </span>
              {product.isActive ? "Ativo" : "Inativo"}
            </Badge>
            <Badge className="gap-1.5 shadow-sm backdrop-blur-md bg-blue-600/90 border-blue-400/50 text-white font-medium">
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
            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-blue-500/90 backdrop-blur-md border border-blue-400/50 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm">
              <Clock className="h-3 w-3" />
              Recente
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5">
          {/* Nome do produto */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <strong className="text-base font-bold text-gray-900 leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </strong>
          </div>

          <p className="mt-0 text-[11px] text-gray-400 font-mono tracking-wider uppercase mb-3">
            ID: {product.id.slice(0, 8)}...
          </p>

          <p className="line-clamp-2 text-sm text-gray-500 flex-1 leading-relaxed">
            {product.description || <span className="italic opacity-50">Sem descrição</span>}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 transition-colors hover:bg-gray-100">
              <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase mb-1">Preço</p>
              <p className="text-lg font-black text-blue-600 tracking-tight">{formattedPrice}</p>
            </div>
            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 transition-colors hover:bg-gray-100">
              <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase mb-1">Estoque</p>
              <Badge className={`text-xs justify-center w-full font-bold shadow-sm ${stockColor}`}>
                {stockStatus}
              </Badge>
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
            <div className="text-[11px]">
              <p className="text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Criado em</p>
              <p className="text-gray-700 font-medium">
                {new Date(product.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="text-[11px]">
              <p className="text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Atualizado</p>
              <p className="text-gray-700 font-medium">
                {new Date(product.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-gray-50/80 p-4">
          <div className="flex gap-3">
            <Link to={`/admin/products/${product.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-lg bg-white border-gray-200 shadow-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium py-4"
              >
                <Edit2 className="h-4 w-4" />
                Editar
              </Button>
            </Link>

            {product.isActive ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 rounded-lg bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 hover:shadow-orange-100/50 shadow-sm border-gray-200 transition-all font-medium py-4"
                onClick={handleDeactivate}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Desativar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-emerald-100/50 shadow-sm border-gray-200 transition-all font-medium py-4"
                onClick={handleActivate}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ativar
              </Button>
            )}
          </div>
        </div>
      </li>
    </>
  );
}
