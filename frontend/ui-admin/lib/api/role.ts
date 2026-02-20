import { apiFetch } from "./core";
import type { DeleteResponse, PageResponse } from "./types";

function toQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    search.set(key, String(value));
  });
  return search.toString();
}

export async function getRolePage<T>(params: Record<string, unknown> = { page: 0, size: 50 }): Promise<PageResponse<T>> {
  const query = toQuery(params);
  const res = await apiFetch<PageResponse<T>>(`/api/role/list${query ? `?${query}` : ""}`, { method: "GET" });
  return res.data;
}

export async function getRole<T>(roleId: string): Promise<T> {
  const res = await apiFetch<T>(`/api/role/${roleId}`, { method: "GET" });
  return res.data;
}

export async function createRole<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await apiFetch<T>("/api/role/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateRole<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await apiFetch<T>("/api/role/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deleteRole(roleId: string): Promise<DeleteResponse> {
  const res = await apiFetch<DeleteResponse>("/api/role/delete", {
    method: "POST",
    body: JSON.stringify({ roleId }),
  });
  return res.data;
}

export async function addAdminToRole<T>(roleId: string, adminId: string): Promise<T> {
  const res = await apiFetch<T>("/api/role/add-admin", {
    method: "POST",
    body: JSON.stringify({ roleId, adminId }),
  });
  return res.data;
}
