import { useState } from "react";
import { toast } from "sonner";

import {
  addCartItem,
  clearCart,
  removeCartItem,
} from "../../api/cartApi";
import { useSharedCart } from "../../contexts/useSharedCart";

export function useCart() {
  const { cart, loading, error: sharedError, reloadCart } = useSharedCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAddItem(productId: string, quantity = 1) {
    try {
      setSubmitting(true);
      setError(null);

      await addCartItem({ productId, quantity });
      await reloadCart();

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
      await reloadCart();

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
      await reloadCart();

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

  return {
    cart,
    loading,
    submitting,
    error: error || sharedError,
    reloadCart,
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    clear: handleClearCart,
  };
}