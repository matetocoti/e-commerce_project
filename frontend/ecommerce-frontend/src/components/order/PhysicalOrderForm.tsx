import { Input } from "../ui/Input";

interface PhysicalOrderFormProps {
  street: string;
  city: string;
  zipCode: string;
  state: string;
  notes: string;
  onStreetChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onZipCodeChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

export function PhysicalOrderForm({
  street,
  city,
  zipCode,
  state,
  notes,
  onStreetChange,
  onCityChange,
  onZipCodeChange,
  onStateChange,
  onNotesChange,
}: Readonly<PhysicalOrderFormProps>) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Endereço de entrega
        </h2>
        <p className="text-sm text-gray-600">
          Preencha os dados para finalizar seu pedido.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          placeholder="Rua"
          required
        />

        <Input
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          placeholder="Cidade"
          required
        />

        <Input
          value={zipCode}
          onChange={(e) => onZipCodeChange(e.target.value)}
          placeholder="CEP"
          required
        />

        <Input
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          placeholder="Estado"
          required
        />

        <div className="md:col-span-2">
          <Input
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Observações (opcional)"
          />
        </div>
      </div>
    </div>
  );
}
