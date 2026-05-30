import { apiFetch } from "./client";
import type { CreateOrderDto, OrderDto ,CheckOrderStatusResponse} from "../types/order";

export interface GetOrdersParams {
  page?: number;
  pageSize?: number;
}

export async function getOrders(params: GetOrdersParams = {}): Promise<OrderDto[]> {
  const searchParams = new URLSearchParams();
  if (params.page !== undefined) {
    searchParams.append("page", String(params.page));
  }
  if (params.pageSize !== undefined) {
    searchParams.append("pageSize", String(params.pageSize));
  }
  const query = searchParams.toString();
  const endpoint = query ? `/api/Order?${query}` : "/api/Order";
  return apiFetch<OrderDto[]>(endpoint);
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

export async function cancelOrder(id: string): Promise<void> {
  await apiFetch(`/api/Order/${id}/cancel`, {
    method: "POST",
  });
}

export async function checkOrderStatus(id: string): Promise<CheckOrderStatusResponse> {
  return apiFetch<CheckOrderStatusResponse>(`/api/Order/${id}/status`);
}