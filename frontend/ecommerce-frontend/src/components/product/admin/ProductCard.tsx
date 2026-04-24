import { Edit2, Trash2, Package, Zap } from "lucide-react";
import type { AdminProductDto } from "../../../types/product";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/Badge";

interface AdminProductCardProps {
  readonly product: AdminProductDto;
  readonly onEdit?: (id: string) => void;
  readonly onDelete?: (id: string) => void;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
}: Readonly<AdminProductCardProps>) {
  const imageSrc = product.imageUrl || "/placeholder-tech.png";

  const stockStatus =
    product.stock === 0 ? "Fora de estoque" : `${product.stock} unidades`;
  const stockColor = product.stock === 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";

  return (
    <li className="overflow-hidden rounded border border-gray-200 bg-white transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <Badge className={product.isActive ? "bg-green-600 text-white" : "bg-gray-600 text-white"}>
            {product.isActive ? "Ativo" : "Inativo"}
          </Badge>
          <Badge className="gap-1 bg-blue-600 text-white">
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
      </div>

      <div className="p-5">
        <strong className="text-base text-gray-900">{product.name}</strong>

        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-bold text-blue-600">
            {product.price.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
          <Badge className={`text-xs ${stockColor}`}>
            {stockStatus}
          </Badge>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          Criado: {new Date(product.createdAt).toLocaleDateString("pt-BR")}
        </div>
      </div>

      <div className="border-t border-gray-200 px-5 py-3">
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
            className="flex-1 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete?.(product.id)}
          >
            <Trash2 className="h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>
    </li>
  );
}
