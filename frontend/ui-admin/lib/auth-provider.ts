"use client";

import { apiFetch, tokenStore } from "./api";

type LoginResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export const authProvider = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      tokenStore.setTokens(res.data.accessToken, res.data.refreshToken);
      return { success: true, redirectTo: "/dashboard" };
    } catch (e) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: e instanceof Error ? e.message : "로그인에 실패했습니다.",
        },
      };
    }
  },
  logout: async () => {
    tokenStore.clear();
    return { success: true, redirectTo: "/login" };
  },
  check: async () => {
    const token = tokenStore.getAccessToken();
    if (token) {
      return { authenticated: true };
    }
    return { authenticated: false, redirectTo: "/login" };
  },
  onError: async (error: unknown) => {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("401") || message.toLowerCase().includes("unauthorized")) {
      tokenStore.clear();
      return { logout: true, redirectTo: "/login" };
    }
    return { error: error as Error };
  },
  getIdentity: async () => {
    const token = tokenStore.getAccessToken();
    if (!token) return null;
    return { id: "current-user", name: "관리자" };
  },
  getPermissions: async () => ["dashboard:view", "admin:crud"],
};
