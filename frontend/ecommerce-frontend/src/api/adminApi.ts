import { apiFetch } from './client';
import type { AdminProductDto, CreateProductDto, UpdateProductDto } from '../types/product';

export async function getAdminProducts(): Promise<AdminProductDto[]> {
  return apiFetch<AdminProductDto[]>('/api/Admin/product');
}

export async function getAdminProductById(productId: string): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${productId}`);
}

export async function createAdminProduct(productData: CreateProductDto): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>('/api/Admin/product', {
    method: 'POST',
    body: productData,
  });
}

export async function updateAdminProduct(productId: string, productData: UpdateProductDto): Promise<AdminProductDto> {
  return apiFetch<AdminProductDto>(`/api/Admin/product/${productId}`, {
    method: 'PUT',
    body: productData,
  });
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  await apiFetch<void>(`/api/Admin/product/${productId}`, {
    method: 'DELETE',
  });
}
