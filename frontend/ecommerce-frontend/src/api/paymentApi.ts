import { apiFetch } from "./client";
import type { PayOrderRequestDto } from "../types/payment";

// Payment API functions -- for now fake payment method
export const payOrder = async (orderId: string, data: PayOrderRequestDto) => {
  return await apiFetch<PayOrderRequestDto>(`/api/Payment/${orderId}`, {
    method: "POST",
    body: data,
  });
};