import { expect, test } from "@playwright/test";
import { mockApi } from "./helpers";

test("로그인 성공 후 대시보드로 이동", async ({ page }) => {
  await mockApi(page);

  await page.goto("/login");
  await page.getByRole("button", { name: "로그인" }).click();

  await page.waitForURL("**/dashboard");
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("heading", { name: "API 기반 대시보드" })).toBeVisible();
});
