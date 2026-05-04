import { apiFetch } from "./client";
import type { ProductDto } from "../types/product";

export interface PublicProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(params: PublicProductQueryParams = {}): Promise<ProductDto[]> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.append("pageSize", String(params.pageSize));
  }

  if (params.search) {
    searchParams.append("search", params.search);
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

  const query = searchParams.toString();
  const endpoint = query ? `/api/product?${query}` : "/api/product";

  return apiFetch<ProductDto[]>(endpoint);
}

export async function getProductById(id: string): Promise<ProductDto> {
  return apiFetch<ProductDto>(`/api/product/${id}`);
}

