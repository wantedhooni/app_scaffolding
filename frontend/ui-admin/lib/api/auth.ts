import { apiFetch } from "./core";
import { tokenStore } from "./token-store";

export type LoginResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data;
}

export async function loginAndStoreTokens(email: string, password: string): Promise<LoginResponse> {
  const data = await login(email, password);
  tokenStore.setTokens(data.accessToken, data.refreshToken);
  return data;
}
