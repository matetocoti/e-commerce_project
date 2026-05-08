import { apiFetch } from "./client";
import type {
  AdminProductDto,
  CreateProductDto,
  UpdateProductDto,
} from "../types/product";

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export async function getAdminProducts(params: GetProductsParams = {}): Promise<AdminProductDto[]> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.append("pageSize", String(params.pageSize));
  }

  if (params.isActive !== undefined) {
    searchParams.append("isActive", String(params.isActive));
  }

  if (params.type !== undefined) {
    searchParams.append("type", String(params.type));
  }

  if (params.minPrice !== undefined) {
    searchParams.append("minPrice", String(params.minPrice));
  }

  if (params.maxPrice !== undefined) {
    searchParams.append("maxPrice", String(params.maxPrice));
  }

  if (params.search) {
    searchParams.append("search", params.search);
  }

  const query = searchParams.toString();
  const endpoint = query
    ? `/api/Admin/product?${query}`
    : "/api/Admin/product";

  return apiFetch<AdminProductDto[]>(endpoint);
}

export async function getAdminProductById(id: string): Promise<AdminProductDto> {
  const endpoint = `/api/Admin/product/${id}`;
  return apiFetch<AdminProductDto>(endpoint);
}

export async function createAdminProduct(productData: CreateProductDto): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>("/api/Admin/product", {
    method: "POST",
    body: productData,
  });
}

export async function updateAdminProduct(id: string, productData: UpdateProductDto): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${id}`, {
    method: "PUT",
    body: productData,
  });
}

// Note: This function is now used for deactivating a product instead of deleting it permanently
// in the future it will be renamed to deactivateAdminProduct and the API endpoint will be updated accordingly
// for better clarity and to avoid confusion, the endpoint will be updated to /api/Admin/product/{id}/deactivate and the function will be renamed to deactivateAdminProduct
export async function deleteAdminProduct(id: string): Promise<void> {
  await apiFetch<void>(`/api/Admin/product/${id}`, {
    method: "DELETE",
  });
}

// Alias for clarity - this deactivates a product (currently same as delete)
export async function deactivateAdminProduct(id: string): Promise<void> {
  return deleteAdminProduct(id);
}

// New function to activate a product 
 
export async function activateAdminProduct(id: string): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${id}/activate`, {
    method: "POST",
  });
}