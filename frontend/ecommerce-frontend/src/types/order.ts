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

export const OrderStatus = {
  Pending: 1,
  AwaitingPayment: 2,
  Paid: 3,
  Cancelled: 4,
  Expired: 5
} as const;

export type OrderStatus =
  (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderDto {
  id: string;
  status: OrderStatus;
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