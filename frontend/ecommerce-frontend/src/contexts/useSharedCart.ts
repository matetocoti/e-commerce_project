import { useContext } from "react";
import { CartContext } from "./CartContextDef";

export function useSharedCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useSharedCart deve ser usado dentro de CartProvider");
  }
  return context;
}
