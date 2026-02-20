import { apiFetch } from "./core";
import type { DeleteResponse, PageResponse } from "./types";

function toQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, String(item)));
      return;
    }
    search.set(key, String(value));
  });
  return search.toString();
}

export async function getAdminPage<T>(params: Record<string, unknown> = { page: 0, size: 50 }): Promise<PageResponse<T>> {
  const query = toQuery(params);
  const res = await apiFetch<PageResponse<T>>(`/api/admin/list${query ? `?${query}` : ""}`, { method: "GET" });
  return res.data;
}

export async function getAdmin<T>(adminId: string): Promise<T> {
  const res = await apiFetch<T>(`/api/admin/${adminId}`, { method: "GET" });
  return res.data;
}

export async function createAdmin<T>(payload: { email: string; password: string }): Promise<T> {
  const res = await apiFetch<T>("/api/admin/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateAdmin<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await apiFetch<T>("/api/admin/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteAdmin(adminId: string): Promise<DeleteResponse> {
  const res = await apiFetch<DeleteResponse>("/api/admin/delete", {
    method: "POST",
    body: JSON.stringify({ adminId }),
  });
  return res.data;
}
