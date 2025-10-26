import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("loads core content and navigation", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Welcome to" })
    ).toBeVisible();
    await expect(page.getByText("OpenAgent")).toBeVisible();

    // Header links
    await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Contact" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();

    // Footer owner
    await expect(
      page.getByRole("link", { name: "Andrew Wilks" })
    ).toBeVisible();
  });
});
