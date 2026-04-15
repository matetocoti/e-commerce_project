import { QuantityControl } from "./QuantityControl";
import { formatPrice } from "../../utils/currency/formatPrice";
import type { CartItemDto } from "../../types/cart";

interface CartItemRowProps {
  readonly item: CartItemDto;
  readonly onDecrease: (productId: string) => void;
  readonly onIncrease: (productId: string) => void;
  readonly disabled?: boolean;
}

export function CartItemRow({item, onDecrease, onIncrease, disabled = false}: Readonly<CartItemRowProps>) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-medium text-gray-900">{item.productName}</h2>
        <p className="text-sm text-gray-600">
          Unitário: {formatPrice(item.unitPrice)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        <p className="font-semibold text-gray-900">
          {formatPrice(item.subtotal)}
        </p>

        <QuantityControl
          quantity={item.quantity}
          onDecrease={() => onDecrease(item.productId)}
          onIncrease={() => onIncrease(item.productId)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}