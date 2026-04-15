export interface Address {
  street: string;
  city: string;
  zipCode: string;
  state: string;
}

export interface OrderItemDto {
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderDto {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  expiresAt: string;
  address: Address;
  items: OrderItemDto[];
}

export interface CreateOrderDto {
  street: string;
  city: string;
  zipCode: string;
  state: string;
  notes?: string;
}

export type OrderList = OrderDto[];

export type CheckoutResponse = OrderDto;