export const UserRole = {
  Admin: 0,
  Customer: 1,
} as const;

export type UserRole =
  (typeof UserRole)[keyof typeof UserRole];

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  phoneNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}