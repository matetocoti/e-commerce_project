import { Input } from "../ui/Input";

interface DigitalOrderFormProps {
  email: string;
  phoneNumber: string;
  onEmailChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export function DigitalOrderForm({
  email,
  phoneNumber,
  onEmailChange,
  onPhoneNumberChange,
}: DigitalOrderFormProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Dados de contato
        </h2>
        <p className="text-sm text-gray-600">
          Preencha seus dados para receber o produto digital.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Input
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="Telefone"
            required
          />
        </div>
      </div>
    </div>
  );
}
