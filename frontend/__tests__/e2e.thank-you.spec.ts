import { expect, test } from "@playwright/test";

// Simple direct test of the thank-you route
// This avoids coupling to the API and focuses on the UI behavior

test.describe("Thank-you route", () => {
  test("renders dialog and close navigates back to contact", async ({ page }) => {
    await page.goto("/contact/thank-you");

    await expect(
      page.getByRole("heading", { name: "Thanks for getting in touch" }),
    ).toBeVisible();

    // Close button navigates back
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
  });
});
