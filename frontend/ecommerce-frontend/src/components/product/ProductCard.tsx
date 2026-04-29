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
    <li className="overflow-hidden rounded border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] w-full bg-gray-100 ">
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-5">
          <strong className="text-base text-gray-900">{product.name}</strong>

          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {product.description}
          </p>

          <div className="mt-4 text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-3 bg-gray-50 text-center">
        <Link to={`/product/${product.id}`} className="block">
          <Button className="w-full">Ver detalhes</Button>
        </Link>
      </div>
    </li>
  );
}