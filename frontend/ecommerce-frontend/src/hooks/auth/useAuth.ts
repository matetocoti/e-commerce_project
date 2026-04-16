import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { UserDto } from "../../types/user";

interface AuthStorage {
  token: string;
  user: UserDto;
}

interface AuthState {
  user: UserDto | null;
  isAuthenticated: boolean;
}

const AUTH_CHANGED_EVENT = "auth-changed";

function getAuthFromStorage(): AuthState {
  const storedAuth = localStorage.getItem("auth");

  if (!storedAuth) {
    return {
      user: null,
      isAuthenticated: false,
    };
  }

  try {
    const parsed: AuthStorage = JSON.parse(storedAuth);

    return {
      user: parsed.user ?? null,
      isAuthenticated: Boolean(parsed.token),
    };
  } catch {
    return {
      user: null,
      isAuthenticated: false,
    };
  }
}

export function dispatchAuthChanged() {
  globalThis.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function useAuth() {
  const initialAuth = getAuthFromStorage();

  const [user, setUser] = useState<UserDto | null>(initialAuth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuth.isAuthenticated
  );

  function reload() {
    const auth = getAuthFromStorage();

    setUser(auth.user);
    setIsAuthenticated(auth.isAuthenticated);
  }

  function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");

    setUser(null);
    setIsAuthenticated(false);

    dispatchAuthChanged();
    toast.success("Logout realizado com sucesso!");
  }

  useEffect(() => {
    function handleAuthChanged() {
      reload();
    }

    function handleStorageChange() {
      reload();
    }

    globalThis.addEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
    globalThis.addEventListener("storage", handleStorageChange);

    return () => {
      globalThis.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChanged);
      globalThis.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    user,
    isAuthenticated,
    logout,
    reload,
  };
}