import { useState } from "react";
import { toast } from "sonner";
import { register } from "../../api/authApi";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(username: string, email: string,password: string, confirmPassword: string) {
    try {
      setLoading(true);
      setError(null);

      await register({ username, email, password, confirmPassword });

      toast.success("Conta criada com sucesso!");

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer registro";

      setError(message);
      toast.error(message);

      return false;
    } finally {
      setLoading(false);
    }
  }

  return { handleRegister, loading, error };
}