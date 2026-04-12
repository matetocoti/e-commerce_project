import { apiFetch } from "./client";
import type { AuthResponseDto, LoginUserDto, RegisterUserDto } from "../types/auth";

export async function login(data: LoginUserDto): Promise<AuthResponseDto> {
  return apiFetch<AuthResponseDto>("/api/auth/login", {
    method: "POST",
    body: data,
  });
}

export async function register(data: RegisterUserDto): Promise<AuthResponseDto> {
  return apiFetch<AuthResponseDto>("/api/auth/register", {
    method: "POST",
    body: data,
  });
}