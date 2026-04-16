import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
} from "../../api/cartApi";
import type { CartDto } from "../../types/cart";

export function useCart() {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
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

  async function handleAddItem(productId: string, quantity = 1) {
    try {
      setSubmitting(true);
      setError(null);

      await addCartItem({ productId, quantity });
      await loadCart();

      toast.success("Item adicionado ao carrinho!");
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao adicionar item ao carrinho.";

      setError(message);
      toast.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveItem(productId: string, quantityToRemove = 1) {
    try {
      setSubmitting(true);
      setError(null);

      await removeCartItem(productId, quantityToRemove);
      await loadCart();

      toast.success("Item removido do carrinho!");
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erro ao remover item do carrinho.";

      setError(message);
      toast.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClearCart() {
    try {
      setSubmitting(true);
      setError(null);

      await clearCart();
      await loadCart();

      toast.success("Carrinho limpo com sucesso!");
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao limpar carrinho.";

      setError(message);
      toast.error(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  return {
    cart,
    loading,
    submitting,
    error,
    reloadCart: loadCart,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    clear: handleClearCart,
  };
}