export interface PasswordStrength {
  strength: number;
  label: "" | "Fraca" | "Média" | "Forte";
  color: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) {
    return { strength: 0, label: "", color: "" };
  }

  // Avaliação simples baseada em critérios comuns
  let score = 0;

  // Critérios de avaliação
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 8) score++;

  if (score <= 2) {
    return { strength: 1, label: "Fraca", color: "bg-red-500" };
  }

  if (score <= 4) {
    return { strength: 2, label: "Média", color: "bg-yellow-500" };
  }

  return { strength: 3, label: "Forte", color: "bg-green-500" };
}