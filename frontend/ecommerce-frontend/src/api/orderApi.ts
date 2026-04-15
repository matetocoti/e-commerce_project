import { apiFetch } from "./client";
import type { CreateOrderDto, OrderDto } from "../types/order";

export async function getOrders(): Promise<OrderDto[]> {
  return apiFetch<OrderDto[]>("/api/Order");
}

export async function getOrderById(id: string): Promise<OrderDto> {
  return apiFetch<OrderDto>(`/api/Order/${id}`);
}

export async function checkout(orderData: CreateOrderDto): Promise<OrderDto> {
  return apiFetch<OrderDto>("/api/Order/checkout", {
    method: "POST",
    body: orderData,
  });
}