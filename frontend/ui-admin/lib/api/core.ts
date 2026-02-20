import { tokenStore } from "./token-store";

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    fieldErrors?: Record<string, string>;
  };
};

type ReissueResponse = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

let reissuePromise: Promise<boolean> | null = null;

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

async function parseEnvelope<T>(response: Response): Promise<ApiEnvelope<T>> {
  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return {
      success: false,
      data: null as T,
      error: { code: String(response.status), message: `Request failed: ${response.status}` },
    };
  }
}

async function requestWithToken(path: string, init: RequestInit | undefined, accessToken: string | null): Promise<Response> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
}

async function tryReissueToken(): Promise<boolean> {
  if (reissuePromise) {
    return reissuePromise;
  }

  reissuePromise = (async () => {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const payload = await parseEnvelope<ReissueResponse>(response);
    if (!response.ok || !payload.success || !payload.data?.accessToken) {
      return false;
    }

    tokenStore.setTokens(payload.data.accessToken, payload.data.refreshToken);
    return true;
  })();

  try {
    return await reissuePromise;
  } finally {
    reissuePromise = null;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/api/auth/reissue") {
    throw new Error("apiFetch cannot call /api/auth/reissue directly.");
  }

  let response = await requestWithToken(path, init, tokenStore.getAccessToken());

  if (response.status === 401) {
    const reissued = await tryReissueToken();
    if (reissued) {
      response = await requestWithToken(path, init, tokenStore.getAccessToken());
    } else {
      tokenStore.clear();
      redirectToLogin();
      throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
    }
  }

  const payload = await parseEnvelope<T>(response);
  if (!response.ok || payload.success === false) {
    const message = payload.error?.message ?? `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return payload;
}
