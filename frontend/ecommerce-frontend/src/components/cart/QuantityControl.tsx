import { Button } from "../ui/Button";

interface QuantityControlProps {
  readonly quantity: number;
  readonly onIncrease: () => void;
  readonly onDecrease: () => void;
  readonly disabled?: boolean;
}

export function QuantityControl({quantity, onIncrease, onDecrease,disabled = false,}: Readonly<QuantityControlProps>) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onDecrease}
        disabled={disabled}
        aria-label="Remover uma unidade"
        title="Remover uma unidade"
      >
        -
      </Button>

      <span className="min-w-6 text-center text-sm font-medium text-gray-700">
        {quantity}
      </span>

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Adicionar uma unidade"
        title="Adicionar uma unidade"
      >
        +
      </Button>
    </div>
  );
}