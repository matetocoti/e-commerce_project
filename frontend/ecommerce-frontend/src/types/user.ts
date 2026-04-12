export type UserRole = "Customer" | "Admin";

export interface UserDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  phoneNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}