import { apiFetch } from "./client";
import type {
  AdminProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../types/product";

interface GetProductsParams {
  page?: number;
  pageSize?: number;
}

export async function getAdminProducts(params: GetProductsParams = {}): Promise<AdminProductDto[]> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.append("pageSize", String(params.pageSize));
  }

  const query = searchParams.toString();
  const endpoint = query
    ? `/api/Admin/product?${query}`
    : "/api/Admin/product";

  return apiFetch<AdminProductDto[]>(endpoint);
}

export async function getAdminProductById(productId: string): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${productId}`);
}

export async function createAdminProduct(productData: CreateProductDto): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>("/api/Admin/product", {
    method: "POST",
    body: productData,
  });
}

export async function updateAdminProduct(productId: string,productData: UpdateProductDto): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${productId}`, {
    method: "PUT",
    body: productData,
  });
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await apiFetch<void>(`/api/Admin/product/${productId}`, {
    method: "DELETE",
  });
}