import { Button } from "../ui/Button";
import { formatPrice } from "../../utils/currency/formatPrice";
import { CheckCircle2, Trash2 } from "lucide-react";

interface CartSummaryProps {
  readonly total: number;
  readonly itemCount: number;
  readonly submitting?: boolean;
  readonly onClear: () => void;
  readonly onCheckout: () => void;
}

export function CartSummary({
  total,
  itemCount,
  submitting = false,
  onClear,
  onCheckout,
}: Readonly<CartSummaryProps>) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        
        {/* Breakdown Values */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-gray-600">
            <span className="text-[13px] font-medium uppercase tracking-wide">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})</span>
            <span className="text-sm font-semibold text-gray-900">{formatPrice(total)}</span>
          </div>
          
          <div className="h-px w-full bg-gray-100" />
          
          <div className="flex items-end justify-between pt-1">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-2xl font-black text-blue-600 tracking-tight leading-none">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full mt-3">
          <Button 
            type="button" 
            onClick={onCheckout} 
            disabled={submitting}
            className="w-full py-3 text-sm font-bold shadow flex items-center justify-center gap-2 hover:shadow-md transition-all rounded-lg"
          >
            <CheckCircle2 className="h-4 w-4" />
            Finalizar Pedido
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            disabled={submitting}
            className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors border-transparent shadow-none"
          >
            <Trash2 className="h-3 w-3" />
            Esvaziar Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}