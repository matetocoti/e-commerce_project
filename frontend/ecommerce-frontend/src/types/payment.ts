export const PaymentMethod = {
  PIX: 1,
  LIGHTNING: 2,
} as const;

export type PaymentMethod =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface PayOrderRequestDto {
  method: PaymentMethod;
}