export interface AddCartItemDto {
  productId: string;
  quantity: number;
}

export interface CartItemDto {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
}