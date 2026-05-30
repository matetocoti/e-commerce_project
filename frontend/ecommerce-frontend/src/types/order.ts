import type { PaymentDto } from "./payment";

export interface Address {
  street: string;
  city: string;
  zipCode: string;
  state: string;
  notes?: string;
}

export interface DigitalContactInfo {
  email: string;
  phoneNumber: string;
}

export interface OrderItemDto {
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}
const OrderStatus = {
  Pending: "Pending",
  AwaitingPayment: "AwaitingPayment",
  Paid: "Paid",
  Cancelled: "Cancelled",
  Expired: "Expired",
} as const;

export type OrderStatus =
  (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderDto {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  expiresAt: string;
  address?: Address;
  digitalContact?: DigitalContactInfo;
  items: OrderItemDto[];
  payments?: PaymentDto[];
}

export interface CheckOrderStatusResponse {
  id: string;
  status: OrderStatus;
}




export type CreateOrderDto = CreatePhysicalOrderDto | CreateDigitalOrderDto;


export interface CreateDigitalOrderDto {
  email: string;
  phoneNumber: string;
}

export interface CreatePhysicalOrderDto {
  street: string;
  city: string;
  zipCode: string;
  state: string;
  notes?: string;
}

export type OrderList = OrderDto[];

export type CheckoutResponse = OrderDto;