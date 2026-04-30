import { apiFetch } from "./client";
import { type UserDto } from "../types/user";

export async function getCurrentUser(): Promise<UserDto> {
  return apiFetch("/api/account/me");
}

export async function setUsername(params: { username: string }) {
  return apiFetch("/api/account/username", {
    method: "PUT",
    body: params,
  });
}

export async function setPhoneNumber(params: { phoneNumber: string }) {
  return apiFetch("/api/account/phone", {
    method: "PUT",
    body: params,
  });
}