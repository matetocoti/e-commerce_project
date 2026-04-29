import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getCurrentUser } from "../../api/accountApi";
import type { UserDto } from "../../types/user";

interface UseAccountState {
  user: UserDto | null;
  loading: boolean;
  error: string | null;
}

export function useAccount() {
  const [state, setState] = useState<UseAccountState>({
    user: null,
    loading: true,
    error: null,
  });

  const reload = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const user = await getCurrentUser();

      setState({
        user,
        loading: false,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao buscar dados da conta";

      setState({
        user: null,
        loading: false,
        error: message,
      });

      toast.error(message);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(reload);
  }, [reload]);

  return {
    ...state,
    reload,
  };
}