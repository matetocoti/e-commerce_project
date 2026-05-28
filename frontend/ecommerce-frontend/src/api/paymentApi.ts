import { apiFetch } from "./client";
import type { PayOrderRequestDto ,PaymentDto } from "../types/payment";

// Payment API functions -- for fake and real implementations 
export const payOrder = async (orderId: string, data: PayOrderRequestDto) => {
  const url = `/api/Payment/${orderId}`;
  return await apiFetch<PaymentDto>(url, {
    method: "POST",
    body: data,
  });
};