import { expect, test } from "@playwright/test";

test("admins search sends one filtered request per click", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel(/e-?mail/i).fill("sysadmin@system.dev");
  await page.getByLabel(/password/i).fill("qwer1234!");
  await page.getByRole("button", { name: /sign in|login/i }).click();

  await page.waitForURL(/\/domain\/[a-z-]+(?:\?.*)?$/);
  await page.goto("/domain/admins");
  await page.waitForURL(/\/domain\/admins(?:\?.*)?$/);
  await page.waitForTimeout(800);

  let filteredSearchCount = 0;
  page.on("request", (request) => {
    const url = request.url();
    if (
      url.includes("/api/admin/search") &&
      url.includes("paramQuery=keyword:sysadmin,email:sysadmin")
    ) {
      filteredSearchCount += 1;
    }
  });

  await page.getByPlaceholder("Keyword").fill("sysadmin");
  await page.getByRole("button", { name: "Search" }).click();

  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/admin/search") &&
      response.url().includes("paramQuery=keyword:sysadmin,email:sysadmin") &&
      response.status() === 200,
  );
  await page.waitForTimeout(800);

  expect(filteredSearchCount).toBe(1);

  await page.getByRole("button", { name: "Search" }).click();
  await page.waitForResponse(
    (response) =>
      response.url().includes("/api/admin/search") &&
      response.url().includes("paramQuery=keyword:sysadmin,email:sysadmin") &&
      response.status() === 200,
  );
  await page.waitForTimeout(800);

  expect(filteredSearchCount).toBe(2);
});
