export const PaymentMethod = {
  PIX: 1,
  LIGHTNING: 2,
} as const;

export type PaymentMethod =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface PayOrderRequestDto {
  method: PaymentMethod;
  customerEmail: string;
  customerCpf: string;
}

export const PaymentStatus = {
  PENDING: 1,
  CONFIRMED: 2,
  FAILED: 3,
  EXPIRED: 4,
} as const;

export type PaymentStatus =
  (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface PaymentDto {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: string | null;
  externalPaymentId?: string;
  pixResponseDto?: PixResponseDto;
}

export interface PixResponseDto {
  pixCopyAndPaste: string;
  pixLink: string;
}

export interface PaymentDataResponse {
  pixResponseData: PixResponseDto;
}