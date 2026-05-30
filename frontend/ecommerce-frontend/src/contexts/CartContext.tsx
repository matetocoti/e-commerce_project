import { useCallback, useState, useEffect, useMemo } from "react";
import { getCart } from "../api/cartApi";
import { CartContext, type CartContextType } from "./CartContextDef";

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [cart, setCart] = useState<CartContextType["cart"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reloadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCart(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar carrinho.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadCart();
  }, [reloadCart]);

  const value = useMemo(
    () => ({ cart, loading, error, reloadCart }),
    [cart, loading, error, reloadCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
