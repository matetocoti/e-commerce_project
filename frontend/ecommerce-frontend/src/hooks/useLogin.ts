import { useState } from "react";
import { login } from "../api/authApi";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(loginInput: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      const data = await login({ login: loginInput, password });

      // futuramente salvar token
      localStorage.setItem("auth", JSON.stringify(data));

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao fazer login"
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { handleLogin, loading, error };
}