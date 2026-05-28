import { X, Mail, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { formatCpf, cleanCpf, validateCpf, validateEmail } from "../../utils/data/cpf";

interface PaymentDataModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (email: string, cpf: string) => Promise<void>;
  readonly isLoading?: boolean;
  readonly initialEmail?: string;
  readonly initialCpf?: string;
}

export function PaymentDataModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  initialEmail = "",
  initialCpf = "",
}: PaymentDataModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [cpf, setCpf] = useState(initialCpf);
  const [errors, setErrors] = useState<{ email?: string; cpf?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; cpf?: string } = {};

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    const cpfValidation = validateCpf(cpf);
    if (!cpfValidation.isValid) {
      newErrors.cpf = cpfValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onConfirm(email, cleanCpf(cpf));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: undefined }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-700/20">
                <FileText className="h-6 w-6 text-white" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                Dados para Pagamento
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Confirme seus dados para processar o pagamento
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="
                flex h-9 w-9 items-center justify-center rounded-full
                text-gray-400 transition-all duration-200
                hover:bg-gray-100 hover:text-gray-700
                active:scale-95
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        
        <div className="space-y-4 overflow-y-auto px-6 py-5">
          
          <div className="space-y-2">
            <label htmlFor="payment-email" className="block text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-blue-600" />
                Email
              </div>
            </label>
            <Input
              id="payment-email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="seu@email.com"
              disabled={isLoading}
              className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-600/20" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          
          <div className="space-y-2">
            <label htmlFor="payment-cpf" className="block text-sm font-semibold text-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-blue-600" />
                CPF
              </div>
            </label>
            <Input
              id="payment-cpf"
              type="text"
              value={cpf}
              onChange={handleCpfChange}
              placeholder="000.000.000-00"
              disabled={isLoading}
              maxLength={14}
              className={errors.cpf ? "border-red-500 focus:border-red-500 focus:ring-red-600/20" : ""}
            />
            {errors.cpf && (
              <p className="text-xs text-red-600 font-medium">{errors.cpf}</p>
            )}
          </div>

          
          <div className="rounded-lg bg-blue-50/80 border border-blue-200/50 p-3 mt-4">
            <p className="text-xs font-medium leading-snug text-blue-900">
              <span className="font-bold">ℹ️ Informação:</span> Seus dados serão usados apenas para processar este pagamento de forma segura.
            </p>
          </div>
        </div>

        
        <div className="border-t border-gray-100 px-6 py-4 flex gap-2 flex-shrink-0 bg-white">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading || isSubmitting}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Voltar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || isSubmitting}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
          >
            {isSubmitting ? "Processando..." : "Confirmar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
