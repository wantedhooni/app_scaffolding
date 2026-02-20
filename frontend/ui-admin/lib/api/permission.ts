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

export async function getPermissionPage<T>(params: Record<string, unknown> = { page: 0, size: 50 }): Promise<PageResponse<T>> {
  const query = toQuery(params);
  const res = await apiFetch<PageResponse<T>>(`/api/permission/list${query ? `?${query}` : ""}`, { method: "GET" });
  return res.data;
}

export async function getPermission<T>(permissionId: string): Promise<T> {
  const res = await apiFetch<T>(`/api/permission/${permissionId}`, { method: "GET" });
  return res.data;
}

export async function createPermission<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await apiFetch<T>("/api/permission/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updatePermission<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await apiFetch<T>("/api/permission/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function deletePermission(permissionId: string): Promise<DeleteResponse> {
  const res = await apiFetch<DeleteResponse>("/api/permission/delete", {
    method: "POST",
    body: JSON.stringify({ permissionId }),
  });
  return res.data;
}
