/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 * @param value - CPF com ou sem formatação
 * @returns CPF formatado
 */
export function formatCpf(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9)
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
}

/**
 * Remove formatação do CPF
 * @param value - CPF formatado
 * @returns CPF apenas com dígitos
 */
export function cleanCpf(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Valida CPF
 * @param cpf - CPF com ou sem formatação
 * @returns objeto com validação e mensagem de erro
 */
export function validateCpf(cpf: string): { isValid: boolean; error?: string } {
  if (!cpf.trim()) {
    return { isValid: false, error: "CPF é obrigatório" };
  }

  const cleanedCpf = cleanCpf(cpf);
  if (cleanedCpf.length !== 11) {
    return { isValid: false, error: "CPF deve conter 11 dígitos" };
  }

  return { isValid: true };
}

/**
 * Valida email
 * @param email - email a validar
 * @returns objeto com validação e mensagem de erro
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email.trim()) {
    return { isValid: false, error: "Email é obrigatório" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: "Email inválido" };
  }

  return { isValid: true };
}
