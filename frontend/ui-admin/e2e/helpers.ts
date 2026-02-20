import { Page, Route } from "@playwright/test";
import openApiDoc from "./fixtures/openapi.json";

type Admin = {
  id: string;
  email: string;
  status: "ACTIVE" | "WITHDRAWN";
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
};

export async function mockApi(page: Page) {
  const corsHeaders = {
    "access-control-allow-origin": "http://localhost:3000",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
  };

  const fulfillJson = async (route: Route, status: number, body: unknown) => {
    await route.fulfill({
      status,
      contentType: "application/json",
      headers: corsHeaders,
      body: JSON.stringify(body),
    });
  };

  await page.route("http://localhost:8080/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }
    await route.fallback();
  });

  let admins: Admin[] = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      email: "sysadmin@system.dev",
      status: "ACTIVE",
      enabled: true,
      roles: ["ROLE_ADMIN"],
      createdAt: "2026-02-19T09:00:00",
      updatedAt: "2026-02-19T09:00:00"
    }
  ];

  await page.route("http://localhost:8080/v3/api-docs", async (route) => {
    await fulfillJson(route, 200, openApiDoc);
  });

  await page.route("http://localhost:8080/api/auth/login", async (route) => {
    const body = route.request().postDataJSON() as { email: string; password: string };
    if (body.email === "sysadmin@system.dev" && body.password === "qwer1234!") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          data: {
            tokenType: "Bearer",
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token"
          },
          error: null
        })
      });
      return;
    }

    await fulfillJson(route, 400, {
      success: false,
      data: null,
      error: { code: "400", message: "이메일 또는 비밀번호가 올바르지 않습니다." },
    });
  });

  await page.route("http://localhost:8080/api/admin?page=0&size=50", async (route) => {
    await fulfillJson(route, 200, {
      success: true,
      data: {
        content: admins,
        totalElements: admins.length,
        totalPages: 1,
        page: 0,
        size: 50,
      },
      error: null,
    });
  });

  await page.route("http://localhost:8080/api/admin/create", async (route) => {
    const payload = route.request().postDataJSON() as { email: string };
    const now = new Date().toISOString();
    const created: Admin = {
      id: "22222222-2222-2222-2222-222222222222",
      email: payload.email,
      status: "ACTIVE",
      enabled: true,
      roles: ["ROLE_ADMIN"],
      createdAt: now,
      updatedAt: now
    };
    admins = [created, ...admins];

    await fulfillJson(route, 200, { success: true, data: created, error: null });
  });

  await page.route("http://localhost:8080/api/admin/update", async (route) => {
    const payload = route.request().postDataJSON() as {
      adminId: string;
      email?: string;
      status?: "ACTIVE" | "WITHDRAWN";
      enabled?: boolean;
    };

    admins = admins.map((item) =>
      item.id === payload.adminId
        ? {
            ...item,
            email: payload.email ?? item.email,
            status: payload.status ?? item.status,
            enabled: payload.enabled ?? item.enabled,
            updatedAt: new Date().toISOString()
          }
        : item
    );

    const updated = admins.find((item) => item.id === payload.adminId);

    await fulfillJson(route, 200, { success: true, data: updated, error: null });
  });

  await page.route("http://localhost:8080/api/admin/delete", async (route) => {
    const payload = route.request().postDataJSON() as { adminId: string };
    admins = admins.filter((item) => item.id !== payload.adminId);

    await fulfillJson(route, 200, {
      success: true,
      data: { id: payload.adminId, deleted: true, message: "사용자를 삭제했습니다." },
      error: null,
    });
  });
}
