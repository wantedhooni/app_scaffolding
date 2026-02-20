const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const encoded = encodeURIComponent(name) + "=";
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const cookie of cookies) {
    if (!cookie.startsWith(encoded)) continue;
    return decodeURIComponent(cookie.substring(encoded.length));
  }
  return null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

export const tokenStore = {
  getAccessToken: () => getCookie(ACCESS_TOKEN_COOKIE),
  getRefreshToken: () => getCookie(REFRESH_TOKEN_COOKIE),
  setTokens: (accessToken: string, refreshToken: string) => {
    // Access token: 30 minutes, Refresh token: 7 days
    setCookie(ACCESS_TOKEN_COOKIE, accessToken, 60 * 30);
    setCookie(REFRESH_TOKEN_COOKIE, refreshToken, 60 * 60 * 24 * 7);
  },
  clear: () => {
    clearCookie(ACCESS_TOKEN_COOKIE);
    clearCookie(REFRESH_TOKEN_COOKIE);
  },
};
