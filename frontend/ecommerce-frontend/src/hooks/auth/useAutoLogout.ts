import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const TOKEN_EXPIRED_EVENT = "token-expired";

export function useAutoLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    function handleTokenExpired() {
      logout();
      toast.error("Sua sessão expirou. Faça login novamente.");
      navigate("/login", { replace: true });
    }
    globalThis.addEventListener(TOKEN_EXPIRED_EVENT, handleTokenExpired);
    return () => {
      globalThis.removeEventListener(TOKEN_EXPIRED_EVENT, handleTokenExpired);
    };
  }, [logout, navigate]);
}
