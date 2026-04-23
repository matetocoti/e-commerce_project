export const ProductType = {
  PHYSICAL: 0,
  DIGITAL: 1,
} as const;

export type ProductType =
  (typeof ProductType)[keyof typeof ProductType];

export interface ProductDto {
  id: string;
  imageUrl: string | null; 
  name: string;
  price: number;
  description: string;
  info: string;
  type: ProductType;
}

// Admin-specific product data transfer objects (DTOs)
export interface AdminProductDto {
  id: string;
  imageUrl: string | null; 
  name: string;
  description: string;
  info: string;
  type: ProductType;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  imageUrl?: string | null; 
  name: string;
  description: string;
  info: string;
  type: ProductType;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  imageUrl?: string | null; 
  name: string;
  description: string;
  info: string;
  type: ProductType;
  price: number;
  stock: number;
}