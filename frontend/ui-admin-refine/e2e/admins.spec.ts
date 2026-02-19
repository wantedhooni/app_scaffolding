import { expect, test } from "@playwright/test";
import { mockApi } from "./helpers";

test("사용자 생성/수정/삭제 커맨드 UI 흐름", async ({ page }) => {
  await mockApi(page);

  await page.goto("/login");
  await page.getByRole("button", { name: "로그인" }).click();
  await page.waitForURL("**/dashboard");

  await page.goto("/admins");
  await expect(page.getByText("사용자 관리")).toBeVisible();

  await page.locator("button", { hasText: "사용자 생성" }).first().evaluate((el) => {
    (el as HTMLButtonElement).click();
  });
  const createModal = page.locator(".ant-modal-content").filter({ hasText: "사용자 생성" }).first();
  await expect(createModal).toBeVisible();
  await createModal.locator("input").nth(0).fill("operator@revy.local");
  await createModal.locator("input").nth(1).fill("pass1234!");
  await page.getByRole("button", { name: "생성 실행" }).click();

  await expect(page.getByRole("cell", { name: "operator@revy.local" })).toBeVisible();

  const targetRow = page.locator("tr", { hasText: "operator@revy.local" });
  await targetRow.getByRole("button", { name: "수정" }).click();
  const editModal = page.locator(".ant-modal-content").filter({ hasText: "사용자 수정" }).first();
  await expect(editModal).toBeVisible();
  await editModal.locator("input").first().fill("operator2@revy.local");
  await page.getByRole("button", { name: "수정 반영" }).click();

  await expect(page.getByRole("cell", { name: "operator2@revy.local" })).toBeVisible();

  const updatedRow = page.locator("tr", { hasText: "operator2@revy.local" });
  await updatedRow.getByRole("button", { name: "삭제" }).click();
  await page.getByRole("button", { name: /OK|확인/ }).click();

  await expect(page.getByRole("cell", { name: "operator2@revy.local" })).toHaveCount(0);
});
