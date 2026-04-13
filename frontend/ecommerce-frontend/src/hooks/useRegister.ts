import { useState } from "react";
import { register } from "../api/authApi";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    async function handleRegister(username: string, email: string, password: string, confirmPassword: string) {
    try {
      setLoading(true);
      setError(null);
        const data = await register({ username, email, password, confirmPassword });
        
        localStorage.setItem("auth", JSON.stringify(data));
        return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao fazer registro"
      );
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { handleRegister, loading, error };
}