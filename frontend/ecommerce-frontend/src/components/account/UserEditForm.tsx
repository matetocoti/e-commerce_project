import { Check, X } from "lucide-react";

interface UserEditFormProps {
  readonly username: string;
  readonly phoneNumber: string;
  readonly onUsernameChange: (value: string) => void;
  readonly onPhoneChange: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

export function UserEditForm({
  username,
  phoneNumber,
  onUsernameChange,
  onPhoneChange,
  onSubmit,
  onCancel,
}: Readonly<UserEditFormProps>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-semibold text-gray-900">
          Nome de Usuário
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Digite seu nome de usuário"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-900">
          Número de Telefone
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Digite seu número de telefone"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-10"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          <Check className="w-5 h-5" />
          Salvar
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>
    </form>
  );
}