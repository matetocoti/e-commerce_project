import { createContext } from "react";
import type { CartDto } from "../types/cart";

export interface CartContextType {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
  reloadCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
