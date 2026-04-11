export interface ProductDto {
  id: string;
  imageUrl: string | null; 
  name: string;
  price: number;
  description: string;
}


export interface AdminProductDto {
  id: string;
  imageUrl: string | null; 
  name: string;
  description: string;
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
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  imageUrl?: string | null; 
  name: string;
  description: string;
  price: number;
  stock: number;
}