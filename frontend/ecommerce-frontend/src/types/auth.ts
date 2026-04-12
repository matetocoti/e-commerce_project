import type { UserDto } from "./user";

export interface LoginUserDto {
  login: string;
  password: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}