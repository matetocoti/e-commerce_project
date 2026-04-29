import { apiFetch } from "./client";
import { type UserDto } from "../types/user";

export async function getCurrentUser(): Promise<UserDto> {
  return apiFetch("/api/account/me");
}