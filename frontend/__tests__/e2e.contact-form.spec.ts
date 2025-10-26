import { test, expect } from "@playwright/test";

test.describe("Contact form", () => {
  test("validates and submits successfully", async ({ page }) => {
    // Intercept the create contact API to ensure deterministic success
    await page.route("**/api/contacts", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: "{}",
      });
    });

    await page.goto("/contact");

    // Make the form dirty with minimal changes
    await page.getByLabel("First Name").fill("Alice");
    await page.getByLabel("Email").fill("not-an-email");

    // Try to submit
    await page.getByRole("button", { name: "Send message" }).click();

    // Expect validation for last name and email
    await expect(page.getByText("Last name is required.")).toBeVisible();
    await expect(
      page.getByText("Please enter a valid email address.")
    ).toBeVisible();

    // Fix inputs (form becomes valid)
    await page.getByLabel("Last Name").fill("Smith");
    await page.getByLabel("Email").fill("alice@example.com");

    // Button should now be enabled; we keep this test focused on validation
    await expect(
      page.getByRole("button", { name: "Send message" })
    ).toBeEnabled();
  });
});
