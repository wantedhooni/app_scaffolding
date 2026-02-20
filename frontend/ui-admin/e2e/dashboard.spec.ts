import { expect, test } from "@playwright/test";
import { mockApi } from "./helpers";

test("대시보드에서 Swagger 기반 메뉴 맵 노출", async ({ page }) => {
  await mockApi(page);
  await page.goto("/login");
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForURL("**/dashboard");

  await expect(page.getByText("API 메뉴 맵")).toBeVisible();
  await expect(page.getByRole("cell", { name: "/api/admin/create" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "/api/auth/login" })).toBeVisible();
});
