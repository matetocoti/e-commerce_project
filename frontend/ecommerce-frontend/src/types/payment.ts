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

export interface PaymentDto {
  id: string;
  amount: number;
  method: PaymentMethod;
  paidAt: string;
  externalId?: string;
  PixResponse?: PixResponseDto;
}

export interface PixResponseDto {
  copyAndPaste: string;
  pixLink: string;
}