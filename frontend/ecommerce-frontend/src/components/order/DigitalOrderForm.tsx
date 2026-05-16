import { useState } from "react";
import { Input } from "../ui/Input";

interface DigitalOrderFormProps {
  email: string;
  phoneNumber: string;
  userEmail?: string;
  userPhoneNumber?: string;
  onEmailChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
}

export function DigitalOrderForm({
  email,
  phoneNumber,
  userEmail,
  userPhoneNumber,
  onEmailChange,
  onPhoneNumberChange,
}: Readonly<DigitalOrderFormProps>) {
  const [useUserData, setUseUserData] = useState(false);

  const handleUseUserData = (checked: boolean) => {
    setUseUserData(checked);
    if (checked && userEmail && userPhoneNumber) {
      onEmailChange(userEmail);
      onPhoneNumberChange(userPhoneNumber);
    } else {
      onEmailChange("");
      onPhoneNumberChange("");
    }
  };

  const isDisabled = useUserData;
  const hasUserData = !!userEmail && !!userPhoneNumber;

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

      {hasUserData && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <input
            type="checkbox"
            id="use-user-data"
            checked={useUserData}
            onChange={(e) => handleUseUserData(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label
            htmlFor="use-user-data"
            className="
            cursor-pointer
            text-sm
            font-medium
            text-gray-700
            select-none
            transition-colors
            hover:text-primary
            "
          >
            Usar dados cadastrados na minha conta
          </label>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email"
            required
            disabled={isDisabled}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
            placeholder="Telefone"
            required
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
}
