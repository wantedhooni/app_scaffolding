"use client";

import type { DataProvider, CrudFilters, CrudSorting } from "@refinedev/core";

import { apiClient } from "@providers/http-client";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: {
    message?: string;
  };
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const resourcePathMap: Record<string, string> = {
  admin: "/api/admin",
  admins: "/api/admin",
  role: "/api/role",
  roles: "/api/role",
  permission: "/api/permission",
  permissions: "/api/permission",
};

const resolveResourcePath = (resource: string): string => {
  return resourcePathMap[resource] ?? `/api/${resource}`;
};

const unwrap = <T>(payload: ApiResponse<T>): T => {
  if (!payload.success) {
    throw new Error(payload.error?.message ?? "Request failed");
  }

  return payload.data;
};

const toSortParams = (sorters?: CrudSorting) => {
  const firstSorter = sorters?.[0];

  if (!firstSorter) {
    return {
      sortBy: undefined,
      sortDirection: undefined,
    };
  }

  return {
    sortBy: firstSorter.field,
    sortDirection: firstSorter.order?.toUpperCase(),
  };
};

const toParamQuery = (filters?: CrudFilters): string | undefined => {
  if (!filters || filters.length === 0) {
    return undefined;
  }

  const tokens = filters
    .flatMap((filter) => {
      if (!("field" in filter) || typeof filter.field !== "string" || !("value" in filter)) {
        return [];
      }

      const value = filter.value;
      if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
        return [];
      }

      return [`${filter.field}:${String(value).trim()}`];
    })
    .filter((token) => !token.endsWith(":"));

  if (tokens.length === 0) {
    return undefined;
  }

  return tokens.join(",");
};

export const dataProvider: DataProvider = {
  getApiUrl: () => API_BASE_URL,

  getList: async ({ resource, pagination, sorters, filters }) => {
    const path = resolveResourcePath(resource);
    const current = pagination?.currentPage ?? 1;
    const page = Math.max(0, current - 1);
    const size = pagination?.pageSize ?? 20;
    const { sortBy, sortDirection } = toSortParams(sorters);

    const response = await apiClient.get<ApiResponse<PageResponse<any>>>(
      `${path}/search`,
      {
        params: {
          page,
          size,
          sortBy,
          sortDirection,
          paramQuery: toParamQuery(filters),
        },
      },
    );

    const pageData = unwrap(response.data);

    return {
      data: pageData.content,
      total: pageData.totalElements,
    };
  },

  getOne: async ({ resource, id }) => {
    const path = resolveResourcePath(resource);
    const response = await apiClient.get<ApiResponse<any>>(`${path}/${id}`);

    return {
      data: unwrap(response.data),
    };
  },

  getMany: async ({ resource, ids }) => {
    const path = resolveResourcePath(resource);

    const responses = await Promise.all(
      ids.map(async (id) => {
        const response = await apiClient.get<ApiResponse<any>>(`${path}/${id}`);
        return unwrap(response.data);
      }),
    );

    return {
      data: responses,
    };
  },

  create: async ({ resource, variables }) => {
    const path = resolveResourcePath(resource);
    const response = await apiClient.post<ApiResponse<any>>(
      `${path}/create`,
      variables,
    );

    return {
      data: unwrap(response.data),
    };
  },

  update: async ({ resource, id, variables }) => {
    const path = resolveResourcePath(resource);
    const response = await apiClient.post<ApiResponse<any>>(
      `${path}/${id}/update`,
      variables,
    );

    return {
      data: unwrap(response.data),
    };
  },

  deleteOne: async ({ resource, id }) => {
    const path = resolveResourcePath(resource);
    await apiClient.post<ApiResponse<void>>(`${path}/${id}/delete`);

    return {
      data: {
        id,
      } as any,
    };
  },

  custom: async ({ url, method, payload, query, headers }) => {
    const response = await apiClient.request({
      url,
      method,
      data: payload,
      params: query,
      headers,
    });

    return {
      data: response.data,
    };
  },
};
