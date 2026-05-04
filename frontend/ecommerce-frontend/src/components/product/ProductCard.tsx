import { Link } from "react-router-dom";
import type { ProductDto } from "../../types/product";
import { Button } from "../ui/Button";
import { formatPrice } from "../../utils/currency/formatPrice";

interface ProductCardProps {
  readonly product: ProductDto;
}

export function ProductCard({ product }: Readonly<ProductCardProps>) {
  const imageSrc = product.imageUrl || "/placeholder-tech.png";

  return (
    <li className="overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-200">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] w-full bg-gray-50 flex items-center justify-center p-4">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="p-5">
          <strong className="text-lg font-semibold text-gray-900 line-clamp-1">{product.name}</strong>

          <p className="mt-2 line-clamp-2 text-sm text-gray-500 min-h-[2.5rem]">
            {product.description}
          </p>

          <div className="mt-5 flex items-end">
            <span className="text-2xl font-bold tracking-tight text-blue-600">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <Link to={`/product/${product.id}`} className="block">
          <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors duration-200">
            Ver detalhes
          </Button>
        </Link>
      </div>
    </li>
  );
}