import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "../ui/Input";

type PasswordFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly label?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly hint?: React.ReactNode;
  readonly showPassword?: boolean;
  readonly onToggleVisibility?: () => void;
};

export function PasswordField({
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  hint,
  showPassword,
  onToggleVisibility,
}: PasswordFieldProps) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  const isControlled = showPassword !== undefined;
  const visible = isControlled ? showPassword : internalShowPassword;

  function handleToggleVisibility() {
    if (isControlled) {
      onToggleVisibility?.();
      return;
    }

    setInternalShowPassword((prev) => !prev);
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
          required={required}
          disabled={disabled}
        />

        <button
          type="button"
          onClick={handleToggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          disabled={disabled}
        >
          {visible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </button>
      </div>

      {hint}
    </div>
  );
}