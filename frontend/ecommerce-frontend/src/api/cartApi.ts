import type { AddCartItemDto, CartDto } from "../types/cart";
import { apiFetch } from "./client";

export async function getCart(): Promise<CartDto> {
  return apiFetch<CartDto>("/api/Cart");
}

export async function addCartItem(data: AddCartItemDto): Promise<void> {
  await apiFetch<void>("/api/Cart/add", { method: "POST", body: data });
}

export async function removeCartItem(productId: string, quantityToRemove?: number): Promise<void> {
  const query =
    quantityToRemove && quantityToRemove > 0
      ? `?quantityToRemove=${quantityToRemove}`
      : "";

  await apiFetch<void>(`/api/Cart/items/${productId}${query}`, {
    method: "DELETE",
  });
}

export async function clearCart(): Promise<void> {
  await apiFetch<void>("/api/Cart/clear", { method: "DELETE" });
}