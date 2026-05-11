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
  hasImage?: boolean;
  hasLowStock?: boolean;
  outOfStock?: boolean;
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

  if (params.hasImage !== undefined) {
    searchParams.append("hasImage", String(params.hasImage));
  }

  if (params.hasLowStock !== undefined) {
    searchParams.append("hasLowStock", String(params.hasLowStock));
  }

  if (params.outOfStock !== undefined) {
    searchParams.append("outOfStock", String(params.outOfStock));
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


export async function toggleAdminProductStatus(id: string): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${id}/toggle-status`, {
    method: "PATCH",
  });
}