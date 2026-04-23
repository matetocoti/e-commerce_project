import { apiFetch } from "./client";
import type { ProductDto } from "../types/product";

interface GetProductsParams {
  page?: number;
  pageSize?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductDto[]> {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.append("page", String(params.page));
  }

  if (params.pageSize) {
    searchParams.append("pageSize", String(params.pageSize));
  }

  const query = searchParams.toString();
  const endpoint = query ? `/api/product?${query}` : "/api/product";

  return apiFetch<ProductDto[]>(endpoint);
}

export async function getProductById(id: string): Promise<ProductDto> {
  return apiFetch<ProductDto>(`/api/product/${id}`);
}

export async function searchProducts(query: string, page = 1, pageSize = 9,): Promise<ProductDto[]> {
  const searchParams = new URLSearchParams({
    query,
    page: String(page),
    pageSize: String(pageSize),
  });

  return apiFetch<ProductDto[]>(
    `/api/product/search?${searchParams.toString()}`,
  );
}