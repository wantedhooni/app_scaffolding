import { expect, test } from "@playwright/test";

test("admins search sends one filtered request per click", async ({ page }) => {
  const matchesFilteredSearchRequest = (url: string) => {
    const decoded = decodeURIComponent(url);
    if (!decoded.includes("/api/admin/search")) {
      return false;
    }

    const paramQuery = new URL(decoded).searchParams.get("paramQuery");
    if (!paramQuery) {
      return false;
    }

    const tokens = paramQuery.split(",");
    return tokens.includes("keyword:sysadmin") && tokens.includes("email:sysadmin");
  };

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
    if (matchesFilteredSearchRequest(request.url())) {
      filteredSearchCount += 1;
    }
  });

  await page.getByPlaceholder("Keyword").fill("sysadmin");
  await page.getByRole("button", { name: "Search" }).click();
  await expect.poll(() => filteredSearchCount).toBe(1);

  expect(filteredSearchCount).toBe(1);

  await page.getByRole("button", { name: "Search" }).click();
  await expect.poll(() => filteredSearchCount).toBe(2);

  expect(filteredSearchCount).toBe(2);
});
