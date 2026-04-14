import { useState } from "react";
import { toast } from "sonner";
import { login } from "../api/authApi";
import { dispatchAuthChanged } from "./useAuth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(loginInput: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      const data = await login({ login: loginInput, password });

      localStorage.setItem("auth", JSON.stringify(data));
      dispatchAuthChanged();

      toast.success("Login realizado com sucesso!");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer login";

      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading, error };
}