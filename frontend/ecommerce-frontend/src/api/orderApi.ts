import { apiFetch } from "./client";
import type { OrderDto, CreateOrderDto } from "../types/order";

export async function getOrders(): Promise<OrderDto[]> {
  return apiFetch<OrderDto[]>("/api/order");
}

export async function getOrderById(id: string): Promise<OrderDto> {
  return apiFetch<OrderDto>(`/api/order/${id}`);
}

export async function createOrder(orderData: CreateOrderDto): Promise<OrderDto> {
  return apiFetch<OrderDto>("/api/order", {
    method: "POST",
    body: orderData,
  });
}